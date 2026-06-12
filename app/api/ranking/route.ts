import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatParticipantDisplayName } from '@/lib/formatParticipantName'
import { recalculateParticipantRanking } from '@/lib/liveResultsService'

// ─── Shared ranking sort comparator ─────────────────────────────────────────
// Tiebreaker: createdAt ASC (account creation date), then id ASC.
type SortableParticipant = {
  id: string
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

// ─── GET /api/ranking ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isAdmin = searchParams.get('admin') === 'true'

  // Fetch everything in parallel
  const [settings, snapshots, finishedMatches] = await Promise.all([
    prisma.setting.findFirst(),
    prisma.rankingSnapshot.findMany({
      include: { participant: { include: { payment: true } } },
    }),
    prisma.match.findMany({
      where: { status: 'FINISHED' },
      orderBy: { kickoffUtc: 'asc' },
      select: { id: true },
    }),
  ])

  // Sort all participants by ranking criteria using current snapshot stats
  snapshots.sort((a, b) =>
    rankingComparator(
      { id: a.participant.id, createdAt: a.participant.createdAt, totalPoints: a.totalPoints, exactScores: a.exactScores, correctResults: a.correctResults, totalGoalDiffError: a.totalGoalDiffError },
      { id: b.participant.id, createdAt: b.participant.createdAt, totalPoints: b.totalPoints, exactScores: b.exactScores, correctResults: b.correctResults, totalGoalDiffError: b.totalGoalDiffError }
    )
  )

  // Admin sees all; public respects showOnlyPaidParticipants setting
  const filtered =
    !isAdmin && settings?.showOnlyPaidParticipants
      ? snapshots.filter((s) => s.participant.payment?.paymentStatus === 'VERIFIED')
      : snapshots

  // ─── Movement calculation ──────────────────────────────────────────────────
  // Computed over the SAME filtered/sorted set that is displayed.
  // previousPosition = position using all-but-last finished match stats.
  // currentPosition  = i+1 from the display order above (consistent).
  // movement = previousPosition - currentPosition
  //
  // This ensures movement and displayed positions are always consistent:
  // if display says Carlos is #4, currPos used in movement is also 4.
  const movementMap = new Map<string, { prevPos: number; movement: number }>()

  if (finishedMatches.length >= 2) {
    const prevMatchIds = new Set(finishedMatches.slice(0, -1).map((m) => m.id))
    const filteredIds = filtered.map((s) => s.participantId)

    // Fetch predictions for previous matches for the displayed participants only
    const prevPredictions = await prisma.prediction.findMany({
      where: {
        matchId: { in: Array.from(prevMatchIds) },
        participantId: { in: filteredIds },
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

    // Build a SortableParticipant for each displayed participant using ONLY previous match stats
    const prevStats: SortableParticipant[] = filtered.map((s) => {
      const preds = prevPredictions.filter((pr) => pr.participantId === s.participantId)
      return {
        id: s.participant.id,
        createdAt: s.participant.createdAt,
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

    // Sort by same criteria to get previousPosition
    prevStats.sort(rankingComparator)

    const prevPosMap = new Map<string, number>()
    prevStats.forEach((s, i) => prevPosMap.set(s.id, i + 1))

    // Movement = previousPosition - currentPosition (i+1 in display order)
    filtered.forEach((s, i) => {
      const currPos = i + 1
      const prevPos = prevPosMap.get(s.participantId)
      if (prevPos !== undefined) {
        movementMap.set(s.participantId, { prevPos, movement: prevPos - currPos })
      }
    })
  }

  // ─── Build response ────────────────────────────────────────────────────────
  const result = filtered.map((s, i) => {
    const mov = movementMap.get(s.participantId)
    return {
      position: i + 1,
      previousPosition: mov?.prevPos ?? null,
      movement: mov?.movement ?? 0,
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

  // Update stored currentPosition for reference (snapshot used by applyResultToDb)
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { createdAt: true, id: true } } },
  })
  all.sort((a, b) =>
    rankingComparator(
      { id: a.participant.id, createdAt: a.participant.createdAt, totalPoints: a.totalPoints, exactScores: a.exactScores, correctResults: a.correctResults, totalGoalDiffError: a.totalGoalDiffError },
      { id: b.participant.id, createdAt: b.participant.createdAt, totalPoints: b.totalPoints, exactScores: b.exactScores, correctResults: b.correctResults, totalGoalDiffError: b.totalGoalDiffError }
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
