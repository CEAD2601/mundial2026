import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { team1: true, team2: true },
  })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  // Predictions are only visible once the match has kicked off
  if (new Date() < new Date(match.kickoffUtc)) {
    return NextResponse.json({
      available: false,
      message: 'Los pronósticos estarán disponibles cuando comience el partido.',
      kickoffUtc: match.kickoffUtc,
    })
  }

  const isFinished = match.status === 'FINISHED'

  const predictions = await prisma.prediction.findMany({
    where: {
      matchId,
      participant: {
        payment: { paymentStatus: 'VERIFIED' },
      },
    },
    include: {
      participant: {
        select: { fullName: true, participationCode: true },
      },
    },
    orderBy: isFinished ? [{ points: 'desc' }, { goalDifferenceError: 'asc' }] : [{ createdAt: 'asc' }],
  })

  return NextResponse.json({
    available: true,
    isFinished,
    match: {
      id: match.id,
      matchNumber: match.matchNumber,
      group: match.group,
      kickoffUtc: match.kickoffUtc,
      status: match.status,
      team1: { displayName: match.team1.displayName, flagEmoji: match.team1.flagEmoji, shortName: match.team1.shortName },
      team2: { displayName: match.team2.displayName, flagEmoji: match.team2.flagEmoji, shortName: match.team2.shortName },
      team1Goals: match.team1Goals,
      team2Goals: match.team2Goals,
      result: match.result,
    },
    predictions: predictions.map((p) => ({
      participantName: p.participant.fullName,
      participationCode: p.participant.participationCode,
      predictedTeam1Goals: p.predictedTeam1Goals,
      predictedTeam2Goals: p.predictedTeam2Goals,
      points: isFinished ? p.points : null,
      isExactScore: isFinished ? p.isExactScore : null,
      isCorrectResult: isFinished ? (p.isCorrectResult && !p.isExactScore) : null,
    })),
    totalPredictions: predictions.length,
  })
}
