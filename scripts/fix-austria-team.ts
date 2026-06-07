/**
 * One-time fix: Replace the erroneous "Australia (J)" team in Group J with Austria.
 *
 * Run with:
 *   npx tsx scripts/fix-austria-team.ts
 *
 * Safe to run multiple times (idempotent).
 */

import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
const connectionString = process.env.DATABASE_URL ?? ''
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('=== Fix Austria/Australia in Group J ===\n')

  // 1. Check for the bad team
  const badTeam = await prisma.team.findFirst({
    where: {
      OR: [
        { fifaCode: 'AUS2' },
        { displayName: 'Australia (J)' },
        { group: 'J', isoCode: 'au' },
      ],
    },
  })

  if (!badTeam) {
    console.log('No bad team found — checking for existing Austria...')
    const existingAustria = await prisma.team.findFirst({ where: { fifaCode: 'AUT' } })
    if (existingAustria) {
      console.log(`Austria already exists (id=${existingAustria.id}, group=${existingAustria.group}) — nothing to do.`)
      return
    }
    console.log('Neither Australia (J) nor Austria found. Manual check needed.')
    return
  }

  console.log(`Found bad team: id=${badTeam.id}, displayName="${badTeam.displayName}", fifaCode=${badTeam.fifaCode}, isoCode=${badTeam.isoCode}`)

  // 2. Check if an Austria team already exists (separate record)
  const existingAustria = await prisma.team.findFirst({ where: { fifaCode: 'AUT' } })
  let austriaId: string

  if (existingAustria) {
    console.log(`Austria already exists as separate record (id=${existingAustria.id}). Migrating match refs and deleting bad record...`)
    austriaId = existingAustria.id

    // Reassign matches from bad team to Austria
    const updated1 = await prisma.match.updateMany({ where: { team1Id: badTeam.id }, data: { team1Id: austriaId } })
    const updated2 = await prisma.match.updateMany({ where: { team2Id: badTeam.id }, data: { team2Id: austriaId } })
    console.log(`  Migrated ${updated1.count + updated2.count} match references to Austria.`)

    // Delete the bad record
    await prisma.team.delete({ where: { id: badTeam.id } })
    console.log(`  Deleted bad team record.`)
  } else {
    // 3. Update bad team record in-place to become Austria
    const updated = await prisma.team.update({
      where: { id: badTeam.id },
      data: {
        officialName: 'Austria',
        displayName: 'Austria',
        shortName: 'AUT',
        fifaCode: 'AUT',
        isoCode: 'at',
        flagEmoji: '\u{1F1E6}\u{1F1F9}',
        group: 'J',
        aliases: '["AUSTRIA","Austria","AUT"]',
      },
    })
    austriaId = updated.id
    console.log(`  Updated team record to Austria (id=${austriaId}).`)
  }

  // 4. Also remove AUSTRIA alias from Australia (Group D) if present
  const australiaD = await prisma.team.findFirst({ where: { fifaCode: 'AUS', group: 'D' } })
  if (australiaD && australiaD.aliases?.includes('AUSTRIA')) {
    await prisma.team.update({
      where: { id: australiaD.id },
      data: { aliases: '["AUSTRALIA","Australia"]' },
    })
    console.log('Removed AUSTRIA alias from Australia (Group D).')
  }

  // 5. Verify Group J
  const groupJ = await prisma.team.findMany({ where: { group: 'J' }, orderBy: { shortName: 'asc' } })
  console.log('\nGroup J teams after fix:')
  for (const t of groupJ) {
    console.log(`  ${t.flagEmoji} ${t.displayName} (fifaCode=${t.fifaCode}, isoCode=${t.isoCode})`)
  }

  // 6. Verify Group J matches
  const groupJMatches = await prisma.match.findMany({
    where: { group: 'J' },
    include: { team1: true, team2: true },
    orderBy: { matchNumber: 'asc' },
  })
  console.log('\nGroup J matches after fix:')
  for (const m of groupJMatches) {
    console.log(`  Match #${m.matchNumber}: ${m.team1.displayName} vs ${m.team2.displayName}`)
  }

  console.log('\n✅ Fix complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
