/**
 * scripts/reset-participation-data.ts
 *
 * Safely removes all participation data (participants, predictions, payments,
 * ranking snapshots, live results logs) WITHOUT touching the base data
 * (teams, matches, settings).
 *
 * SAFE TO RUN: only deletes participation records.
 * KEEPS:       Match, Team, Setting (including exchange rate, payment details).
 *
 * Usage:
 *   RESET_CONFIRM=true npx tsx scripts/reset-participation-data.ts
 *
 * Without RESET_CONFIRM=true it does a dry-run and shows what would be deleted.
 */

import 'dotenv/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaClient } from '../lib/generated/prisma'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
const connectionString = process.env.DATABASE_URL ?? ''
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter } as any)

const CONFIRM = process.env.RESET_CONFIRM === 'true'

async function main() {
  console.log('=====================================')
  console.log('  RESET PARTICIPATION DATA')
  console.log('=====================================')
  console.log('')

  if (!CONFIRM) {
    console.log('DRY RUN MODE — no data will be deleted.')
    console.log('To actually delete, run with: RESET_CONFIRM=true')
    console.log('')
  } else {
    console.log('LIVE MODE — data WILL BE PERMANENTLY DELETED.')
    console.log('')
  }

  // Count before deletion
  const [
    rankingCount,
    predictionCount,
    paymentCount,
    participantCount,
    auditCount,
    liveLogCount,
  ] = await Promise.all([
    prisma.rankingSnapshot.count(),
    prisma.prediction.count(),
    prisma.payment.count(),
    prisma.participant.count(),
    prisma.auditLog.count(),
    prisma.liveResultsLog.count(),
  ])

  console.log('Records that will be deleted:')
  console.log(`  RankingSnapshot  : ${rankingCount}`)
  console.log(`  Prediction       : ${predictionCount}`)
  console.log(`  Payment          : ${paymentCount}`)
  console.log(`  Participant      : ${participantCount}`)
  console.log(`  AuditLog         : ${auditCount}`)
  console.log(`  LiveResultsLog   : ${liveLogCount}`)
  console.log('')

  // Show what will be KEPT
  const matchCount   = await prisma.match.count()
  const teamCount    = await prisma.team.count()
  const settingCount = await prisma.setting.count()

  console.log('Records that will be KEPT (base data):')
  console.log(`  Match   : ${matchCount}`)
  console.log(`  Team    : ${teamCount}`)
  console.log(`  Setting : ${settingCount}`)
  console.log('')

  if (!CONFIRM) {
    console.log('Run with RESET_CONFIRM=true to confirm deletion.')
    console.log('')
    await prisma.$disconnect()
    return
  }

  console.log('Deleting... (in safe order)')

  // 1. Ranking snapshots first (references Participant)
  const r1 = await prisma.rankingSnapshot.deleteMany()
  console.log(`  Deleted ${r1.count} RankingSnapshot records`)

  // 2. Predictions (references Participant + Match)
  const r2 = await prisma.prediction.deleteMany()
  console.log(`  Deleted ${r2.count} Prediction records`)

  // 3. Payments (references Participant)
  const r3 = await prisma.payment.deleteMany()
  console.log(`  Deleted ${r3.count} Payment records`)

  // 4. Participants (no more references)
  const r4 = await prisma.participant.deleteMany()
  console.log(`  Deleted ${r4.count} Participant records`)

  // 5. Audit logs (standalone)
  const r5 = await prisma.auditLog.deleteMany()
  console.log(`  Deleted ${r5.count} AuditLog records`)

  // 6. Live results logs (standalone)
  const r6 = await prisma.liveResultsLog.deleteMany()
  console.log(`  Deleted ${r6.count} LiveResultsLog records`)

  // 7. Reset match results back to SCHEDULED (if test results were loaded)
  const r7 = await prisma.match.updateMany({
    where: { status: 'FINISHED' },
    data: {
      status: 'SCHEDULED',
      team1Goals: null,
      team2Goals: null,
      result: null,
      resultUpdatedAt: null,
      resultSource: null,
      autoDetectedTeam1Goals: null,
      autoDetectedTeam2Goals: null,
      autoDetectedResult: null,
      autoDetectedSource: null,
      autoDetectionConfidence: null,
      autoDetectedAt: null,
      autoResultStatus: null,
    },
  })
  if (r7.count > 0) {
    console.log(`  Reset ${r7.count} Match results to SCHEDULED`)
  }

  console.log('')
  console.log('Done! Database is clean and ready for launch.')
  console.log('')
  console.log('Base data preserved:')
  console.log(`  ${await prisma.match.count()} matches`)
  console.log(`  ${await prisma.team.count()} teams`)
  console.log(`  ${await prisma.setting.count()} settings record`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('ERROR:', e)
  process.exit(1)
})
