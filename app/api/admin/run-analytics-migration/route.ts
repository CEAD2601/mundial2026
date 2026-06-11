import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const results: string[] = []

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try { await fn(); results.push(`✅ ${label}`) }
    catch (e) { results.push(`❌ ${label}: ${e instanceof Error ? e.message : String(e)}`) }
  }

  await run('Create AnalyticsEvent table', () => sql`
    CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
      "id"            TEXT PRIMARY KEY,
      "eventType"     TEXT NOT NULL,
      "path"          TEXT NOT NULL,
      "visitorId"     TEXT,
      "participantId" TEXT,
      "matchId"       TEXT,
      "country"       TEXT,
      "region"        TEXT,
      "city"          TEXT,
      "deviceType"    TEXT,
      "browser"       TEXT,
      "ipHash"        TEXT,
      "metadata"      TEXT,
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await run('Index eventType', () => sql`
    CREATE INDEX IF NOT EXISTS "AnalyticsEvent_eventType_idx"
    ON "AnalyticsEvent"("eventType")
  `)
  await run('Index createdAt', () => sql`
    CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx"
    ON "AnalyticsEvent"("createdAt")
  `)
  await run('Index visitorId', () => sql`
    CREATE INDEX IF NOT EXISTS "AnalyticsEvent_visitorId_idx"
    ON "AnalyticsEvent"("visitorId")
  `)

  return NextResponse.json({ ok: true, results })
}
