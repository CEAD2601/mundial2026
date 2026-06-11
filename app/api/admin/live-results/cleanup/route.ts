/**
 * POST /api/admin/live-results/cleanup
 * Rejects all PENDING_REVIEW auto-results for matches that are not yet FINISHED.
 * Use this to clear incorrect pending detections.
 * Requires admin session cookie.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST() {
  const jar = await cookies()
  if (jar.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Find all pending auto-results where the match is not FINISHED
  const pendingMatches = await prisma.match.findMany({
    where: { autoResultStatus: 'PENDING_REVIEW', status: { not: 'FINISHED' } },
    select: { id: true, matchNumber: true, status: true },
  })

  if (pendingMatches.length === 0) {
    return NextResponse.json({ cleared: 0, message: 'No hay pendientes incorrectos.' })
  }

  // Reject each one
  await prisma.match.updateMany({
    where: { id: { in: pendingMatches.map(m => m.id) } },
    data: { autoResultStatus: 'REJECTED' },
  })

  // Log each rejection
  for (const m of pendingMatches) {
    await prisma.liveResultsLog.create({
      data: {
        type: 'RESULT_REJECTED',
        message: `Pendiente automático descartado: partido #${m.matchNumber} no estaba finalizado (estado: ${m.status})`,
        matchId: m.id,
        adminAction: 'AUTO_CLEANUP',
      },
    })
  }

  return NextResponse.json({
    cleared: pendingMatches.length,
    matches: pendingMatches.map(m => ({ matchNumber: m.matchNumber, status: m.status })),
    message: `${pendingMatches.length} pendiente(s) incorrecto(s) rechazado(s).`,
  })
}
