import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRegistrationOpen } from '@/lib/deadline'
import { z } from 'zod'

const savePredictionsSchema = z.object({
  participationCode: z.string(),
  predictions: z.array(
    z.object({
      matchId: z.string(),
      predictedTeam1Goals: z.number().int().min(0).max(20),
      predictedTeam2Goals: z.number().int().min(0).max(20),
    })
  ),
  confirm: z.boolean().optional().default(false),
})

function deriveResult(g1: number, g2: number): 'G1' | 'E' | 'G2' {
  if (g1 > g2) return 'G1'
  if (g2 > g1) return 'G2'
  return 'E'
}

export async function POST(req: NextRequest) {
  try {
    // Deadline guard — no new or updated predictions after tournament start
    if (!isRegistrationOpen()) {
      return NextResponse.json({ error: 'Las inscripciones ya cerraron. No se pueden modificar pronósticos.' }, { status: 403 })
    }

    const body = await req.json()
    const data = savePredictionsSchema.parse(body)

    const participant = await prisma.participant.findUnique({
      where: { participationCode: data.participationCode },
    })
    if (!participant) {
      return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })
    }
    if (participant.isComplete && participant.submittedAt) {
      return NextResponse.json({ error: 'La quiniela ya fue confirmada y no puede modificarse' }, { status: 400 })
    }

    for (const pred of data.predictions) {
      const predictedResult = deriveResult(pred.predictedTeam1Goals, pred.predictedTeam2Goals)
      await prisma.prediction.upsert({
        where: { participantId_matchId: { participantId: participant.id, matchId: pred.matchId } },
        update: {
          predictedTeam1Goals: pred.predictedTeam1Goals,
          predictedTeam2Goals: pred.predictedTeam2Goals,
          predictedResult,
        },
        create: {
          participantId: participant.id,
          matchId: pred.matchId,
          predictedTeam1Goals: pred.predictedTeam1Goals,
          predictedTeam2Goals: pred.predictedTeam2Goals,
          predictedResult,
        },
      })
    }

    if (data.confirm) {
      const matchCount = await prisma.match.count()
      const predCount = await prisma.prediction.count({ where: { participantId: participant.id } })
      if (predCount < matchCount) {
        return NextResponse.json({
          error: `Debes completar todos los partidos. Tienes ${predCount} de ${matchCount}`,
        }, { status: 400 })
      }

      await prisma.participant.update({
        where: { id: participant.id },
        data: { isComplete: true, submittedAt: new Date() },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

  const participant = await prisma.participant.findUnique({
    where: { participationCode: code },
    include: {
      predictions: {
        include: { match: { include: { team1: true, team2: true } } },
        orderBy: { match: { matchNumber: 'asc' } },
      },
    },
  })
  if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ predictions: participant.predictions, isComplete: participant.isComplete })
}
