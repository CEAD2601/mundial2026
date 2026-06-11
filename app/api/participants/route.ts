import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateParticipationCode } from '@/lib/utils'
import { isRegistrationOpen } from '@/lib/deadline'
import { z } from 'zod'

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nombre muy corto').max(100),
  nationalId: z.string().min(6, 'Cédula inválida').max(10),
  phone: z.string().min(10, 'Teléfono inválido').max(15),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Deadline guard — no new registrations after tournament start
    if (!isRegistrationOpen()) {
      return NextResponse.json({ error: 'Las inscripciones ya cerraron.' }, { status: 403 })
    }

    const body = await req.json()
    const data = registerSchema.parse(body)

    // Check for duplicate CI
    const existing = await prisma.participant.findUnique({
      where: { nationalId: data.nationalId },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un participante con esa cédula', code: existing.participationCode },
        { status: 409 }
      )
    }

    // Generate unique code
    let code = generateParticipationCode()
    let attempts = 0
    while (await prisma.participant.findUnique({ where: { participationCode: code } })) {
      code = generateParticipationCode()
      if (++attempts > 10) throw new Error('No se pudo generar código único')
    }

    const participant = await prisma.participant.create({
      data: {
        fullName: data.fullName,
        nationalId: data.nationalId,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        participationCode: code,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: { participantId: participant.id, amountUsd: 20 },
    })

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        participationCode: participant.participationCode,
        fullName: participant.fullName,
      },
    })
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
  const nationalId = searchParams.get('nationalId')

  if (code) {
    const participant = await prisma.participant.findUnique({
      where: { participationCode: code },
      include: {
        predictions: { include: { match: { include: { team1: true, team2: true } } } },
        payment: true,
        ranking: true,
      },
    })
    if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ participant })
  }

  if (nationalId) {
    const participant = await prisma.participant.findUnique({ where: { nationalId } })
    if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ participationCode: participant.participationCode })
  }

  const phone = searchParams.get('phone')
  if (phone) {
    // Match last 10 digits so +584141234567, 04141234567, 4141234567 all work
    const last10 = phone.replace(/\D/g, '').slice(-10)
    const participant = await prisma.participant.findFirst({
      where: { phone: { endsWith: last10 } },
    })
    if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ participationCode: participant.participationCode })
  }

  return NextResponse.json({ error: 'Parámetro requerido' }, { status: 400 })
}
