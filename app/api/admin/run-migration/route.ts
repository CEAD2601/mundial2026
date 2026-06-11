import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// One-time migration: adds pool status columns to Setting.
// Safe to call multiple times (ADD COLUMN IF NOT EXISTS).
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

  await run('poolStatus column', () =>
    sql`ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "poolStatus" TEXT NOT NULL DEFAULT 'OPEN'`)
  await run('poolName column', () =>
    sql`ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "poolName" TEXT NOT NULL DEFAULT 'Quiniela Mundial 2026 - Fase de Grupos'`)
  await run('poolPhase column', () =>
    sql`ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "poolPhase" TEXT NOT NULL DEFAULT 'GROUP_STAGE'`)
  await run('nextPhaseLabel column', () =>
    sql`ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "nextPhaseLabel" TEXT NOT NULL DEFAULT 'Octavos · Cuartos · Semifinales · Final'`)

  return NextResponse.json({ ok: true, results })
}
