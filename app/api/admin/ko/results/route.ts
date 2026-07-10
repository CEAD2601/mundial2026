import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcKOPoints } from '@/lib/ko/utils'
import { checkTeamsMatch } from '@/lib/ko/resolvePickTeams'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'
import { z } from 'zod'

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const results = await prisma.kOMatchResult.findMany()
  const resultMap = Object.fromEntries(results.map(r => [r.id, r]))

  return NextResponse.json({
    matches: KNOCKOUT_MATCHES.map(m => ({ ...m, result: resultMap[m.id] ?? null })),
  })
}

const resultSchema = z.object({
  matchId:       z.string(),
  homeGoals:     z.number().int().min(0).max(20),
  awayGoals:     z.number().int().min(0).max(20),
  penaltyWinner: z.enum(['home', 'away']).nullable().optional(),
})

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const data = resultSchema.parse(body)

    // Validar: si es empate, penaltyWinner requerido
    if (data.homeGoals === data.awayGoals && !data.penaltyWinner) {
      return NextResponse.json({ error: 'Empate requiere ganador por penales' }, { status: 400 })
    }

    const pw = data.homeGoals !== data.awayGoals ? null : (data.penaltyWinner ?? null)

    // Upsert resultado
    await prisma.kOMatchResult.upsert({
      where: { id: data.matchId },
      update: { homeGoals: data.homeGoals, awayGoals: data.awayGoals, penaltyWinner: pw, status: 'FINISHED' },
      create: { id: data.matchId, homeGoals: data.homeGoals, awayGoals: data.awayGoals, penaltyWinner: pw, status: 'FINISHED' },
    })

    // Recalcular puntos de todos los picks de este partido
    const picks = await prisma.kOPick.findMany({ where: { matchId: data.matchId } })
    const result = { home: data.homeGoals, away: data.awayGoals, penaltyWinner: pw as 'home' | 'away' | null | undefined }

    const koMatch = KNOCKOUT_MATCHES.find(m => m.id === data.matchId)
    let allDbResults: { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }[] = []
    let allParticipantPicks: { matchId: string; participantId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null }[] = []
    if (koMatch && koMatch.stage !== 'R32') {
      allDbResults = await prisma.kOMatchResult.findMany({ where: { homeGoals: { not: null } } })
      const participantIds = [...new Set(picks.map(p => p.participantId))]
      allParticipantPicks = await prisma.kOPick.findMany({ where: { participantId: { in: participantIds } } })
    }
    const resultMap = new Map(allDbResults.map(r => [r.id, r as { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }]))
    resultMap.set(data.matchId, { id: data.matchId, homeGoals: data.homeGoals, awayGoals: data.awayGoals, penaltyWinner: pw })

    for (const pick of picks) {
      let teamsMatch: boolean | undefined
      if (koMatch && koMatch.stage !== 'R32') {
        const participantPickMap = new Map(
          allParticipantPicks
            .filter(p => p.participantId === pick.participantId)
            .map(p => [p.matchId, p])
        )
        teamsMatch = checkTeamsMatch(koMatch, participantPickMap, resultMap)
      }
      const breakdown = calcKOPoints(
        { home: pick.homeGoals, away: pick.awayGoals, penaltyWinner: pick.penaltyWinner as 'home' | 'away' | null | undefined },
        result,
        { teamsMatch },
      )
      await prisma.kOPick.update({
        where: { id: pick.id },
        data:  { points: breakdown.total },
      })
    }

    // Recalcular KORankingSnapshot para participantes afectados
    const participantIds = [...new Set(picks.map(p => p.participantId))]
    for (const participantId of participantIds) {
      await recalcRanking(participantId)
    }

    return NextResponse.json({ success: true, updated: picks.length })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// También permite marcar un partido como LOCKED (bloqueado para picks) sin resultado
const lockSchema = z.object({ matchId: z.string(), lock: z.boolean() })

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { matchId, lock } = lockSchema.parse(await req.json())
    await prisma.kOMatchResult.upsert({
      where:  { id: matchId },
      update: { status: lock ? 'LOCKED' : 'SCHEDULED' },
      create: { id: matchId, status: lock ? 'LOCKED' : 'SCHEDULED' },
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function recalcRanking(participantId: string) {
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
