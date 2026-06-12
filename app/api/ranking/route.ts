import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatParticipantDisplayName } from '@/lib/formatParticipantName'
import { recalculateParticipantRanking } from '@/lib/liveResultsService'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isAdmin = searchParams.get('admin') === 'true'
  const settings = await prisma.setting.findFirst()

  const snapshots = await prisma.rankingSnapshot.findMany({
    include: {
      participant: {
        include: { payment: true },
      },
    },
    // Primary sort: sports criteria. Secondary tiebreaker (createdAt) applied in JS below.
    orderBy: [
      { totalPoints: 'desc' },
      { exactScores: 'desc' },
      { correctResults: 'desc' },
      { totalGoalDiffError: 'asc' },
    ],
  })

  // Final tiebreaker: registration date (oldest first), then id (stable)
  snapshots.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
    if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
    // Sports tie: oldest registration wins
    const dateA = a.participant.createdAt.getTime()
    const dateB = b.participant.createdAt.getTime()
    if (dateA !== dateB) return dateA - dateB
    // Last resort: id string comparison (stable)
    return a.participant.id < b.participant.id ? -1 : 1
  })

  // Admin sees all; public respects showOnlyPaidParticipants setting
  const filtered =
    !isAdmin && settings?.showOnlyPaidParticipants
      ? snapshots.filter((s) => s.participant.payment?.paymentStatus === 'VERIFIED')
      : snapshots

  const result = filtered.map((s, i) => ({
    position: i + 1,
    previousPosition: s.previousPosition,
    // Both previousPosition and currentPosition are stored over all participants — consistent
    movement: (s.previousPosition && s.previousPosition > 0 && s.currentPosition && s.currentPosition > 0)
      ? s.previousPosition - s.currentPosition
      : 0,
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
  }))

  return NextResponse.json({ ranking: result })
}

export async function POST() {
  const participants = await prisma.participant.findMany({
    where: { isComplete: true },
    select: { id: true },
  })

  // Recalculate stats for all participants using the shared function
  for (const p of participants) {
    await recalculateParticipantRanking(p.id)
  }

  // After all stats are updated, sort and save currentPosition for each
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { createdAt: true, id: true } } },
  })
  all.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
    if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
    const dateA = a.participant.createdAt.getTime()
    const dateB = b.participant.createdAt.getTime()
    if (dateA !== dateB) return dateA - dateB
    return a.participant.id < b.participant.id ? -1 : 1
  })
  for (let i = 0; i < all.length; i++) {
    await prisma.rankingSnapshot.update({
      where: { participantId: all[i].participantId },
      data: { currentPosition: i + 1 },
    })
  }

  return NextResponse.json({ success: true, count: participants.length })
}
