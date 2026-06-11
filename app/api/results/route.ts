import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateResultSchema = z.object({
  matchId: z.string(),
  team1Goals: z.number().int().min(0),
  team2Goals: z.number().int().min(0),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = updateResultSchema.parse(body)

    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: { team1: true, team2: true },
    })
    if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

    const actualResult: 'G1' | 'E' | 'G2' =
      data.team1Goals > data.team2Goals ? 'G1' :
      data.team1Goals < data.team2Goals ? 'G2' : 'E'

    await prisma.match.update({
      where: { id: data.matchId },
      data: {
        team1Goals: data.team1Goals,
        team2Goals: data.team2Goals,
        result: actualResult,
        status: 'FINISHED',
        resultUpdatedAt: new Date(),
        resultSource: 'manual',
      },
    })

    // Calculate points for every prediction on this match
    const predictions = await prisma.prediction.findMany({
      where: { matchId: data.matchId },
    })

    for (const pred of predictions) {
      const isExactScore =
        pred.predictedTeam1Goals === data.team1Goals &&
        pred.predictedTeam2Goals === data.team2Goals
      const isCorrectResult = pred.predictedResult === actualResult
      const goalDifferenceError =
        Math.abs(pred.predictedTeam1Goals - data.team1Goals) +
        Math.abs(pred.predictedTeam2Goals - data.team2Goals)
      const points = isExactScore ? 3 : isCorrectResult ? 1 : 0

      await prisma.prediction.update({
        where: { id: pred.id },
        data: { isExactScore, isCorrectResult, goalDifferenceError, points },
      })
    }

    // Recalculate stats for all affected participants
    const participantIds = [...new Set(predictions.map((p) => p.participantId))]
    for (const participantId of participantIds) {
      await recalculateParticipantStats(participantId)
    }

    // Update ranking positions for everyone (saves previousPosition too)
    await updateRankingPositions()

    // Audit log
    const resultLabel =
      actualResult === 'G1' ? `Gana ${match.team1.shortName}` :
      actualResult === 'G2' ? `Gana ${match.team2.shortName}` : 'Empate'
    await prisma.auditLog.create({
      data: {
        action: `Resultado: ${match.team1.displayName} ${data.team1Goals}-${data.team2Goals} ${match.team2.displayName} (${resultLabel}) · Partido #${match.matchNumber}`,
        entityType: 'Match',
        entityId: data.matchId,
        newValue: `${data.team1Goals}-${data.team2Goals}`,
      },
    }).catch(() => {})

    return NextResponse.json({ success: true, result: actualResult, matchNumber: match.matchNumber })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function recalculateParticipantStats(participantId: string) {
  const predictions = await prisma.prediction.findMany({
    where: { participantId },
    include: { match: true },
  })
  const played = predictions.filter((p) => p.match.status === 'FINISHED')
  const exactScores = played.filter((p) => p.isExactScore === true).length
  const correctResults = played.filter((p) => p.isCorrectResult === true && !p.isExactScore).length
  const wrongPredictions = played.filter((p) => !p.isCorrectResult).length
  const pending = predictions.filter((p) => p.match.status !== 'FINISHED').length
  const totalPoints = played.reduce((sum, p) => sum + p.points, 0)
  const totalGoalDiffError = played.reduce((sum, p) => sum + (p.goalDifferenceError ?? 0), 0)
  const effectiveness = played.length > 0 ? ((exactScores + correctResults) / played.length) * 100 : 0

  await prisma.rankingSnapshot.upsert({
    where: { participantId },
    update: { totalPoints, exactScores, correctResults, wrongPredictions, pendingPredictions: pending, playedMatches: played.length, totalGoalDiffError, effectivenessPercent: effectiveness },
    create: { participantId, totalPoints, exactScores, correctResults, wrongPredictions, pendingPredictions: pending, playedMatches: played.length, totalGoalDiffError, effectivenessPercent: effectiveness, currentPosition: 0 },
  })
}

async function updateRankingPositions() {
  const snapshots = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { createdAt: true, id: true } } },
    orderBy: [{ totalPoints: 'desc' }, { exactScores: 'desc' }, { correctResults: 'desc' }, { totalGoalDiffError: 'asc' }],
  })

  // Final tiebreaker: registration date (oldest first), then stable id
  snapshots.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
    if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
    const dateA = a.participant.createdAt.getTime()
    const dateB = b.participant.createdAt.getTime()
    if (dateA !== dateB) return dateA - dateB
    return a.participant.id < b.participant.id ? -1 : 1
  })

  for (let i = 0; i < snapshots.length; i++) {
    const newPos = i + 1
    await prisma.rankingSnapshot.update({
      where: { id: snapshots[i].id },
      data: {
        previousPosition: snapshots[i].currentPosition > 0 ? snapshots[i].currentPosition : newPos,
        currentPosition: newPos,
      },
    })
  }
}

export async function GET() {
  const matches = await prisma.match.findMany({
    include: { team1: true, team2: true },
    orderBy: { kickoffUtc: 'asc' },
  })
  return NextResponse.json({ matches })
}
