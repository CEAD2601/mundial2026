import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/generated/prisma'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''

  const where: Prisma.PaymentWhereInput = {}
  if (status) where.paymentStatus = status as Prisma.EnumPaymentStatusFilter
  if (search) {
    where.OR = [
      { participant: { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      { participant: { nationalId: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      { paymentReference: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { participant: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ payments })
}

const updatePaymentSchema = z.object({
  paymentId: z.string(),
  status: z.enum(['PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED']),
  adminNotes: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data = updatePaymentSchema.parse(body)

    const updateData: Record<string, unknown> = {
      paymentStatus: data.status,
      adminNotes: data.adminNotes,
    }
    if (data.status === 'VERIFIED') updateData.verifiedAt = new Date()
    if (data.status === 'REJECTED') updateData.rejectedAt = new Date()

    const payment = await prisma.payment.update({
      where: { id: data.paymentId },
      data: updateData,
    })

    return NextResponse.json({ success: true, payment })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
