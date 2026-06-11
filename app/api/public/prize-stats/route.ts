import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculatePrizePool, DEFAULT_PRIZE_SETTINGS } from '@/lib/prizes'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [verifiedPaymentsCount, settings] = await Promise.all([
    prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } }),
    prisma.setting.findFirst(),
  ])

  const stats = calculatePrizePool({
    verifiedPaymentsCount,
    entryPriceUsd:       settings?.entryPriceUsd       ?? DEFAULT_PRIZE_SETTINGS.entryPriceUsd,
    fixedExchangeRate:   settings?.fixedExchangeRate    ?? DEFAULT_PRIZE_SETTINGS.fixedExchangeRate,
    firstPrizePercent:   settings?.firstPrizePercent    ?? DEFAULT_PRIZE_SETTINGS.firstPrizePercent,
    secondPrizePercent:  settings?.secondPrizePercent   ?? DEFAULT_PRIZE_SETTINGS.secondPrizePercent,
    organizationPercent: settings?.organizationPercent  ?? DEFAULT_PRIZE_SETTINGS.organizationPercent,
  })

  return NextResponse.json(stats)
}
