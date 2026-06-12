/**
 * GET /api/admin/ranking/debug
 * Returns the full movement calculation breakdown for all participants.
 * Admin-only. Used to diagnose incorrect movement values.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

type SortableParticipant = {
  id: string
  fullName: string
  createdAt: Date
  totalPoints: number
  exactScores: number
  correctResults: number
  totalGoalDiffError: number
}

function rankingComparator(a: SortableParticipant, b: SortableParticipant): number {
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
  if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
  if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
  if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
  if (a.createdAt.getTime() !== b.createdAt.getTime()) return a.createdAt.getTime() - b.createdAt.getTime()
  return a.id < b.id ? -1 : 1
}

export async function GET() {
  const jar = await cookies()
  if (jar.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 1. All finished matches ordered chronologically
  const finishedMatches = await prisma.match.findMany({
    where: { status: 'FINISHED' },
    orderBy: { kickoffUtc: 'asc' },
    select: { id: true, kickoffUtc: true, matchNumber: true },
  })

  // 2a. Stored DB snapshots (previousPosition / currentPosition)
  const storedSnapshots = await prisma.rankingSnapshot.findMany({
    select: { participantId: true, previousPosition: true, currentPosition: true },
  })
  const storedMap = new Map(storedSnapshots.map((s) => [s.participantId, s]))

  // 2. All complete participants with payment
  const participants = await prisma.participant.findMany({
    where: { isComplete: true },
    select: {
      id: true,
      fullName: true,
      createdAt: true,
      payment: { select: { paymentStatus: true } },
    },
  })

  // 3. Settings (paid-only filter)
  const settings = await prisma.setting.findFirst()
  const filteredParticipants = settings?.showOnlyPaidParticipants
    ? participants.filter((p) => p.payment?.paymentStatus === 'VERIFIED')
    : participants

  // 4. All predictions for finished matches
  const allMatchIds = finishedMatches.map((m) => m.id)
  const allPredictions = await prisma.prediction.findMany({
    where: {
      matchId: { in: allMatchIds },
      participantId: { in: filteredParticipants.map((p) => p.id) },
    },
    select: {
      participantId: true,
      matchId: true,
      points: true,
      isExactScore: true,
      isCorrectResult: true,
      goalDifferenceError: true,
    },
  })

  function buildStats(matchIds: Set<string>): SortableParticipant[] {
    return filteredParticipants.map((p) => {
      const preds = allPredictions.filter(
        (pr) => pr.participantId === p.id && matchIds.has(pr.matchId)
      )
      return {
        id: p.id,
        fullName: p.fullName,
        createdAt: p.createdAt,
        totalPoints: preds.reduce((s, pr) => s + pr.points, 0),
        exactScores: preds.filter((pr) => pr.isExactScore === true).length,
        correctResults: preds.filter(
          (pr) => pr.isCorrectResult === true && pr.isExactScore !== true
        ).length,
        totalGoalDiffError: preds.reduce((s, pr) => s + (pr.goalDifferenceError ?? 0), 0),
      }
    })
  }

  const currMatchIds = new Set(allMatchIds)
  const prevMatchIds = new Set(allMatchIds.slice(0, -1))

  const currStats = buildStats(currMatchIds)
  const prevStats = buildStats(prevMatchIds)

  currStats.sort(rankingComparator)
  prevStats.sort(rankingComparator)

  const currPosMap = new Map<string, number>()
  currStats.forEach((s, i) => currPosMap.set(s.id, i + 1))

  const prevPosMap = new Map<string, number>()
  prevStats.forEach((s, i) => prevPosMap.set(s.id, i + 1))

  const rows = currStats.map((s, i) => {
    const currPos = i + 1
    const prevPos = prevPosMap.get(s.id) ?? null
    const movement = prevPos !== null ? prevPos - currPos : null
    const pCurr = allPredictions.filter(
      (pr) => pr.participantId === s.id && currMatchIds.has(pr.matchId)
    )
    const pPrev = allPredictions.filter(
      (pr) => pr.participantId === s.id && prevMatchIds.has(pr.matchId)
    )
    const participantFull = filteredParticipants.find((p) => p.id === s.id)
    return {
      name: s.fullName,
      id: s.id,
      currPos,
      prevPos,
      movement,
      display: movement === null ? '—' : movement > 0 ? `↑${movement}` : movement < 0 ? `↓${Math.abs(movement)}` : '—',
      createdAt: participantFull?.createdAt?.toISOString() ?? null,
      currStats: {
        totalPoints: s.totalPoints,
        exactScores: s.exactScores,
        correctResults: s.correctResults,
        totalGoalDiffError: s.totalGoalDiffError,
        predCount: pCurr.length,
      },
      prevStats: {
        totalPoints: pPrev.reduce((sum, pr) => sum + pr.points, 0),
        exactScores: pPrev.filter((pr) => pr.isExactScore === true).length,
        correctResults: pPrev.filter((pr) => pr.isCorrectResult === true && pr.isExactScore !== true).length,
        totalGoalDiffError: pPrev.reduce((sum, pr) => sum + (pr.goalDifferenceError ?? 0), 0),
        predCount: pPrev.length,
      },
      registrationDate: s.createdAt.toISOString(),
      isPaid: participants.find((p) => p.id === s.id)?.payment?.paymentStatus === 'VERIFIED',
      storedDB: storedMap.get(s.id) ?? null,
    }
  })

  return NextResponse.json({
    finishedMatches: finishedMatches.map((m) => ({
      id: m.id,
      matchNumber: m.matchNumber,
      kickoffUtc: m.kickoffUtc,
    })),
    totalFinished: finishedMatches.length,
    previousMatchCount: prevMatchIds.size,
    currentMatchCount: currMatchIds.size,
    filteredParticipantCount: filteredParticipants.length,
    showOnlyPaidParticipants: settings?.showOnlyPaidParticipants ?? false,
    rows,
  })
}
