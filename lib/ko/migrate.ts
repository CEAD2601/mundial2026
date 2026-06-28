import { prisma } from '@/lib/prisma'

let migrated = false

export async function ensureKOTables() {
  if (migrated) return

  const sqls = [
    [`CREATE TABLE IF NOT EXISTS "KOParticipant" (
      "id" TEXT PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      "nationalId" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT,
      "city" TEXT,
      "participationCode" TEXT NOT NULL,
      "phase" TEXT NOT NULL DEFAULT 'R32',
      "submittedAt" TIMESTAMP(3),
      "isComplete" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`],
    [`CREATE UNIQUE INDEX IF NOT EXISTS "KOParticipant_participationCode_key" ON "KOParticipant"("participationCode")`],
    [`CREATE TABLE IF NOT EXISTS "KOPayment" (
      "id" TEXT PRIMARY KEY,
      "participantId" TEXT NOT NULL,
      "paymentMethod" TEXT NOT NULL DEFAULT 'PAGO_MOVIL',
      "amountUsd" DOUBLE PRECISION NOT NULL DEFAULT 20,
      "exchangeRate" DOUBLE PRECISION,
      "amountVes" DOUBLE PRECISION,
      "senderBank" TEXT,
      "senderName" TEXT,
      "senderEmail" TEXT,
      "paymentReference" TEXT,
      "paymentDate" TIMESTAMP(3),
      "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
      "adminNotes" TEXT,
      "verifiedAt" TIMESTAMP(3),
      "rejectedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`],
    [`CREATE UNIQUE INDEX IF NOT EXISTS "KOPayment_participantId_key" ON "KOPayment"("participantId")`],
    [`CREATE UNIQUE INDEX IF NOT EXISTS "KOPayment_paymentReference_key" ON "KOPayment"("paymentReference") WHERE "paymentReference" IS NOT NULL`],
    [`CREATE TABLE IF NOT EXISTS "KOPick" (
      "id" TEXT PRIMARY KEY,
      "participantId" TEXT NOT NULL,
      "matchId" TEXT NOT NULL,
      "homeGoals" INTEGER NOT NULL,
      "awayGoals" INTEGER NOT NULL,
      "penaltyWinner" TEXT,
      "points" INTEGER,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`],
    [`CREATE UNIQUE INDEX IF NOT EXISTS "KOPick_participantId_matchId_key" ON "KOPick"("participantId","matchId")`],
    [`CREATE INDEX IF NOT EXISTS "KOPick_matchId_idx" ON "KOPick"("matchId")`],
    [`CREATE TABLE IF NOT EXISTS "KOMatchResult" (
      "id" TEXT PRIMARY KEY,
      "homeGoals" INTEGER,
      "awayGoals" INTEGER,
      "penaltyWinner" TEXT,
      "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`],
    [`CREATE TABLE IF NOT EXISTS "KORankingSnapshot" (
      "id" TEXT PRIMARY KEY,
      "participantId" TEXT NOT NULL,
      "phase" TEXT NOT NULL DEFAULT 'R32',
      "totalPoints" INTEGER NOT NULL DEFAULT 0,
      "classifiedCorrect" INTEGER NOT NULL DEFAULT 0,
      "exactScores" INTEGER NOT NULL DEFAULT 0,
      "penaltyBonus" INTEGER NOT NULL DEFAULT 0,
      "playedMatches" INTEGER NOT NULL DEFAULT 0,
      "currentPosition" INTEGER NOT NULL DEFAULT 0,
      "previousPosition" INTEGER,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`],
    [`CREATE UNIQUE INDEX IF NOT EXISTS "KORankingSnapshot_participantId_key" ON "KORankingSnapshot"("participantId")`],
  ]

  for (const [sql] of sqls) {
    await prisma.$executeRawUnsafe(sql).catch(() => {})
  }

  // Add FKs separately (safe to fail if already exist)
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "KOPayment" ADD CONSTRAINT "KOPayment_participantId_fkey"
        FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$
  `).catch(() => {})

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "KOPick" ADD CONSTRAINT "KOPick_participantId_fkey"
        FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$
  `).catch(() => {})

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "KORankingSnapshot" ADD CONSTRAINT "KORankingSnapshot_participantId_fkey"
        FOREIGN KEY ("participantId") REFERENCES "KOParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$
  `).catch(() => {})

  migrated = true
}
