import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatParticipantDisplayName } from '@/lib/formatParticipantName'
import { recalculateParticipantRanking } from '@/lib/liveResultsService'

// ─── Shared ranking sort comparator ─────────────────────────────────────────
// Used both for display ordering and movement calculation.
// Tiebreaker: submittedAt (when participant submitted quiniela) ?? createdAt, then id.
type SortableParticipant = {
  id: string
  submittedAt: Date | null
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
  const dateA = (a.submittedAt ?? a.createdAt).getTime()
  const dateB = (b.submittedAt ?? b.createdAt).getTime()
  if (dateA !== dateB) return dateA - dateB
  return a.id < b.id ? -1 : 1
}

// ─── Dynamic movement calculation ───────────────────────────────────────────
// Computes ranking positions BEFORE the last finished match and compares with current.
// Does NOT rely on stored previousPosition/currentPosition — always computed fresh.
// This is robust against snapshot corruption or missing history.
async function computeMovementMap(): Promise<Map<string, { prevPos: number; movement: number }>> {
  const empty = new Map<string, { prevPos: number; movement: number }>()

  // Get all finished matches in chronological order
  const finishedMatches = await prisma.match.findMany({
    where: { status: 'FINISHED' },
    orderBy: { kickoffUtc: 'asc' },
    select: { id: true },
  })

  if (finishedMatches.length < 2) return empty

  // Get all participants with their registration dates
  const participants = await prisma.participant.findMany({
    where: { isComplete: true },
    select: { id: true, submittedAt: true, createdAt: true },
  })

  // Get all predictions for finished matches (points already calculated by applyResultToDb)
  const predictions = await prisma.prediction.findMany({
    where: { matchId: { in: finishedMatches.map((m) => m.id) } },
    select: {
      participantId: true,
      matchId: true,
      points: true,
      isExactScore: true,
      isCorrectResult: true,
      goalDifferenceError: true,
    },
  })

  // Helper: compute position map for a given set of match IDs
  function positionsFor(matchIds: Set<string>): Map<string, number> {
    const stats: SortableParticipant[] = participants.map((p) => {
      const preds = predictions.filter(
        (pr) => pr.participantId === p.id && matchIds.has(pr.matchId)
      )
      return {
        id: p.id,
        submittedAt: p.submittedAt,
        createdAt: p.createdAt,
        totalPoints: preds.reduce((sum, pr) => sum + pr.points, 0),
        exactScores: preds.filter((pr) => pr.isExactScore === true).length,
        correctResults: preds.filter(
          (pr) => pr.isCorrectResult === true && pr.isExactScore !== true
        ).length,
        totalGoalDiffError: preds.reduce(
          (sum, pr) => sum + (pr.goalDifferenceError ?? 0),
          0
        ),
      }
    })
    stats.sort(rankingComparator)
    const map = new Map<string, number>()
    stats.forEach((s, i) => map.set(s.id, i + 1))
    return map
  }

  const allMatchIds = new Set(finishedMatches.map((m) => m.id))
  const prevMatchIds = new Set(finishedMatches.slice(0, -1).map((m) => m.id))

  const prevPositions = positionsFor(prevMatchIds)
  const currPositions = positionsFor(allMatchIds)

  const movementMap = new Map<string, { prevPos: number; movement: number }>()
  for (const p of participants) {
    const prevPos = prevPositions.get(p.id) ?? 0
    const currPos = currPositions.get(p.id) ?? 0
    if (prevPos > 0 && currPos > 0) {
      movementMap.set(p.id, { prevPos, movement: prevPos - currPos })
    }
  }
  return movementMap
}

// ─── GET /api/ranking ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isAdmin = searchParams.get('admin') === 'true'

  const [settings, snapshots, movementMap] = await Promise.all([
    prisma.setting.findFirst(),
    prisma.rankingSnapshot.findMany({
      include: {
        participant: {
          include: { payment: true },
        },
      },
    }),
    computeMovementMap(),
  ])

  // Sort all participants by ranking criteria
  snapshots.sort((a, b) =>
    rankingComparator(
      { id: a.participant.id, submittedAt: a.participant.submittedAt, createdAt: a.participant.createdAt, totalPoints: a.totalPoints, exactScores: a.exactScores, correctResults: a.correctResults, totalGoalDiffError: a.totalGoalDiffError },
      { id: b.participant.id, submittedAt: b.participant.submittedAt, createdAt: b.participant.createdAt, totalPoints: b.totalPoints, exactScores: b.exactScores, correctResults: b.correctResults, totalGoalDiffError: b.totalGoalDiffError }
    )
  )

  // Admin sees all; public respects showOnlyPaidParticipants setting
  const filtered =
    !isAdmin && settings?.showOnlyPaidParticipants
      ? snapshots.filter((s) => s.participant.payment?.paymentStatus === 'VERIFIED')
      : snapshots

  const result = filtered.map((s, i) => {
    const mov = movementMap.get(s.participantId)
    return {
      position: i + 1,
      previousPosition: mov ? mov.prevPos : null,
      movement: mov ? mov.movement : 0,
      participantId: s.participantId,
      participationCode: s.participant.participationCode,
      fullName: s.participant.fullName,
      displayName: formatParticipantDisplayName(s.participant.fullName),
      city: s.participant.city,
      totalPoints: s.totalPoints,
      exactScores: s.exactScores,
      correctResults: s.correctResults,
      wrongPredictions: s.wrongPredictions ?? 0,
      pendingPredictions: s.pendingPredictions,
      playedMatches: s.playedMatches,
      totalGoalDiffError: s.totalGoalDiffError ?? 0,
      effectivenessPercent: s.effectivenessPercent ?? 0,
      paymentStatus: s.participant.payment?.paymentStatus ?? 'PENDING',
    }
  })

  return NextResponse.json({ ranking: result })
}

// ─── POST /api/ranking — recalculate all stats ───────────────────────────────
export async function POST() {
  const participants = await prisma.participant.findMany({
    where: { isComplete: true },
    select: { id: true },
  })

  for (const p of participants) {
    await recalculateParticipantRanking(p.id)
  }

  // Update stored currentPosition for reference (used by applyResultToDb snapshot logic)
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { submittedAt: true, createdAt: true, id: true } } },
  })
  all.sort((a, b) =>
    rankingComparator(
      { id: a.participant.id, submittedAt: a.participant.submittedAt, createdAt: a.participant.createdAt, totalPoints: a.totalPoints, exactScores: a.exactScores, correctResults: a.correctResults, totalGoalDiffError: a.totalGoalDiffError },
      { id: b.participant.id, submittedAt: b.participant.submittedAt, createdAt: b.participant.createdAt, totalPoints: b.totalPoints, exactScores: b.exactScores, correctResults: b.correctResults, totalGoalDiffError: b.totalGoalDiffError }
    )
  )
  for (let i = 0; i < all.length; i++) {
    await prisma.rankingSnapshot.update({
      where: { participantId: all[i].participantId },
      data: { currentPosition: i + 1 },
    })
  }

  return NextResponse.json({ success: true, count: participants.length })
}
