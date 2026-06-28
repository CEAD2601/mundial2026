/**
 * One-time fix endpoint — Austria vs Jordan (match #56)
 * GET  → audit: shows current DB state, detects kickoffUtc correctness
 * POST → applies fix: corrects kickoffUtc if wrong, applies result if missing, recalculates ranking
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyResultToDb } from '@/lib/liveResultsService'

// Austria vs Jordan: midnight VET = 2026-06-17T04:00:00Z
const CORRECT_KICKOFF_UTC = new Date('2026-06-17T04:00:00.000Z')
const NOON_KICKOFF_UTC    = new Date('2026-06-17T16:00:00.000Z') // what '12:00' VET produces in seed

const AUT_GOALS = 3
const JOR_GOALS = 1

export async function GET() {
  const match = await prisma.match.findFirst({
    where: { matchNumber: 56 },
    select: {
      id: true, matchNumber: true, kickoffUtc: true,
      status: true, result: true, team1Goals: true, team2Goals: true,
      autoResultStatus: true,
      team1: { select: { displayName: true } },
      team2: { select: { displayName: true } },
    },
  })

  if (!match) return NextResponse.json({ error: 'Partido #56 no encontrado' }, { status: 404 })

  const kickoffIso = match.kickoffUtc.toISOString()
  const storedUtcHour = match.kickoffUtc.getUTCHours()
  const vetDisplayHour = storedUtcHour - 4 < 0 ? storedUtcHour - 4 + 24 : storedUtcHour - 4
  const timeIssue = Math.abs(match.kickoffUtc.getTime() - NOON_KICKOFF_UTC.getTime()) < 1000

  return NextResponse.json({
    match: {
      id: match.id,
      name: `${match.team1.displayName} vs ${match.team2.displayName}`,
      kickoffUtcStored: kickoffIso,
      vetDisplayTime: `${String(vetDisplayHour).padStart(2,'0')}:${String(match.kickoffUtc.getUTCMinutes()).padStart(2,'0')}`,
      status: match.status,
      result: match.result,
      team1Goals: match.team1Goals,
      team2Goals: match.team2Goals,
      autoResultStatus: match.autoResultStatus,
    },
    diagnosis: {
      kickoffTimeIssue: timeIssue ? '⚠️  Almacenado como 12:00 VET (noon). Debería ser 00:00 VET (midnight).' : '✅ kickoffUtc parece correcto',
      resultMissing: match.status !== 'FINISHED' ? '⚠️  Resultado no aplicado aún' : `✅ Resultado aplicado: ${match.team1Goals}-${match.team2Goals}`,
    },
    action: 'POST /api/admin/fix-match-time para aplicar fix',
  })
}

export async function POST() {
  const match = await prisma.match.findFirst({
    where: { matchNumber: 56 },
    select: {
      id: true, matchNumber: true, kickoffUtc: true,
      status: true, result: true, team1Goals: true, team2Goals: true,
      team1: { select: { displayName: true } },
      team2: { select: { displayName: true } },
    },
  })

  if (!match) return NextResponse.json({ error: 'Partido #56 no encontrado' }, { status: 404 })

  const logs: string[] = []
  let kickoffFixed = false
  let resultApplied = false
  let conflict = false

  // 1. Correct kickoffUtc if stored as noon instead of midnight
  const storedIsNoon = Math.abs(match.kickoffUtc.getTime() - NOON_KICKOFF_UTC.getTime()) < 1000
  if (storedIsNoon) {
    await prisma.match.update({
      where: { id: match.id },
      data: { kickoffUtc: CORRECT_KICKOFF_UTC },
      select: { id: true },
    })
    kickoffFixed = true
    logs.push('kickoffUtc corregido: 2026-06-17T16:00:00Z (12:00 VET) → 2026-06-17T04:00:00Z (00:00 VET)')

    await prisma.liveResultsLog.create({
      data: {
        type: 'FIX_TIME_PARSE_ERROR',
        message: `Corregido horario de Austria vs Jordania: 12:00 p. m. (T16:00Z) → 00:00 VET (T04:00Z). Causa: seed usó '12:00' en lugar de '00:00' para partido de medianoche.`,
        matchId: match.id,
      },
    }).catch(() => {})
  } else {
    logs.push(`kickoffUtc ya es: ${match.kickoffUtc.toISOString()} — no se modificó`)
  }

  // 2. Apply result if not already finished correctly
  if (match.status === 'FINISHED' && match.team1Goals === AUT_GOALS && match.team2Goals === JOR_GOALS) {
    logs.push(`Resultado ya estaba correcto: ${AUT_GOALS}-${JOR_GOALS}. No se modificó.`)
  } else if (match.status === 'FINISHED' && (match.team1Goals !== AUT_GOALS || match.team2Goals !== JOR_GOALS)) {
    conflict = true
    logs.push(`⚠️  CONFLICTO: partido ya finalizado con ${match.team1Goals}-${match.team2Goals}, pero se esperaba ${AUT_GOALS}-${JOR_GOALS}. No sobrescrito.`)
    await prisma.liveResultsLog.create({
      data: {
        type: 'ERROR',
        message: `CONFLICT_RESULT: Austria vs Jordania ya tiene ${match.team1Goals}-${match.team2Goals} pero fix esperaba ${AUT_GOALS}-${JOR_GOALS}. Requiere revisión manual.`,
        matchId: match.id,
      },
    }).catch(() => {})
  } else {
    await applyResultToDb(match.id, AUT_GOALS, JOR_GOALS, 'manual_fix')
    resultApplied = true
    logs.push(`Resultado aplicado: Austria ${AUT_GOALS}-${JOR_GOALS} Jordania. Ranking recalculado.`)

    await prisma.liveResultsLog.create({
      data: {
        type: 'FIX_RESULT_APPLIED',
        message: `Austria ${AUT_GOALS}–${JOR_GOALS} Jordania aplicado y ranking recalculado. (Fix manual — corrección de horario medianoche)`,
        matchId: match.id,
        adminAction: 'MANUAL_FIX',
        detectedGoals1: AUT_GOALS,
        detectedGoals2: JOR_GOALS,
      },
    }).catch(() => {})
  }

  return NextResponse.json({
    success: !conflict,
    conflict,
    kickoffFixed,
    resultApplied,
    logs,
  })
}
