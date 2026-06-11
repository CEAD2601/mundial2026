import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const jar = await cookies()
  if (jar.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalEvents,
    todayEvents,
    eventsByType,
    deviceBreakdown,
    browserBreakdown,
    countryBreakdown,
    recentEvents,
    uniqueVisitorsTotal,
    uniqueVisitorsToday,
  ] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.analyticsEvent.groupBy({ by: ['eventType'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.analyticsEvent.groupBy({ by: ['deviceType'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.analyticsEvent.groupBy({ by: ['browser'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.analyticsEvent.groupBy({ by: ['country'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, eventType: true, path: true, visitorId: true, participantId: true, matchId: true, country: true, city: true, deviceType: true, browser: true, createdAt: true },
    }),
    prisma.analyticsEvent.findMany({ distinct: ['visitorId'], select: { visitorId: true }, where: { visitorId: { not: null } } }).then(r => r.length),
    prisma.analyticsEvent.findMany({ distinct: ['visitorId'], select: { visitorId: true }, where: { visitorId: { not: null }, createdAt: { gte: todayStart } } }).then(r => r.length),
  ])

  const last7DaysRaw = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by date
  const dailyMap = new Map<string, number>()
  for (const e of last7DaysRaw) {
    const d = e.createdAt.toISOString().slice(0, 10)
    dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1)
  }
  const dailyActivity = Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }))

  return NextResponse.json({
    summary: {
      totalEvents,
      todayEvents,
      uniqueVisitorsTotal,
      uniqueVisitorsToday,
    },
    eventsByType: eventsByType.map(r => ({ type: r.eventType, count: r._count.id })),
    deviceBreakdown: deviceBreakdown.map(r => ({ device: r.deviceType ?? 'Desconocido', count: r._count.id })),
    browserBreakdown: browserBreakdown.map(r => ({ browser: r.browser ?? 'Desconocido', count: r._count.id })),
    countryBreakdown: countryBreakdown.map(r => ({ country: r.country ?? 'Desconocido', count: r._count.id })),
    dailyActivity,
    recentEvents,
  })
}
