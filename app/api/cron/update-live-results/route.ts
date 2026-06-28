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
import { prisma } from '@/lib/prisma'

function validateCronSecret(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (!cronSecret) return false
  const authHeader = req.headers.get('authorization')
  const querySecret = req.nextUrl.searchParams.get('secret')
  const provided = (authHeader?.replace('Bearer ', '') ?? querySecret ?? '').trim()
  return provided === cronSecret
}

export async function POST(req: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  if (!validateCronSecret(req)) {
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
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }
  if (!validateCronSecret(req)) {
    await prisma.liveResultsLog.create({
      data: { type: 'CRON_UNAUTHORIZED', message: 'Unauthorized cron attempt — check Authorization header and CRON_SECRET match' },
    }).catch(() => {})
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.liveResultsLog.create({
    data: { type: 'EXTERNAL_CRON_RUN_STARTED', message: 'External cron started (cron-job.org)' },
  }).catch(() => {})

  try {
    const summary = await runLiveResultsUpdate()
    await prisma.liveResultsLog.create({
      data: {
        type: 'EXTERNAL_CRON_RUN_COMPLETED',
        message: `External cron completed: ${summary.matchesChecked} checked, ${summary.resultsAutoApplied} applied, ${summary.resultsPendingReview} pending`,
      },
    }).catch(() => {})
    return NextResponse.json({ success: true, source: 'external-cron', summary })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    await prisma.liveResultsLog.create({
      data: { type: 'EXTERNAL_CRON_RUN_ERROR', message: `External cron error: ${message}` },
    }).catch(() => {})
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
