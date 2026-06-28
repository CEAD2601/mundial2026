import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

export async function GET() {
  const results = await prisma.kOMatchResult.findMany()
  const resultMap = Object.fromEntries(results.map(r => [r.id, r]))

  const matchesWithResults = KNOCKOUT_MATCHES.map(m => ({
    ...m,
    result: resultMap[m.id] ?? null,
  }))

  // Stats agregados por partido (cuántos acertaron, etc.)
  const finishedIds = results.filter(r => r.status === 'FINISHED').map(r => r.id)
  const stats: Record<string, { total: number; classified: number; exact: number; penalty: number }> = {}

  if (finishedIds.length > 0) {
    const picks = await prisma.kOPick.findMany({
      where: { matchId: { in: finishedIds }, points: { not: null } },
    })
    for (const pick of picks) {
      if (!stats[pick.matchId]) stats[pick.matchId] = { total: 0, classified: 0, exact: 0, penalty: 0 }
      const s = stats[pick.matchId]
      s.total++
      if ((pick.points ?? 0) >= 2) s.classified++
      if ((pick.points ?? 0) >= 4) s.exact++
      if (pick.points === 5)       s.penalty++
    }
  }

  return NextResponse.json({ matches: matchesWithResults, stats })
}
