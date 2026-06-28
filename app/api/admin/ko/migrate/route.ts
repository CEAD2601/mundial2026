import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== 'CEAD2601') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runMigration()
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  if (body.secret !== 'CEAD2601') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runMigration()
}

async function runMigration() {
  const results: string[] = []
  const errors: string[] = []

  async function exec(label: string, sql: string) {
    try {
      await prisma.$executeRawUnsafe(sql)
      results.push(`OK: ${label}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      // "already exists" is fine
      if (msg.includes('already exists')) {
        results.push(`SKIP (exists): ${label}`)
      } else {
        errors.push(`ERR ${label}: ${msg}`)
      }
    }
  }

  await exec('KOParticipant', `
    CREATE TABLE IF NOT EXISTS "KOParticipant" (
      "id"                TEXT PRIMARY KEY,
      "fullName"          TEXT NOT NULL,
      "nationalId"        TEXT NOT NULL,
      "phone"             TEXT NOT NULL,
      "email"             TEXT,
      "city"              TEXT,
      "participationCode" TEXT NOT NULL,
      "phase"             TEXT NOT NULL DEFAULT 'R32',
      "submittedAt"       TIMESTAMP(3),
      "isComplete"        BOOLEAN NOT NULL DEFAULT false,
      "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await exec('KOParticipant_participationCode_unique', `
    CREATE UNIQUE INDEX IF NOT EXISTS "KOParticipant_participationCode_key"
    ON "KOParticipant"("participationCode")
  `)

  await exec('KOPayment', `
    CREATE TABLE IF NOT EXISTS "KOPayment" (
      "id"               TEXT PRIMARY KEY,
      "participantId"    TEXT NOT NULL,
      "paymentMethod"    TEXT NOT NULL DEFAULT 'PAGO_MOVIL',
      "amountUsd"        DOUBLE PRECISION NOT NULL DEFAULT 20,
      "exchangeRate"     DOUBLE PRECISION,
      "amountVes"        DOUBLE PRECISION,
      "senderBank"       TEXT,
      "senderName"       TEXT,
      "senderEmail"      TEXT,
      "paymentReference" TEXT,
      "paymentDate"      TIMESTAMP(3),
      "paymentStatus"    TEXT NOT NULL DEFAULT 'PENDING',
      "adminNotes"       TEXT,
      "verifiedAt"       TIMESTAMP(3),
      "rejectedAt"       TIMESTAMP(3),
      "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await exec('KOPayment_participantId_unique', `
    CREATE UNIQUE INDEX IF NOT EXISTS "KOPayment_participantId_key"
    ON "KOPayment"("participantId")
  `)

  await exec('KOPayment_paymentReference_unique', `
    CREATE UNIQUE INDEX IF NOT EXISTS "KOPayment_paymentReference_key"
    ON "KOPayment"("paymentReference") WHERE "paymentReference" IS NOT NULL
  `)

  await exec('KOPayment_fk', `
    ALTER TABLE "KOPayment"
    ADD CONSTRAINT IF NOT EXISTS "KOPayment_participantId_fkey"
    FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
  `)

  await exec('KOPick', `
    CREATE TABLE IF NOT EXISTS "KOPick" (
      "id"            TEXT PRIMARY KEY,
      "participantId" TEXT NOT NULL,
      "matchId"       TEXT NOT NULL,
      "homeGoals"     INTEGER NOT NULL,
      "awayGoals"     INTEGER NOT NULL,
      "penaltyWinner" TEXT,
      "points"        INTEGER,
      "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await exec('KOPick_unique', `
    CREATE UNIQUE INDEX IF NOT EXISTS "KOPick_participantId_matchId_key"
    ON "KOPick"("participantId", "matchId")
  `)

  await exec('KOPick_matchId_idx', `
    CREATE INDEX IF NOT EXISTS "KOPick_matchId_idx" ON "KOPick"("matchId")
  `)

  await exec('KOPick_fk', `
    ALTER TABLE "KOPick"
    ADD CONSTRAINT IF NOT EXISTS "KOPick_participantId_fkey"
    FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
  `)

  await exec('KOMatchResult', `
    CREATE TABLE IF NOT EXISTS "KOMatchResult" (
      "id"            TEXT PRIMARY KEY,
      "homeGoals"     INTEGER,
      "awayGoals"     INTEGER,
      "penaltyWinner" TEXT,
      "status"        TEXT NOT NULL DEFAULT 'SCHEDULED',
      "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await exec('KORankingSnapshot', `
    CREATE TABLE IF NOT EXISTS "KORankingSnapshot" (
      "id"                TEXT PRIMARY KEY,
      "participantId"     TEXT NOT NULL,
      "phase"             TEXT NOT NULL DEFAULT 'R32',
      "totalPoints"       INTEGER NOT NULL DEFAULT 0,
      "classifiedCorrect" INTEGER NOT NULL DEFAULT 0,
      "exactScores"       INTEGER NOT NULL DEFAULT 0,
      "penaltyBonus"      INTEGER NOT NULL DEFAULT 0,
      "playedMatches"     INTEGER NOT NULL DEFAULT 0,
      "currentPosition"   INTEGER NOT NULL DEFAULT 0,
      "previousPosition"  INTEGER,
      "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await exec('KORankingSnapshot_participantId_unique', `
    CREATE UNIQUE INDEX IF NOT EXISTS "KORankingSnapshot_participantId_key"
    ON "KORankingSnapshot"("participantId")
  `)

  await exec('KORankingSnapshot_fk', `
    ALTER TABLE "KORankingSnapshot"
    ADD CONSTRAINT IF NOT EXISTS "KORankingSnapshot_participantId_fkey"
    FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
  `)

  // Verify what exists
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('KOParticipant','KOPayment','KOPick','KOMatchResult','KORankingSnapshot')
    ORDER BY tablename
  `

  return NextResponse.json({
    ok: errors.length === 0,
    results,
    errors,
    tablesInDB: tables.map(r => r.tablename),
  })
}
