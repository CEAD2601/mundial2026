import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'CEAD2601'

function isAuthorized(req: NextRequest): boolean {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret === ADMIN_SECRET) return true
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const [participants, paymentCounts] = await Promise.all([
    prisma.kOParticipant.findMany({
      include: {
        payment: { select: { id: true, paymentStatus: true, amountUsd: true, paymentMethod: true, createdAt: true } },
        picks:   { select: { matchId: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    prisma.kOPayment.groupBy({
      by: ['paymentStatus'],
      _count: { id: true },
    }),
  ])

  const statusMap: Record<string, number> = {}
  for (const r of paymentCounts) statusMap[r.paymentStatus] = r._count.id

  const verifiedPayments = await prisma.kOPayment.findMany({
    where: { paymentStatus: 'VERIFIED' },
    select: { amountUsd: true },
  })
  const pozoUSD = verifiedPayments.reduce((s, p) => s + (p.amountUsd ?? 20), 0)

  const recent = participants.slice(0, 20).map(p => ({
    id:                p.id,
    fullName:          p.fullName,
    nationalId:        p.nationalId,
    phone:             p.phone,
    participationCode: p.participationCode,
    isComplete:        p.isComplete,
    picksCount:        p.picks.length,
    paymentStatus:     p.payment?.paymentStatus ?? 'PENDING',
    paymentId:         p.payment?.id ?? null,
    paymentMethod:     p.payment?.paymentMethod ?? null,
    createdAt:         p.createdAt,
  }))

  const inReview = participants
    .filter(p => p.payment?.paymentStatus === 'IN_REVIEW')
    .map(p => ({
      id:                p.id,
      fullName:          p.fullName,
      nationalId:        p.nationalId,
      phone:             p.phone,
      participationCode: p.participationCode,
      picksCount:        p.picks.length,
      isComplete:        p.isComplete,
      paymentId:         p.payment!.id,
      paymentMethod:     p.payment!.paymentMethod,
      createdAt:         p.createdAt,
    }))

  return NextResponse.json({
    stats: {
      total:      participants.length,
      complete:   participants.filter(p => p.isComplete).length,
      pending:    statusMap['PENDING']   ?? 0,
      inReview:   statusMap['IN_REVIEW'] ?? 0,
      verified:   statusMap['VERIFIED']  ?? 0,
      rejected:   statusMap['REJECTED']  ?? 0,
      pozoUSD,
    },
    recent,
    inReview,
  })
}
