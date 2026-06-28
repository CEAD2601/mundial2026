import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'CEAD2601'

function isAdmin(req: NextRequest): boolean {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret === ADMIN_SECRET) return true
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const search = searchParams.get('search') ?? ''

  const payments = await prisma.kOPayment.findMany({
    where: {
      ...(status ? { paymentStatus: status as 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' } : {}),
      ...(search ? {
        OR: [
          { paymentReference: { contains: search } },
          { participant: { fullName:   { contains: search, mode: 'insensitive' } } },
          { participant: { nationalId: { contains: search } } },
          { participant: { phone:      { contains: search } } },
        ],
      } : {}),
    },
    include: { participant: true },
    orderBy: { createdAt: 'desc' },
    take: 300,
  })

  return NextResponse.json({ payments })
}

const updateSchema = z.object({
  paymentId:  z.string(),
  status:     z.enum(['VERIFIED', 'REJECTED', 'IN_REVIEW', 'PENDING']),
  adminNotes: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { paymentId, status, adminNotes } = updateSchema.parse(body)

    const payment = await prisma.kOPayment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: status as 'VERIFIED' | 'REJECTED' | 'IN_REVIEW' | 'PENDING',
        adminNotes:    adminNotes ?? undefined,
        verifiedAt:    status === 'VERIFIED' ? new Date() : undefined,
        rejectedAt:    status === 'REJECTED' ? new Date() : undefined,
      },
    })

    return NextResponse.json({ success: true, payment })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
