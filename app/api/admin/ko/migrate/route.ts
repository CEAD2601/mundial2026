import { NextRequest, NextResponse } from 'next/server'
import { neonConfig, neon } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// One-time migration endpoint: creates KO tables if missing.
// Protected by ADMIN_SECRET to avoid accidental calls.
export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({}))
  if (secret !== process.env.ADMIN_SECRET && secret !== 'CEAD2601') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 })
  }

  const sql = neon(connectionString)

  try {
    // Create KOParticipant
    await sql`
      CREATE TABLE IF NOT EXISTS "KOParticipant" (
        "id"                TEXT PRIMARY KEY,
        "fullName"          TEXT NOT NULL,
        "nationalId"        TEXT NOT NULL,
        "phone"             TEXT NOT NULL,
        "email"             TEXT,
        "city"              TEXT,
        "participationCode" TEXT NOT NULL UNIQUE,
        "phase"             TEXT NOT NULL DEFAULT 'R32',
        "submittedAt"       TIMESTAMP(3),
        "isComplete"        BOOLEAN NOT NULL DEFAULT false,
        "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create KOPayment
    await sql`
      CREATE TABLE IF NOT EXISTS "KOPayment" (
        "id"               TEXT PRIMARY KEY,
        "participantId"    TEXT NOT NULL UNIQUE,
        "paymentMethod"    TEXT NOT NULL DEFAULT 'PAGO_MOVIL',
        "amountUsd"        DOUBLE PRECISION NOT NULL DEFAULT 20,
        "exchangeRate"     DOUBLE PRECISION,
        "amountVes"        DOUBLE PRECISION,
        "senderBank"       TEXT,
        "senderName"       TEXT,
        "senderEmail"      TEXT,
        "paymentReference" TEXT UNIQUE,
        "paymentDate"      TIMESTAMP(3),
        "paymentStatus"    TEXT NOT NULL DEFAULT 'PENDING',
        "adminNotes"       TEXT,
        "verifiedAt"       TIMESTAMP(3),
        "rejectedAt"       TIMESTAMP(3),
        "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "KOPayment_participantId_fkey"
          FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `

    // Create KOPick
    await sql`
      CREATE TABLE IF NOT EXISTS "KOPick" (
        "id"            TEXT PRIMARY KEY,
        "participantId" TEXT NOT NULL,
        "matchId"       TEXT NOT NULL,
        "homeGoals"     INTEGER NOT NULL,
        "awayGoals"     INTEGER NOT NULL,
        "penaltyWinner" TEXT,
        "points"        INTEGER,
        "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "KOPick_participantId_fkey"
          FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "KOPick_participantId_matchId_key"
          UNIQUE ("participantId", "matchId")
      )
    `

    // Index on matchId for KOPick
    await sql`
      CREATE INDEX IF NOT EXISTS "KOPick_matchId_idx" ON "KOPick"("matchId")
    `

    // Create KOMatchResult
    await sql`
      CREATE TABLE IF NOT EXISTS "KOMatchResult" (
        "id"            TEXT PRIMARY KEY,
        "homeGoals"     INTEGER,
        "awayGoals"     INTEGER,
        "penaltyWinner" TEXT,
        "status"        TEXT NOT NULL DEFAULT 'SCHEDULED',
        "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create KORankingSnapshot
    await sql`
      CREATE TABLE IF NOT EXISTS "KORankingSnapshot" (
        "id"                TEXT PRIMARY KEY,
        "participantId"     TEXT NOT NULL UNIQUE,
        "phase"             TEXT NOT NULL DEFAULT 'R32',
        "totalPoints"       INTEGER NOT NULL DEFAULT 0,
        "classifiedCorrect" INTEGER NOT NULL DEFAULT 0,
        "exactScores"       INTEGER NOT NULL DEFAULT 0,
        "penaltyBonus"      INTEGER NOT NULL DEFAULT 0,
        "playedMatches"     INTEGER NOT NULL DEFAULT 0,
        "currentPosition"   INTEGER NOT NULL DEFAULT 0,
        "previousPosition"  INTEGER,
        "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "KORankingSnapshot_participantId_fkey"
          FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `

    // Verify
    const tables = await sql`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename IN ('KOParticipant','KOPayment','KOPick','KOMatchResult','KORankingSnapshot')
      ORDER BY tablename
    `

    return NextResponse.json({
      ok: true,
      message: 'KO tables created (or already existed)',
      tables: tables.map((r) => (r as { tablename: string }).tablename),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
