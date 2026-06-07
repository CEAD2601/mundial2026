/**
 * Auditoría completa de datos FIFA World Cup 2026.
 * Verifica equipos, grupos, partidos, banderas y códigos.
 *
 * Run: npx tsx scripts/audit-world-cup-data.ts
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '../lib/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
const connectionString = process.env.DATABASE_URL ?? ''
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter } as any)

// ── Expected data (verified against FIFA official draw 2025-12-04) ────────────
const EXPECTED_GROUPS: Record<string, string[]> = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COL', 'UZB', 'COD'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
}

// Known correct ISO codes
const KNOWN_ISO: Record<string, string> = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COL: 'co', UZB: 'uz', COD: 'cd',
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
}

interface Issue {
  severity: 'ERROR' | 'WARNING'
  description: string
  fix?: string
}

async function main() {
  const issues: Issue[] = []
  const reportLines: string[] = []
  const now = new Date().toISOString()

  const log = (line: string) => { console.log(line); reportLines.push(line) }

  log(`# Auditoría de datos – Quiniela Mundial 2026`)
  log(`Fecha: ${now}`)
  log(`Fuente de referencia: Draw oficial FIFA 04-dic-2025 / fifa.com`)
  log('')

  // ── Fetch all teams & matches ─────────────────────────────────────────────
  const teams = await prisma.team.findMany({ orderBy: [{ group: 'asc' }, { fifaCode: 'asc' }] })
  const matches = await prisma.match.findMany({
    include: { team1: true, team2: true },
    orderBy: { matchNumber: 'asc' },
  })

  log(`## Resumen`)
  log(`- Equipos en DB: ${teams.length} (esperado: 48)`)
  log(`- Partidos en DB: ${matches.length} (esperado: 72)`)
  log('')

  if (teams.length !== 48) {
    issues.push({ severity: 'ERROR', description: `Se esperan 48 equipos, hay ${teams.length}` })
  }
  if (matches.length !== 72) {
    issues.push({ severity: 'ERROR', description: `Se esperan 72 partidos, hay ${matches.length}` })
  }

  // ── Groups audit ──────────────────────────────────────────────────────────
  log('## Grupos')
  const groups = Object.keys(EXPECTED_GROUPS)
  for (const g of groups) {
    const dbTeams = teams.filter(t => t.group === g)
    const dbCodes = dbTeams.map(t => t.fifaCode).sort()
    const expCodes = EXPECTED_GROUPS[g].sort()
    const ok = JSON.stringify(dbCodes) === JSON.stringify(expCodes)
    log(`### Grupo ${g}`)
    for (const t of dbTeams) {
      const isoOk = KNOWN_ISO[t.fifaCode] ? t.isoCode === KNOWN_ISO[t.fifaCode] ? '✅' : `❌ (ISO: ${t.isoCode}, esperado: ${KNOWN_ISO[t.fifaCode]})` : '⚠️ sin referencia'
      log(`  ${t.flagEmoji} ${t.displayName.padEnd(20)} FIFA=${t.fifaCode.padEnd(5)} ISO=${t.isoCode.padEnd(8)} ${isoOk}`)
    }
    if (!ok) {
      const missing = expCodes.filter(c => !dbCodes.includes(c))
      const extra = dbCodes.filter(c => !expCodes.includes(c))
      issues.push({
        severity: 'ERROR',
        description: `Grupo ${g}: equipos incorrectos. DB=[${dbCodes}] Esperado=[${expCodes}]`,
        fix: missing.length ? `Agregar: ${missing.join(', ')}` : '' + extra.length ? `Eliminar: ${extra.join(', ')}` : '',
      })
      log(`  ❌ INCONSISTENCIA – DB: [${dbCodes}] vs Esperado: [${expCodes}]`)
    } else {
      if (dbTeams.length !== 4) {
        issues.push({ severity: 'ERROR', description: `Grupo ${g} tiene ${dbTeams.length} equipos (esperado 4)` })
        log(`  ❌ ${dbTeams.length} equipos (esperado 4)`)
      } else {
        log(`  ✅ OK (4 equipos)`)
      }
    }
    const groupMatches = matches.filter(m => m.group === g)
    if (groupMatches.length !== 6) {
      issues.push({ severity: 'ERROR', description: `Grupo ${g} tiene ${groupMatches.length} partidos (esperado 6)` })
      log(`  ❌ ${groupMatches.length} partidos (esperado 6)`)
    } else {
      log(`  ✅ 6 partidos`)
    }
    log('')
  }

  // ── ISO code check ────────────────────────────────────────────────────────
  log('## Verificación de códigos ISO')
  for (const t of teams) {
    const expectedIso = KNOWN_ISO[t.fifaCode]
    if (expectedIso && t.isoCode !== expectedIso) {
      issues.push({
        severity: 'ERROR',
        description: `${t.displayName} (${t.fifaCode}): ISO incorrecto "${t.isoCode}", esperado "${expectedIso}"`,
        fix: `UPDATE team SET isoCode='${expectedIso}' WHERE fifaCode='${t.fifaCode}'`,
      })
      log(`  ❌ ${t.displayName}: isoCode=${t.isoCode} → debería ser ${expectedIso}`)
    }
  }

  // ── Australia/Austria confusion check ────────────────────────────────────
  log('\n## Verificación Austria / Australia')
  const austria = teams.find(t => t.fifaCode === 'AUT')
  const australia = teams.find(t => t.fifaCode === 'AUS')
  const badAus2 = teams.find(t => t.fifaCode === 'AUS2')

  if (badAus2) {
    issues.push({ severity: 'ERROR', description: 'Existe equipo con fifaCode AUS2 (Australia duplicada) — debe ser AUT (Austria)' })
    log('  ❌ Existe equipo AUS2 — ejecutar fix-austria-team.ts')
  } else {
    log('  ✅ No existe AUS2')
  }

  if (!austria) {
    issues.push({ severity: 'ERROR', description: 'Austria (AUT) no encontrada en DB' })
    log('  ❌ Austria no está en la DB')
  } else {
    log(`  ✅ Austria: isoCode=${austria.isoCode}, group=${austria.group}, flag=${austria.flagEmoji}`)
    if (austria.group !== 'J') issues.push({ severity: 'ERROR', description: `Austria está en grupo ${austria.group}, debería estar en J` })
    if (austria.isoCode !== 'at') issues.push({ severity: 'ERROR', description: `Austria tiene isoCode "${austria.isoCode}", debería ser "at"` })
  }

  if (australia) {
    log(`  ✅ Australia: isoCode=${australia.isoCode}, group=${australia.group}, flag=${australia.flagEmoji}`)
    if (australia.group !== 'D') issues.push({ severity: 'ERROR', description: `Australia está en grupo ${australia.group}, debería estar en D` })
    if (australia.aliases?.includes('AUSTRIA')) {
      issues.push({ severity: 'WARNING', description: 'Australia tiene "AUSTRIA" como alias — alias ambiguo' })
      log('  ⚠️  Australia tiene alias AUSTRIA — eliminar')
    }
  }

  // ── Duplicate team codes check ────────────────────────────────────────────
  log('\n## Verificación de duplicados')
  const codeCount: Record<string, number> = {}
  for (const t of teams) {
    codeCount[t.fifaCode] = (codeCount[t.fifaCode] ?? 0) + 1
  }
  const dups = Object.entries(codeCount).filter(([, c]) => c > 1)
  if (dups.length) {
    for (const [code, cnt] of dups) {
      issues.push({ severity: 'ERROR', description: `Código FIFA duplicado: ${code} (${cnt} equipos)` })
      log(`  ❌ Código duplicado: ${code} (${cnt} veces)`)
    }
  } else {
    log('  ✅ No hay códigos FIFA duplicados')
  }

  // ── Matches list (Group J) ────────────────────────────────────────────────
  log('\n## Partidos Grupo J')
  const groupJMatches = matches.filter(m => m.group === 'J')
  for (const m of groupJMatches) {
    log(`  #${m.matchNumber}: ${m.team1.flagEmoji} ${m.team1.displayName} vs ${m.team2.displayName} ${m.team2.flagEmoji}`)
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  log('\n## Problemas encontrados')
  if (issues.length === 0) {
    log('✅ No se encontraron problemas.')
  } else {
    const errors = issues.filter(i => i.severity === 'ERROR')
    const warnings = issues.filter(i => i.severity === 'WARNING')
    log(`❌ ${errors.length} error(es), ⚠️ ${warnings.length} advertencia(s)`)
    log('')
    for (const issue of issues) {
      log(`${issue.severity === 'ERROR' ? '❌' : '⚠️'} ${issue.description}`)
      if (issue.fix) log(`   → ${issue.fix}`)
    }
  }

  // ── Write report ──────────────────────────────────────────────────────────
  const reportsDir = path.join(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
  const reportPath = path.join(reportsDir, 'team-fixture-audit.md')
  fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8')
  console.log(`\nReporte guardado en: ${reportPath}`)

  if (issues.filter(i => i.severity === 'ERROR').length > 0) process.exit(1)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
