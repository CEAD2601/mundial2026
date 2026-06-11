/**
 * POST /api/admin/live-results/update
 *
 * Admin-only endpoint for manually triggering a live results update.
 * Authenticates via admin session cookie — no CRON_SECRET required from the user.
 * The CRON_SECRET is only used by the separate /api/cron/ endpoint for external schedulers.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { runLiveResultsUpdate } from '@/lib/liveResultsService'

export const dynamic = 'force-dynamic'

export async function POST() {
  const jar = await cookies()
  if (jar.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (process.env.LIVE_RESULTS_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'La automatización está desactivada. Configura LIVE_RESULTS_ENABLED=true en Vercel.' },
      { status: 503 }
    )
  }

  try {
    const summary = await runLiveResultsUpdate()
    return NextResponse.json({ success: true, summary })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno al consultar resultados'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
