import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KO_ENTRY_USD, KO_FIXED_RATE, KO_AMOUNT_VES, KO_ZELLE_EMAIL } from '@/lib/ko/utils'
import { z } from 'zod'

const pagoMovilSchema = z.object({
  participationCode: z.string(),
  paymentMethod:     z.literal('PAGO_MOVIL'),
  senderBank:        z.string().min(2),
  paymentReference:  z.string().min(4),
  paymentDate:       z.string(),
})

const zelleSchema = z.object({
  participationCode: z.string(),
  paymentMethod:     z.literal('ZELLE'),
  senderName:        z.string().min(2),
  senderContact:     z.string().min(3),
  paymentReference:  z.string().min(2),
  paymentDate:       z.string(),
})

const reportSchema = z.discriminatedUnion('paymentMethod', [pagoMovilSchema, zelleSchema])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = reportSchema.parse(body)

    const participant = await prisma.kOParticipant.findUnique({
      where: { participationCode: data.participationCode },
      include: { payment: true },
    })
    if (!participant) return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })

    // Verificar referencia duplicada
    const existingRef = await prisma.kOPayment.findUnique({
      where: { paymentReference: data.paymentReference },
    })
    if (existingRef && existingRef.participantId !== participant.id) {
      return NextResponse.json({ error: 'Referencia de pago ya registrada' }, { status: 409 })
    }

    const commonData = {
      paymentMethod:    data.paymentMethod as 'PAGO_MOVIL' | 'ZELLE',
      paymentReference: data.paymentReference,
      paymentDate:      new Date(data.paymentDate),
      amountUsd:        KO_ENTRY_USD,
      exchangeRate:     KO_FIXED_RATE,
      paymentStatus:    'IN_REVIEW' as const,
    }

    if (data.paymentMethod === 'PAGO_MOVIL') {
      await prisma.kOPayment.update({
        where: { participantId: participant.id },
        data: { ...commonData, amountVes: KO_AMOUNT_VES, senderBank: data.senderBank, senderName: null, senderEmail: null },
      })
    } else {
      await prisma.kOPayment.update({
        where: { participantId: participant.id },
        data: { ...commonData, amountVes: null, senderBank: null, senderName: data.senderName, senderEmail: data.senderContact },
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
    include: { payment: true },
  })
  if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({
    payment:    participant.payment,
    entryUsd:   KO_ENTRY_USD,
    fixedRate:  KO_FIXED_RATE,
    amountVes:  KO_AMOUNT_VES,
    zelleEmail: KO_ZELLE_EMAIL,
    participant: {
      fullName:          participant.fullName,
      nationalId:        participant.nationalId,
      phone:             participant.phone,
      participationCode: participant.participationCode,
    },
  })
}
