/**
 * POST /api/admin/ranking/fix-positions
 * Resets previousPosition = currentPosition for all participants (movement becomes 0).
 * Use this when position data is corrupted so indicators show wrong direction.
 * Safe: does NOT modify predictions, matches, or points — only the snapshot positions.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { recalculateParticipantRanking } from '@/lib/liveResultsService'

export async function POST() {
  const jar = await cookies()
  if (jar.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 1. Recalculate all stats from scratch (recomputes points from predictions)
  const participants = await prisma.participant.findMany({
    where: { isComplete: true },
    select: { id: true },
  })
  for (const p of participants) {
    await recalculateParticipantRanking(p.id)
  }

  // 2. Sort all snapshots by ranking criteria
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { submittedAt: true, createdAt: true, id: true } } },
  })
  all.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
    if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
    const dateA = (a.participant.submittedAt ?? a.participant.createdAt).getTime()
    const dateB = (b.participant.submittedAt ?? b.participant.createdAt).getTime()
    if (dateA !== dateB) return dateA - dateB
    return a.participant.id < b.participant.id ? -1 : 1
  })

  // 3. Set previousPosition = currentPosition = correct rank
  //    (movement = 0 for all — clean slate)
  for (let i = 0; i < all.length; i++) {
    const pos = i + 1
    await prisma.rankingSnapshot.update({
      where: { participantId: all[i].participantId },
      data: { previousPosition: pos, currentPosition: pos },
    })
  }

  return NextResponse.json({ success: true, count: all.length, message: 'Posiciones sincronizadas. El movimiento del ranking se mostrará correctamente desde el próximo resultado.' })
}
