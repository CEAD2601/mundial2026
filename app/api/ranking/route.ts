import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatParticipantDisplayName } from '@/lib/formatParticipantName'

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
    movement: s.previousPosition ? s.previousPosition - (i + 1) : 0,
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
    include: {
      predictions: { include: { match: true } },
      payment: true,
    },
    where: { isComplete: true },
  })

  for (const p of participants) {
    const played = p.predictions.filter((pred) => pred.match.status === 'FINISHED')
    const exactScores = played.filter((pred) => pred.isExactScore === true).length
    const correctResults = played.filter((pred) => pred.isCorrectResult === true && !pred.isExactScore).length
    const wrongPredictions = played.filter((pred) => !pred.isCorrectResult).length
    const pending = p.predictions.filter((pred) => pred.match.status !== 'FINISHED').length
    const totalPoints = played.reduce((sum, pred) => sum + pred.points, 0)
    const totalGoalDiffError = played.reduce((sum, pred) => sum + (pred.goalDifferenceError ?? 0), 0)
    const effectiveness = played.length > 0 ? ((exactScores + correctResults) / played.length) * 100 : 0

    await prisma.rankingSnapshot.upsert({
      where: { participantId: p.id },
      update: {
        totalPoints,
        exactScores,
        correctResults,
        wrongPredictions,
        pendingPredictions: pending,
        playedMatches: played.length,
        totalGoalDiffError,
        effectivenessPercent: effectiveness,
      },
      create: {
        participantId: p.id,
        totalPoints,
        exactScores,
        correctResults,
        wrongPredictions,
        pendingPredictions: pending,
        playedMatches: played.length,
        totalGoalDiffError,
        effectivenessPercent: effectiveness,
        currentPosition: 0,
      },
    })
  }

  return NextResponse.json({ success: true, count: participants.length })
}
