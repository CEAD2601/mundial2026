import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    // Tiebreakers: 1) total points, 2) exact scores, 3) correct results, 4) least goal diff error
    orderBy: [
      { totalPoints: 'desc' },
      { exactScores: 'desc' },
      { correctResults: 'desc' },
      { totalGoalDiffError: 'asc' },
    ],
  })

  // Admin sees all; public respects showOnlyPaidParticipants setting
  const filtered =
    !isAdmin && settings?.showOnlyPaidParticipants
      ? snapshots.filter((s) => s.participant.payment?.paymentStatus === 'VERIFIED')
      : snapshots

  const result = filtered.map((s, i) => ({
    currentPosition: i + 1,
    previousPosition: s.previousPosition,
    movement: s.previousPosition ? s.previousPosition - (i + 1) : 0,
    participantId: s.participantId,
    fullName: s.participant.fullName,
    city: s.participant.city,
    totalPoints: s.totalPoints,
    exactScores: s.exactScores,
    correctResults: s.correctResults,
    wrongPredictions: s.wrongPredictions,
    pendingPredictions: s.pendingPredictions,
    playedMatches: s.playedMatches,
    totalGoalDiffError: s.totalGoalDiffError,
    effectivenessPercent: s.effectivenessPercent,
    updatedAt: s.updatedAt,
    paymentStatus: s.participant.payment?.paymentStatus,
    participant: {
      id: s.participant.id,
      fullName: s.participant.fullName,
      participationCode: s.participant.participationCode,
      payment: s.participant.payment,
    },
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
