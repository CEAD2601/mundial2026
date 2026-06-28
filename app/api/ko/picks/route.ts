import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'
import { z } from 'zod'

const pickSchema = z.object({
  matchId:       z.string(),
  homeGoals:     z.number().int().min(0).max(20),
  awayGoals:     z.number().int().min(0).max(20),
  penaltyWinner: z.enum(['home', 'away']).nullable().optional(),
})

const saveSchema = z.object({
  participationCode: z.string(),
  picks:             z.array(pickSchema).min(1),
  confirm:           z.boolean().optional(),
})

// Un partido está bloqueado si existe KOMatchResult con status != SCHEDULED
async function getLockedMatchIds(): Promise<Set<string>> {
  const locked = await prisma.kOMatchResult.findMany({
    where: { status: { not: 'SCHEDULED' } },
    select: { id: true },
  })
  return new Set(locked.map(r => r.id))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = saveSchema.parse(body)

    const participant = await prisma.kOParticipant.findUnique({
      where: { participationCode: data.participationCode },
      include: { picks: true },
    })
    if (!participant) return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })

    // Si ya confirmó, no puede modificar
    if (participant.isComplete) {
      return NextResponse.json({ error: 'Tu quiniela ya está confirmada y no puede modificarse' }, { status: 403 })
    }

    const lockedIds = await getLockedMatchIds()

    // Validar cada pick
    for (const pick of data.picks) {
      if (lockedIds.has(pick.matchId)) {
        return NextResponse.json({ error: `El partido ${pick.matchId} ya no acepta pronósticos` }, { status: 400 })
      }
      // Si es empate, penalty winner es requerido
      if (pick.homeGoals === pick.awayGoals && !pick.penaltyWinner) {
        return NextResponse.json({ error: `Debes seleccionar penales para ${pick.matchId}` }, { status: 400 })
      }
      // Si no es empate, limpiar penalty winner
      if (pick.homeGoals !== pick.awayGoals) {
        pick.penaltyWinner = null
      }
    }

    // Guardar picks (upsert)
    for (const pick of data.picks) {
      await prisma.kOPick.upsert({
        where: {
          participantId_matchId: { participantId: participant.id, matchId: pick.matchId },
        },
        update: {
          homeGoals:     pick.homeGoals,
          awayGoals:     pick.awayGoals,
          penaltyWinner: pick.homeGoals === pick.awayGoals ? (pick.penaltyWinner ?? null) : null,
        },
        create: {
          participantId: participant.id,
          matchId:       pick.matchId,
          homeGoals:     pick.homeGoals,
          awayGoals:     pick.awayGoals,
          penaltyWinner: pick.homeGoals === pick.awayGoals ? (pick.penaltyWinner ?? null) : null,
        },
      })
    }

    // Confirmación: verificar que todos los partidos abiertos tienen pick
    if (data.confirm) {
      const openMatchIds = KNOCKOUT_MATCHES
        .filter(m => m.stage === 'R32' && m.isOpenForPredictions && !lockedIds.has(m.id))
        .map(m => m.id)

      const savedPicks = await prisma.kOPick.findMany({
        where: { participantId: participant.id },
        select: { matchId: true },
      })
      const savedIds = new Set(savedPicks.map(p => p.matchId))

      const missing = openMatchIds.filter(id => !savedIds.has(id))
      if (missing.length > 0) {
        return NextResponse.json({
          error: `Faltan ${missing.length} partido(s) por pronosticar`,
          missing,
        }, { status: 400 })
      }

      await prisma.kOParticipant.update({
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

  const participant = await prisma.kOParticipant.findUnique({
    where: { participationCode: code },
    include: {
      picks:   { orderBy: { matchId: 'asc' } },
      payment: true,
      ranking: true,
    },
  })
  if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const results = await prisma.kOMatchResult.findMany()
  const resultMap = Object.fromEntries(results.map(r => [r.id, r]))

  return NextResponse.json({
    participant: {
      id:                participant.id,
      fullName:          participant.fullName,
      nationalId:        participant.nationalId,
      participationCode: participant.participationCode,
      isComplete:        participant.isComplete,
      submittedAt:       participant.submittedAt,
      phase:             participant.phase,
      payment:           participant.payment,
      ranking:           participant.ranking,
    },
    picks:     participant.picks,
    results:   resultMap,
    matches:   KNOCKOUT_MATCHES,
  })
}
