import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateKOCode } from '@/lib/ko/utils'
import { z } from 'zod'

const registerSchema = z.object({
  fullName:   z.string().min(3, 'Nombre muy corto').max(100),
  nationalId: z.string().min(6, 'Cédula inválida').max(10),
  phone:      z.string().min(10, 'Teléfono inválido').max(15),
  email:      z.string().email().optional().or(z.literal('')),
  city:       z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Un participante no puede inscribirse dos veces en la misma fase KO
    const existing = await prisma.kOParticipant.findFirst({
      where: { nationalId: data.nationalId, phase: 'R32' },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en Dieciseisavos', code: existing.participationCode },
        { status: 409 }
      )
    }

    // Generar código único KO26-XXXXXX
    let code = generateKOCode()
    let attempts = 0
    while (await prisma.kOParticipant.findUnique({ where: { participationCode: code } })) {
      code = generateKOCode()
      if (++attempts > 10) throw new Error('No se pudo generar código único')
    }

    const participant = await prisma.kOParticipant.create({
      data: {
        fullName:          data.fullName,
        nationalId:        data.nationalId,
        phone:             data.phone,
        email:             data.email || null,
        city:              data.city  || null,
        participationCode: code,
        phase:             'R32',
      },
    })

    await prisma.kOPayment.create({
      data: { participantId: participant.id, amountUsd: 20 },
    })

    return NextResponse.json({
      success: true,
      participant: {
        id:                participant.id,
        participationCode: participant.participationCode,
        fullName:          participant.fullName,
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
  try {
    const { searchParams } = new URL(req.url)
    const code       = searchParams.get('code')
    const nationalId = searchParams.get('nationalId')
    const phone      = searchParams.get('phone')

    if (code) {
      const p = await prisma.kOParticipant.findUnique({
        where: { participationCode: code },
        include: { picks: true, payment: true, ranking: true },
      })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({ participant: p })
    }

    if (nationalId) {
      const p = await prisma.kOParticipant.findFirst({ where: { nationalId, phase: 'R32' } })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({ participationCode: p.participationCode })
    }

    if (phone) {
      const last10 = phone.replace(/\D/g, '').slice(-10)
      const p = await prisma.kOParticipant.findFirst({
        where: { phone: { endsWith: last10 }, phase: 'R32' },
      })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({ participationCode: p.participationCode })
    }

    // Buscar datos previos de Fase de Grupos para pre-llenar formulario
    const prefill = searchParams.get('prefill')
    if (prefill) {
      const p = await prisma.participant.findUnique({ where: { nationalId: prefill } })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({
        fullName:   p.fullName,
        nationalId: p.nationalId,
        phone:      p.phone,
        email:      p.email,
        city:       p.city,
      })
    }

    return NextResponse.json({ error: 'Parámetro requerido' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
