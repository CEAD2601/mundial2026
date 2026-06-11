/**
 * GET /api/admin/live-results/status
 * Returns the real runtime values of all LIVE_RESULTS_* env vars.
 * Requires admin session cookie. Does NOT expose CRON_SECRET.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function parseBoolean(value: string | undefined): boolean {
  return ['true', '1', 'yes', 'on'].includes(String(value ?? '').toLowerCase().trim())
}

export async function GET() {
  const jar = await cookies()
  const isAdmin = jar.get('admin_session')?.value === 'authenticated'

  const rawEnabled = process.env.LIVE_RESULTS_ENABLED
  const rawSource = process.env.LIVE_RESULTS_SOURCE
  const rawAutoApply = process.env.LIVE_RESULTS_AUTO_APPLY
  const rawInterval = process.env.LIVE_RESULTS_POLL_INTERVAL_MINUTES

  const lastLog = await prisma.liveResultsLog.findFirst({
    where: { type: 'CRON_RUN' },
    orderBy: { createdAt: 'desc' },
  }).catch(() => null)

  const payload = {
    enabled: parseBoolean(rawEnabled),
    source: rawSource?.trim() || 'public_web',
    autoApply: parseBoolean(rawAutoApply),
    pollIntervalMinutes: parseInt(rawInterval ?? '10', 10) || 10,
    lastRun: lastLog?.createdAt ?? null,
    environment: process.env.VERCEL_ENV ?? 'unknown',
    // raw debug info — only exposed to admin session
    ...(isAdmin ? {
      _debug: {
        LIVE_RESULTS_ENABLED: rawEnabled === undefined
          ? '(undefined)'
          : `"${rawEnabled}" (${rawEnabled.length} chars)`,
        LIVE_RESULTS_SOURCE: rawSource === undefined
          ? '(undefined)'
          : `"${rawSource}" (${rawSource.length} chars)`,
        LIVE_RESULTS_AUTO_APPLY: rawAutoApply === undefined
          ? '(undefined)'
          : `"${rawAutoApply}" (${rawAutoApply.length} chars)`,
      },
    } : {}),
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json(payload)
}
