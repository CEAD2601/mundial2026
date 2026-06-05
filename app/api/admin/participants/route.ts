import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/generated/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const skip = (page - 1) * limit

  const where: Prisma.ParticipantWhereInput = search
    ? {
        OR: [
          { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { nationalId: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { participationCode: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {}

  const [participants, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      include: { payment: true, ranking: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.participant.count({ where }),
  ])

  return NextResponse.json({ participants, total, page, pages: Math.ceil(total / limit) })
}
