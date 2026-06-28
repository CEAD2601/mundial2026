/**
 * Comprehensive kickoffUtc audit & fix — Mundial 2026
 * GET  → audit only (shows all matches with discrepancies, no changes)
 * POST → applies all fixes (updates kickoffUtc, applies missing results, recalculates ranking)
 *
 * Sources: Yahoo Sports, NBC Sports, worldcuppass.com, ESPN, FIFA (June 2026 schedule)
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyResultToDb } from '@/lib/liveResultsService'

// VET → UTC helper (same logic as seed.ts)
function vet(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, min] = timeStr.split(':').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hour + 4, min, 0))
}

interface Fix {
  matchNumber: number
  correctUtc: Date
  label: string
  resultToApply?: { team1Goals: number; team2Goals: number; note: string }
}

const FIXES: Fix[] = [
  {
    matchNumber: 3,
    correctUtc: vet('2026-06-18', '12:00'), // Czechia vs South Africa — noon, not midnight
    label: '#3 CZE vs RSA: 00:00 VET → 12:00 VET (mediodía, Atlanta)',
  },
  {
    matchNumber: 21,
    correctUtc: vet('2026-06-20', '00:00'), // Türkiye vs Paraguay — midnight Jun 19→20
    label: '#21 TUR vs PAR: Jun-19 12:00 → Jun-20 00:00 VET (medianoche)',
  },
  {
    matchNumber: 23,
    correctUtc: vet('2026-06-25', '22:00'), // Paraguay vs Australia — 10 PM, not 10 AM
    label: '#23 PAR vs AUS: 10:00 VET → 22:00 VET (noche, no madrugada)',
  },
  {
    matchNumber: 24,
    correctUtc: vet('2026-06-25', '22:00'), // Türkiye vs USA — 10 PM, not 10 AM
    label: '#24 TUR vs USA: 10:00 VET → 22:00 VET (noche, no madrugada)',
  },
  {
    matchNumber: 33,
    correctUtc: vet('2026-06-21', '00:00'), // Tunisia vs Japan — midnight Jun 20→21
    label: '#33 TUN vs JPN: Jun-20 12:00 → Jun-21 00:00 VET (medianoche)',
  },
  {
    matchNumber: 43,
    correctUtc: vet('2026-06-15', '12:00'), // Spain vs Cape Verde — noon, not midnight
    label: '#43 ESP vs CPV: 00:00 VET → 12:00 VET (mediodía, Atlanta)',
    resultToApply: {
      team1Goals: 0,
      team2Goals: 0,
      note: 'ESP 0-0 CPV (confirmado ESPN/FIFA — empate sin goles)',
    },
  },
  {
    matchNumber: 45,
    correctUtc: vet('2026-06-21', '12:00'), // Spain vs Saudi Arabia — noon, not midnight
    label: '#45 ESP vs KSA: 00:00 VET → 12:00 VET (mediodía, Atlanta)',
  },
  {
    matchNumber: 46,
    correctUtc: vet('2026-06-21', '18:00'), // Uruguay vs Cape Verde — 6 PM, not 8 PM
    label: '#46 URU vs CPV: 20:00 VET → 18:00 VET (6 PM, Miami)',
  },
  {
    matchNumber: 58,
    correctUtc: vet('2026-06-22', '23:00'), // Jordan vs Algeria — Jun 22, not Jun 23
    label: '#58 JOR vs ALG: Jun-23 23:00 → Jun-22 23:00 VET (fecha corregida)',
  },
  {
    matchNumber: 66,
    correctUtc: vet('2026-06-27', '19:30'), // Colombia vs Portugal — 7:30 PM, not 7:00 PM
    label: '#66 COL vs POR: 19:00 VET → 19:30 VET (7:30 PM, Miami)',
  },
]

// Already fixed (match 56 AUT vs JOR) — exclude from processing
const ALREADY_FIXED = new Set([56])

export async function GET() {
  const matches = await prisma.match.findMany({
    where: { matchNumber: { in: FIXES.map((f) => f.matchNumber) } },
    select: {
      id: true, matchNumber: true, kickoffUtc: true, status: true,
      team1Goals: true, team2Goals: true,
      team1: { select: { shortName: true } },
      team2: { select: { shortName: true } },
    },
  })

  const audit = FIXES.map((fix) => {
    const m = matches.find((x) => x.matchNumber === fix.matchNumber)
    if (!m) return { matchNumber: fix.matchNumber, error: 'no encontrado' }

    const currentUtc = m.kickoffUtc.toISOString()
    const correctUtc = fix.correctUtc.toISOString()
    const needsFix = Math.abs(m.kickoffUtc.getTime() - fix.correctUtc.getTime()) > 60_000

    const currentVetH = (m.kickoffUtc.getUTCHours() - 4 + 24) % 24
    const correctVetH = (fix.correctUtc.getUTCHours() - 4 + 24) % 24

    return {
      matchNumber: fix.matchNumber,
      teams: `${m.team1.shortName} vs ${m.team2.shortName}`,
      currentUtc,
      currentVet: `${String(currentVetH).padStart(2,'0')}:${String(m.kickoffUtc.getUTCMinutes()).padStart(2,'0')}`,
      correctUtc,
      correctVet: `${String(correctVetH).padStart(2,'0')}:${String(fix.correctUtc.getUTCMinutes()).padStart(2,'0')}`,
      needsFix,
      label: fix.label,
      status: m.status,
      hasResult: m.team1Goals !== null,
      resultInDb: m.team1Goals !== null ? `${m.team1Goals}-${m.team2Goals}` : null,
      resultToApply: fix.resultToApply ?? null,
    }
  })

  return NextResponse.json({ audit, alreadyFixed: ['#56 AUT vs JOR — corregido previamente'] })
}

export async function POST() {
  const matchNumbers = FIXES.map((f) => f.matchNumber)
  const matches = await prisma.match.findMany({
    where: { matchNumber: { in: matchNumbers } },
    select: {
      id: true, matchNumber: true, kickoffUtc: true, status: true,
      team1Goals: true, team2Goals: true,
      team1: { select: { shortName: true } },
      team2: { select: { shortName: true } },
    },
  })

  const results: Array<{
    matchNumber: number
    teams: string
    action: string
    kickoffFixed: boolean
    resultApplied: boolean
    conflict?: boolean
    error?: string
  }> = []

  for (const fix of FIXES) {
    if (ALREADY_FIXED.has(fix.matchNumber)) continue

    const m = matches.find((x) => x.matchNumber === fix.matchNumber)
    if (!m) {
      results.push({ matchNumber: fix.matchNumber, teams: '?', action: fix.label, kickoffFixed: false, resultApplied: false, error: 'no encontrado' })
      continue
    }

    const needsKickoffFix = Math.abs(m.kickoffUtc.getTime() - fix.correctUtc.getTime()) > 60_000
    let kickoffFixed = false
    let resultApplied = false
    let conflict = false
    const errors: string[] = []

    // 1. Fix kickoffUtc
    if (needsKickoffFix) {
      try {
        await prisma.match.update({
          where: { id: m.id },
          data: { kickoffUtc: fix.correctUtc },
          select: { id: true },
        })
        kickoffFixed = true

        await prisma.liveResultsLog.create({
          data: {
            type: 'FIX_TIME_PARSE_ERROR',
            message: `${fix.label} | Anterior: ${m.kickoffUtc.toISOString()} → Correcto: ${fix.correctUtc.toISOString()}`,
            matchId: m.id,
          },
        }).catch(() => {})
      } catch (e) {
        errors.push(`kickoffUtc fix error: ${e instanceof Error ? e.message : e}`)
      }
    }

    // 2. Apply result if match already played and result missing
    if (fix.resultToApply) {
      const { team1Goals, team2Goals, note } = fix.resultToApply

      if (m.status === 'FINISHED' && m.team1Goals === team1Goals && m.team2Goals === team2Goals) {
        errors.push('resultado ya estaba correcto')
      } else if (m.status === 'FINISHED' && (m.team1Goals !== team1Goals || m.team2Goals !== team2Goals)) {
        conflict = true
        errors.push(`CONFLICTO: DB tiene ${m.team1Goals}-${m.team2Goals} pero fix esperaba ${team1Goals}-${team2Goals}`)
        await prisma.liveResultsLog.create({
          data: {
            type: 'ERROR',
            message: `CONFLICT: Match #${fix.matchNumber} ya tiene ${m.team1Goals}-${m.team2Goals} pero fix esperaba ${team1Goals}-${team2Goals}`,
            matchId: m.id,
          },
        }).catch(() => {})
      } else {
        try {
          await applyResultToDb(m.id, team1Goals, team2Goals, 'manual_fix')
          resultApplied = true

          await prisma.liveResultsLog.create({
            data: {
              type: 'FIX_RESULT_APPLIED',
              message: `Match #${fix.matchNumber} resultado aplicado: ${team1Goals}-${team2Goals}. ${note}. Ranking recalculado.`,
              matchId: m.id,
              adminAction: 'MANUAL_FIX',
              detectedGoals1: team1Goals,
              detectedGoals2: team2Goals,
            },
          }).catch(() => {})
        } catch (e) {
          errors.push(`result apply error: ${e instanceof Error ? e.message : e}`)
        }
      }
    }

    results.push({
      matchNumber: fix.matchNumber,
      teams: `${m.team1.shortName} vs ${m.team2.shortName}`,
      action: fix.label,
      kickoffFixed,
      resultApplied,
      conflict,
      error: errors.length ? errors.join('; ') : undefined,
    })
  }

  const fixedCount = results.filter((r) => r.kickoffFixed).length
  const resultsApplied = results.filter((r) => r.resultApplied).length
  const conflicts = results.filter((r) => r.conflict).length

  return NextResponse.json({
    success: conflicts === 0,
    summary: {
      kickoffTimesFixed: fixedCount,
      resultsApplied,
      conflicts,
      total: results.length,
    },
    results,
    alreadyFixed: '#56 AUT vs JOR — corregido previamente',
  })
}
