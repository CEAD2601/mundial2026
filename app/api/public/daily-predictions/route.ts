import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatParticipantDisplayName } from '@/lib/formatParticipantName'

export const dynamic = 'force-dynamic'

const VISIBLE_STATUSES = new Set(['CLOSED', 'IN_PROGRESS', 'WAITING_NEXT_ROUND', 'FINISHED'])

// Venezuela = UTC-4, no DST — stable offset
function toVetDateStr(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
}

function vetDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  // Build date at noon VET to avoid any DST edge — VET has none, but defensive
  const dt = new Date(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T12:00:00-04:00`)
  return dt.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const requestedDate = searchParams.get('date') ?? toVetDateStr(new Date())

  const [allMatches, settings] = await Promise.all([
    prisma.match.findMany({
      select: {
        id: true, matchNumber: true, group: true, kickoffUtc: true,
        status: true, result: true, team1Goals: true, team2Goals: true,
        team1: { select: { displayName: true, flagEmoji: true, shortName: true, isoCode: true } },
        team2: { select: { displayName: true, flagEmoji: true, shortName: true, isoCode: true } },
      },
      orderBy: { kickoffUtc: 'asc' },
    }),
    prisma.setting.findFirst({ select: { poolStatus: true } }),
  ])

  const poolStatus = settings?.poolStatus ?? 'OPEN'
  const now = new Date()
  // Show all predictions if pool status says closed, OR registration deadline has passed
  const REGISTRATION_DEADLINE = new Date('2026-06-11T19:00:00.000Z')
  const inscriptionsClosed = VISIBLE_STATUSES.has(poolStatus) || now >= REGISTRATION_DEADLINE

  // Group by VET date for the date selector
  const dateGroups: Record<string, typeof allMatches> = {}
  for (const m of allMatches) {
    const d = toVetDateStr(new Date(m.kickoffUtc))
    if (!dateGroups[d]) dateGroups[d] = []
    dateGroups[d].push(m)
  }
  const availableDates = Object.keys(dateGroups).sort()

  const dayMatches = dateGroups[requestedDate] ?? []
  const matchIds = dayMatches.map((m) => m.id)

  const predictions = matchIds.length > 0
    ? await prisma.prediction.findMany({
        where: {
          matchId: { in: matchIds },
          participant: { payment: { paymentStatus: 'VERIFIED' } },
        },
        include: { participant: { select: { fullName: true, participationCode: true } } },
      })
    : []

  // Group predictions by matchId
  type PredRow = typeof predictions[0]
  const predByMatch: Record<string, PredRow[]> = {}
  for (const p of predictions) {
    if (!predByMatch[p.matchId]) predByMatch[p.matchId] = []
    predByMatch[p.matchId].push(p)
  }

  // Build match objects with predictions
  const matchesOut = dayMatches.map((m) => {
    const kickoff = new Date(m.kickoffUtc)
    const kickoffPassed = now >= kickoff
    // Show predictions if inscriptions closed OR kickoff already happened
    const predictionsAvailable = inscriptionsClosed || kickoffPassed
    const isFinished = m.status === 'FINISHED'
    const mp = predByMatch[m.id] ?? []

    const sorted = isFinished
      ? [...mp].sort((a, b) => b.points - a.points || (a.goalDifferenceError ?? 0) - (b.goalDifferenceError ?? 0))
      : [...mp].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    return {
      id: m.id,
      matchNumber: m.matchNumber,
      group: m.group,
      kickoffUtc: m.kickoffUtc.toISOString(),
      status: m.status,
      result: m.result,
      team1Goals: m.team1Goals,
      team2Goals: m.team2Goals,
      team1: { displayName: m.team1.displayName, flagEmoji: m.team1.flagEmoji, shortName: m.team1.shortName, isoCode: m.team1.isoCode },
      team2: { displayName: m.team2.displayName, flagEmoji: m.team2.flagEmoji, shortName: m.team2.shortName, isoCode: m.team2.isoCode },
      predictionsAvailable,
      predictions: predictionsAvailable ? sorted.map((p) => ({
        participantName: formatParticipantDisplayName(p.participant.fullName),
        predictedTeam1Goals: p.predictedTeam1Goals,
        predictedTeam2Goals: p.predictedTeam2Goals,
        points: isFinished ? p.points : null,
        isExactScore: isFinished ? (p.isExactScore ?? false) : null,
        isCorrectResult: isFinished ? ((p.isCorrectResult ?? false) && !(p.isExactScore ?? false)) : null,
      })) : [],
    }
  })

  // Day summary
  const finished = dayMatches.filter((m) => m.status === 'FINISHED')
  const inPlay = dayMatches.filter((m) => new Date(m.kickoffUtc) <= now && m.status !== 'FINISHED')
  const pending = dayMatches.filter((m) => new Date(m.kickoffUtc) > now)

  // Points per participant for today's finished matches
  const dayPts: Record<string, { name: string; pts: number; exactCount: number }> = {}
  for (const m of finished) {
    for (const p of (predByMatch[m.id] ?? [])) {
      const k = p.participant.fullName
      if (!dayPts[k]) dayPts[k] = { name: formatParticipantDisplayName(p.participant.fullName), pts: 0, exactCount: 0 }
      dayPts[k].pts += p.points
      if (p.isExactScore) dayPts[k].exactCount += 1
    }
  }
  const dayLeaders = Object.values(dayPts).sort((a, b) => b.pts - a.pts || b.exactCount - a.exactCount)

  // Cross-reference grid: participants × matches (only where predictions visible)
  const startedMatchIds = matchesOut.filter((m) => m.predictionsAvailable).map((m) => m.id)
  const gridMap: Record<string, { name: string; preds: Record<string, { g1: number; g2: number; pts: number | null; exact: boolean | null; correct: boolean | null }>; dayPts: number }> = {}

  for (const match of matchesOut) {
    if (!match.predictionsAvailable) continue
    for (const p of match.predictions) {
      const k = p.participantName // already formatted, use as key
      if (!gridMap[k]) gridMap[k] = { name: p.participantName, preds: {}, dayPts: 0 }
      gridMap[k].preds[match.id] = {
        g1: p.predictedTeam1Goals,
        g2: p.predictedTeam2Goals,
        pts: p.points,
        exact: p.isExactScore,
        correct: p.isCorrectResult,
      }
      if (p.points !== null) gridMap[k].dayPts += p.points
    }
  }
  const participantGrid = Object.values(gridMap).sort((a, b) => b.dayPts - a.dayPts)

  return NextResponse.json({
    date: requestedDate,
    dateLabel: vetDateLabel(requestedDate),
    availableDates,
    startedMatchIds,
    matches: matchesOut,
    summary: {
      totalMatches: dayMatches.length,
      finishedMatches: finished.length,
      inPlayMatches: inPlay.length,
      pendingMatches: pending.length,
      leaderOfDay: dayLeaders[0] ?? null,
    },
    participantGrid: participantGrid.map(({ name, preds, dayPts }) => ({ name, preds, dayPts })),
    inscriptionsClosed,
  })
}
