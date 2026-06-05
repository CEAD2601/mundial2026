/**
 * POST /api/cron/update-live-results
 *
 * Protected cron endpoint for auto-updating match results from public sources.
 * Call this endpoint periodically (e.g. every 10 min during matches) via:
 *   - Vercel Cron Jobs (vercel.json crons section)
 *   - External scheduler (e.g. cron-job.org)
 *   - Manual trigger from admin panel
 *
 * Security: requires CRON_SECRET in Authorization header or `secret` query param.
 *
 * Example Vercel cron configuration (add to vercel.json):
 *   "crons": [{ "path": "/api/cron/update-live-results", "schedule": "0,10,20,30,40,50 * * * *" }]
 * When called by Vercel Cron, the Authorization header is set automatically.
 */

import { NextRequest, NextResponse } from 'next/server'
import { runLiveResultsUpdate } from '@/lib/liveResultsService'

export async function POST(req: NextRequest) {
  // Validate secret
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 503 }
    )
  }

  const authHeader = req.headers.get('authorization')
  const querySecret = req.nextUrl.searchParams.get('secret')
  const providedSecret = authHeader?.replace('Bearer ', '') ?? querySecret

  if (providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summary = await runLiveResultsUpdate()
    return NextResponse.json({ success: true, summary })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Also allow GET for Vercel Cron (which sends GET requests)
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization')
  const querySecret = req.nextUrl.searchParams.get('secret')
  const providedSecret = authHeader?.replace('Bearer ', '') ?? querySecret

  if (providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summary = await runLiveResultsUpdate()
    return NextResponse.json({ success: true, summary })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
