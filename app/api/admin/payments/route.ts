import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/generated/prisma'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const method = searchParams.get('method') ?? ''

  const where: Prisma.PaymentWhereInput = {}
  if (status) where.paymentStatus = status as Prisma.EnumPaymentStatusFilter
  if (method) where.paymentMethod = method as Prisma.EnumPaymentMethodFilter
  if (search) {
    where.OR = [
      { participant: { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      { participant: { nationalId: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      { participant: { phone: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      { participant: { participationCode: { contains: search, mode: Prisma.QueryMode.insensitive } } },
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
  paymentReference: z.string().optional(),
  senderBank: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data = updatePaymentSchema.parse(body)

    // Fetch current payment for audit trail
    const current = await prisma.payment.findUnique({
      where: { id: data.paymentId },
      include: { participant: true },
    })
    if (!current) return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })

    const prevStatus = current.paymentStatus

    const updateData: Record<string, unknown> = {
      paymentStatus: data.status,
    }
    if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes
    if (data.paymentReference !== undefined) updateData.paymentReference = data.paymentReference
    if (data.senderBank !== undefined) updateData.senderBank = data.senderBank
    if (data.senderName !== undefined) updateData.senderName = data.senderName
    if (data.senderEmail !== undefined) updateData.senderEmail = data.senderEmail
    if (data.status === 'VERIFIED') updateData.verifiedAt = new Date()
    if (data.status === 'REJECTED') updateData.rejectedAt = new Date()
    // Clear verifiedAt when reverting from VERIFIED
    if (prevStatus === 'VERIFIED' && data.status !== 'VERIFIED') updateData.verifiedAt = null

    const payment = await prisma.payment.update({
      where: { id: data.paymentId },
      data: updateData,
    })

    // Write audit log when status or reference changes
    const statusChanged = prevStatus !== data.status
    const refChanged = data.paymentReference && data.paymentReference !== current.paymentReference
    if (statusChanged || refChanged) {
      const actionMsg = refChanged && !statusChanged
        ? `Referencia editada para ${current.participant.fullName} (${current.participant.participationCode}): ${data.paymentReference}`
        : `Pago de ${current.participant.fullName} (${current.participant.participationCode}): ${prevStatus} -> ${data.status}${data.adminNotes ? ' | ' + data.adminNotes : ''}`

      await prisma.auditLog.create({
        data: {
          action: actionMsg,
          entityType: 'Payment',
          entityId: data.paymentId,
          oldValue: prevStatus,
          newValue: data.status,
        },
      }).catch(() => { /* non-critical — never fail main operation */ })
    }

    return NextResponse.json({ success: true, payment })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
