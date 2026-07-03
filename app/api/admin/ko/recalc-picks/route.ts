import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcKOPoints } from '@/lib/ko/utils'

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

// POST /api/admin/ko/recalc-picks
// Recalcula puntos de TODOS los picks cuyo partido ya tiene resultado FINISHED.
// Idempotente — se puede correr múltiples veces sin daño.
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const finishedResults = await prisma.kOMatchResult.findMany({
    where: { status: 'FINISHED' },
  })

  let totalPicks   = 0
  let totalChanged = 0
  const details: string[] = []

  for (const result of finishedResults) {
    const picks = await prisma.kOPick.findMany({ where: { matchId: result.id } })
    for (const pick of picks) {
      totalPicks++
      const { total } = calcKOPoints(
        { home: pick.homeGoals, away: pick.awayGoals, penaltyWinner: pick.penaltyWinner as 'home' | 'away' | null | undefined },
        { home: result.homeGoals!, away: result.awayGoals!, penaltyWinner: result.penaltyWinner as 'home' | 'away' | null | undefined },
      )
      if (pick.points !== total) {
        await prisma.kOPick.update({ where: { id: pick.id }, data: { points: total } })
        details.push(`${result.id}: pick ${pick.id} ${pick.points}→${total}`)
        totalChanged++
      }
    }
  }

  // Recalcular KORankingSnapshot para todos los participantes afectados
  const affectedParticipantIds = [...new Set(
    (await prisma.kOPick.findMany({ select: { participantId: true } })).map(p => p.participantId)
  )]

  for (const participantId of affectedParticipantIds) {
    const allPicks = await prisma.kOPick.findMany({
      where: { participantId, points: { not: null } },
    })
    const totalPoints       = allPicks.reduce((s, p) => s + (p.points ?? 0), 0)
    const playedMatches     = allPicks.length
    const classifiedCorrect = allPicks.filter(p => (p.points ?? 0) >= 2).length
    const exactScores       = allPicks.filter(p => (p.points ?? 0) >= 4).length
    const penaltyBonus      = allPicks.filter(p => p.points === 3 || p.points === 5).length
    await prisma.kORankingSnapshot.upsert({
      where:  { participantId },
      update: { totalPoints, playedMatches, classifiedCorrect, exactScores, penaltyBonus },
      create: { participantId, totalPoints, playedMatches, classifiedCorrect, exactScores, penaltyBonus, phase: 'R32' },
    })
  }

  return NextResponse.json({
    success: true,
    matchesChecked:      finishedResults.length,
    totalPicksChecked:   totalPicks,
    picksRecalculated:   totalChanged,
    rankingsUpdated:     affectedParticipantIds.length,
    changes:             details,
  })
}
