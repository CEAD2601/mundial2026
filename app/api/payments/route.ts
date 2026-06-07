import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const DEFAULT_FIXED_RATE = 730
const DEFAULT_ENTRY_USD = 20

const pagoMovilSchema = z.object({
  participationCode: z.string(),
  paymentMethod: z.literal('PAGO_MOVIL'),
  senderBank: z.string().min(2),
  paymentReference: z.string().min(4),
  paymentDate: z.string(),
  amountVesPaid: z.number().optional(),
  adminNotes: z.string().optional(),
})

const zelleSchema = z.object({
  participationCode: z.string(),
  paymentMethod: z.literal('ZELLE'),
  senderName: z.string().min(2),
  senderContact: z.string().min(3),  // email or phone
  paymentReference: z.string().min(2),
  paymentDate: z.string(),
  amountUsdPaid: z.number().optional(),
  adminNotes: z.string().optional(),
})

const reportPaymentSchema = z.discriminatedUnion('paymentMethod', [
  pagoMovilSchema,
  zelleSchema,
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = reportPaymentSchema.parse(body)

    const participant = await prisma.participant.findUnique({
      where: { participationCode: data.participationCode },
      include: { payment: true },
    })
    if (!participant) return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })

    const settings = await prisma.setting.findFirst()
    const fixedRate = settings?.fixedExchangeRate ?? DEFAULT_FIXED_RATE
    const entryUsd = settings?.entryPriceUsd ?? DEFAULT_ENTRY_USD
    const amountVes = Math.round(entryUsd * fixedRate)

    // Check for duplicate reference
    const existingRef = await prisma.payment.findUnique({
      where: { paymentReference: data.paymentReference },
    })
    if (existingRef && existingRef.participantId !== participant.id) {
      return NextResponse.json({ error: 'Referencia de pago ya registrada' }, { status: 409 })
    }

    const commonData = {
      paymentMethod: data.paymentMethod as 'PAGO_MOVIL' | 'ZELLE',
      paymentReference: data.paymentReference,
      paymentDate: new Date(data.paymentDate),
      amountUsd: entryUsd,
      exchangeRate: fixedRate,
      exchangeRateDate: new Date(),
      paymentStatus: 'IN_REVIEW' as const,
    }

    if (data.paymentMethod === 'PAGO_MOVIL') {
      await prisma.payment.update({
        where: { participantId: participant.id },
        data: {
          ...commonData,
          amountVes,
          senderBank: data.senderBank,
          senderName: null,
          senderEmail: null,
        },
      })
    } else {
      await prisma.payment.update({
        where: { participantId: participant.id },
        data: {
          ...commonData,
          amountVes: null,
          senderBank: null,
          senderName: data.senderName,
          senderEmail: data.senderContact,
        },
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
    include: { payment: true },
  })
  if (!participant) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const settings = await prisma.setting.findFirst()
  const fixedRate = settings?.fixedExchangeRate ?? DEFAULT_FIXED_RATE
  const entryUsd = settings?.entryPriceUsd ?? DEFAULT_ENTRY_USD
  const zelleEmail = settings?.zelleEmail ?? 'kissigloxxi@hotmail.com'

  return NextResponse.json({
    payment: participant.payment,
    fixedRate,
    entryUsd,
    amountVes: Math.round(entryUsd * fixedRate),
    zelleEmail,
    participant: {
      fullName: participant.fullName,
      nationalId: participant.nationalId,
      phone: participant.phone,
      participationCode: participant.participationCode,
    },
  })
}
