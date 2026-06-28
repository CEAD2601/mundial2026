import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'CEAD2601'

function isAdmin(req: NextRequest): boolean {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret === ADMIN_SECRET) return true
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''

  const participants = await prisma.kOParticipant.findMany({
    where: search ? {
      OR: [
        { fullName:   { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search } },
        { participationCode: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ],
    } : undefined,
    include: {
      payment: true,
      ranking: true,
      picks:   { select: { matchId: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 300,
  })

  return NextResponse.json({ participants })
}
