import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      payment: true,
      predictions: {
        include: {
          match: {
            include: { team1: true, team2: true },
          },
        },
        orderBy: { match: { matchNumber: 'asc' } },
      },
    },
  })

  if (!participant) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ participant })
}
