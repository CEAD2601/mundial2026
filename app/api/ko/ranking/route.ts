import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureKOTables } from '@/lib/ko/migrate'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'
import { getActiveKOPhase } from '@/lib/ko/phaseTransition'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type VerifiedParticipant = {
  id: string
  createdAt: Date
  participationCode: string
  fullName: string
  city: string | null
  payment: { paymentStatus: string } | null
  ranking: {
    totalPoints: number; classifiedCorrect: number; exactScores: number
    penaltyBonus: number; playedMatches: number
  } | null
  picks: { matchId: string; homeGoals: number; awayGoals: number; points: number | null }[]
}

// Diferencia de goles acumulada para un subconjunto de partidos (matchIds). Menor = mejor.
function goalDiffFor(
  picks: VerifiedParticipant['picks'],
  resultMap: Map<string, { homeGoals: number | null; awayGoals: number | null }>,
  matchIds: Set<string> | null,
): number {
  let total = 0
  for (const pick of picks) {
    if (matchIds && !matchIds.has(pick.matchId)) continue
    const res = resultMap.get(pick.matchId)
    if (!res || res.homeGoals == null || res.awayGoals == null) continue
    total += Math.abs(pick.homeGoals - res.homeGoals) + Math.abs(pick.awayGoals - res.awayGoals)
  }
  return total
}

function statsFor(picks: VerifiedParticipant['picks'], matchIds: Set<string> | null) {
  const scoped = picks.filter(p => (!matchIds || matchIds.has(p.matchId)) && p.points != null)
  return {
    totalPoints:       scoped.reduce((s, p) => s + (p.points ?? 0), 0),
    classifiedCorrect: scoped.filter(p => (p.points ?? 0) >= 2).length,
    exactScores:       scoped.filter(p => (p.points ?? 0) >= 4).length,
    penaltyBonus:      scoped.filter(p => p.points === 3 || p.points === 5).length,
  }
}

function compare(
  a: { stats: ReturnType<typeof statsFor>; goalDiff: number; createdAt: Date },
  b: { stats: ReturnType<typeof statsFor>; goalDiff: number; createdAt: Date },
): number {
  if (b.stats.totalPoints       !== a.stats.totalPoints)       return b.stats.totalPoints       - a.stats.totalPoints
  if (b.stats.classifiedCorrect !== a.stats.classifiedCorrect) return b.stats.classifiedCorrect - a.stats.classifiedCorrect
  if (b.stats.exactScores       !== a.stats.exactScores)       return b.stats.exactScores       - a.stats.exactScores
  if (b.stats.penaltyBonus      !== a.stats.penaltyBonus)      return b.stats.penaltyBonus      - a.stats.penaltyBonus
  if (a.goalDiff !== b.goalDiff) return a.goalDiff - b.goalDiff
  return a.createdAt.getTime() - b.createdAt.getTime()
}

export async function GET() {
  try {
    await ensureKOTables()

    let activePhase = await getActiveKOPhase()

    // Todos los participantes de la fase activa
    let participants = await prisma.kOParticipant.findMany({
      where:    { phase: activePhase },
      include:  { payment: true, ranking: true, picks: true },
      orderBy:  { createdAt: 'asc' },
    }) as unknown as VerifiedParticipant[]

    // Fallback: si la columna phase no existe o la fase activa no tiene participantes
    if (participants.length === 0 && activePhase !== 'R32') {
      activePhase = 'R32'
      participants = await prisma.kOParticipant.findMany({
        where:    { phase: 'R32' },
        include:  { payment: true, ranking: true, picks: true },
        orderBy:  { createdAt: 'asc' },
      }) as unknown as VerifiedParticipant[]
    }

    const verified = participants.filter(p => p.payment?.paymentStatus === 'VERIFIED')

    // Resultados finalizados para calcular diferencia de goles
    const finishedResults = await prisma.kOMatchResult.findMany({
      where: { status: 'FINISHED' },
    })
    const resultMap = new Map(finishedResults.map(r => [r.id, r]))

    // Movimiento: posición actual vs. posición que tendría cada participante
    // excluyendo el último partido finalizado (orden por kickoff programado, no por updatedAt).
    const kickoffMs = new Map(KNOCKOUT_MATCHES.map(m => [m.id, new Date(`${m.date}T${m.timeVet}:00-04:00`).getTime()]))
    const finishedIdsOrdered = finishedResults
      .map(r => r.id)
      .filter(id => kickoffMs.has(id))
      .sort((a, b) => kickoffMs.get(a)! - kickoffMs.get(b)!)
    const prevMatchIds = finishedIdsOrdered.length >= 2
      ? new Set(finishedIdsOrdered.slice(0, -1))
      : null

    function goalDiff(p: VerifiedParticipant): number {
      return goalDiffFor(p.picks, resultMap, null)
    }

    // Orden actual (todos los partidos finalizados)
    const currentRows = verified.map(p => ({
      p,
      stats:     statsFor(p.picks, null),
      goalDiff:  goalDiffFor(p.picks, resultMap, null),
      createdAt: p.createdAt,
    }))
    currentRows.sort(compare)

    // Orden previo (todos los partidos finalizados excepto el último) — solo si hay >= 2 finalizados
    let prevPosMap: Map<string, number> | null = null
    if (prevMatchIds) {
      const prevRows = verified.map(p => ({
        p,
        stats:     statsFor(p.picks, prevMatchIds),
        goalDiff:  goalDiffFor(p.picks, resultMap, prevMatchIds),
        createdAt: p.createdAt,
      }))
      prevRows.sort(compare)
      prevPosMap = new Map(prevRows.map((r, i) => [r.p.id, i + 1]))
    }

    const ranking = currentRows.map(({ p, stats }, idx) => {
      const currPos = idx + 1
      const prevPos = prevPosMap?.get(p.id) ?? null
      return {
        position:          currPos,
        previousPosition:  prevPos,
        movement:          prevPos != null ? prevPos - currPos : 0,
        participationCode: p.participationCode,
        fullName:          p.fullName,
        city:              p.city,
        totalPoints:       stats.totalPoints,
        classifiedCorrect: stats.classifiedCorrect,
        exactScores:       stats.exactScores,
        penaltyBonus:      stats.penaltyBonus,
        playedMatches:     p.ranking?.playedMatches ?? 0,
        paymentStatus:     p.payment?.paymentStatus ?? 'PENDING',
        goalDiff:          goalDiff(p),
      }
    })

    return NextResponse.json({ ranking })
  } catch {
    return NextResponse.json({ ranking: [] })
  }
}
