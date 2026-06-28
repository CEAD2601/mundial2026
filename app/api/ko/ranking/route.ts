import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const snapshots = await prisma.kORankingSnapshot.findMany({
    include: {
      participant: {
        include: { payment: true },
      },
    },
    orderBy: [
      { totalPoints:       'desc' },
      { classifiedCorrect: 'desc' },
      { exactScores:       'desc' },
      { penaltyBonus:      'desc' },
    ],
  })

  const ranking = snapshots
    .filter(s => s.participant.payment?.paymentStatus === 'VERIFIED')
    .map((s, idx) => ({
      position:         idx + 1,
      previousPosition: s.previousPosition,
      movement:         s.previousPosition != null ? s.previousPosition - (idx + 1) : 0,
      participationCode: s.participant.participationCode,
      fullName:          s.participant.fullName,
      city:              s.participant.city,
      totalPoints:       s.totalPoints,
      classifiedCorrect: s.classifiedCorrect,
      exactScores:       s.exactScores,
      penaltyBonus:      s.penaltyBonus,
      playedMatches:     s.playedMatches,
      paymentStatus:     s.participant.payment?.paymentStatus ?? 'PENDING',
    }))

  return NextResponse.json({ ranking })
}
