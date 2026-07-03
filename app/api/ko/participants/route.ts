import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateKOCode } from '@/lib/ko/utils'
import { ensureKOTables } from '@/lib/ko/migrate'
import { getActiveKOPhase, ACTIVE_PHASE_R32, ACTIVE_PHASE_R16_FINAL } from '@/lib/ko/phaseTransition'
import { z } from 'zod'

const registerSchema = z.object({
  fullName:         z.string().min(3, 'Nombre muy corto').max(100),
  nationalId:       z.string().min(6, 'Cédula inválida').max(10),
  phone:            z.string().min(10, 'Teléfono inválido').max(15),
  email:            z.string().email().optional().or(z.literal('')),
  city:             z.string().optional(),
  lateRegistration: z.boolean().optional(),
  phase:            z.string().optional(),   // fase destino explícita
})

// ── INSCRIPCIONES R32 CERRADAS ── 28-jun-2026 19:00 VET
const R32_REGISTRATION_CLOSED = true

export async function POST(req: NextRequest) {
  try {
    await ensureKOTables()
    const body = await req.json()
    const data = registerSchema.parse(body)

    const activePhase   = await getActiveKOPhase()
    const targetPhase   = data.phase ?? activePhase
    const isR16Final    = targetPhase === ACTIVE_PHASE_R16_FINAL

    // R32 cerrado; R16-FINAL abierto cuando es la fase activa
    if (!isR16Final && R32_REGISTRATION_CLOSED && !data.lateRegistration) {
      return NextResponse.json(
        { error: 'Las inscripciones para la Quiniela Dieciseisavos están cerradas.' },
        { status: 403 }
      )
    }

    // R16-Final acepta inscripciones por link directo aunque activePhase sea R32

    // Ya inscrito en esta misma fase
    const existing = await prisma.kOParticipant.findFirst({
      where: { nationalId: data.nationalId, phase: targetPhase },
    })
    if (existing) {
      const label = isR16Final ? 'Octavos a Final' : 'Dieciseisavos'
      return NextResponse.json(
        { error: `Ya estás inscrito en ${label}`, code: existing.participationCode },
        { status: 409 }
      )
    }

    // Generar código único
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
        phase:             targetPhase,
        lateRegistration:  data.lateRegistration === true,
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
        phase:             participant.phase,
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
    await ensureKOTables()
    const { searchParams } = new URL(req.url)
    const code       = searchParams.get('code')
    const nationalId = searchParams.get('nationalId')
    const phone      = searchParams.get('phone')
    const phaseParam = searchParams.get('phase')   // buscar en una fase específica

    if (code) {
      const p = await prisma.kOParticipant.findUnique({
        where: { participationCode: code },
        include: { picks: true, payment: true, ranking: true },
      })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({ participant: p })
    }

    const activePhase = await getActiveKOPhase()

    if (nationalId) {
      // Buscar en la fase solicitada (o en cualquier fase para "ya participé")
      const whereClause = phaseParam
        ? { nationalId, phase: phaseParam }
        : { nationalId }
      const p = await prisma.kOParticipant.findFirst({ where: whereClause })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({
        participationCode: p.participationCode,
        fullName:          p.fullName,
        phone:             p.phone,
        nationalId:        p.nationalId,
        phase:             p.phase,
        city:              p.city,
      })
    }

    if (phone) {
      const last10 = phone.replace(/\D/g, '').slice(-10)
      const whereClause = phaseParam
        ? { phone: { endsWith: last10 }, phase: phaseParam }
        : { phone: { endsWith: last10 } }
      const p = await prisma.kOParticipant.findFirst({ where: whereClause })
      if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
      return NextResponse.json({
        participationCode: p.participationCode,
        fullName:          p.fullName,
        phone:             p.phone,
        nationalId:        p.nationalId,
        phase:             p.phase,
        city:              p.city,
      })
    }

    // Pre-llenar desde Fase de Grupos
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
