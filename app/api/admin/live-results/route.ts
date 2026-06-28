/**
 * Admin API for live results management
 * GET  /api/admin/live-results — returns status, pending results, recent logs
 * POST /api/admin/live-results — confirm, reject, or edit an auto-detected result
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { confirmAutoResult, rejectAutoResult, applyResultToDb } from '@/lib/liveResultsService'
import { z } from 'zod'

function parseBoolean(value: string | undefined): boolean {
  return ['true', '1', 'yes', 'on'].includes(String(value ?? '').toLowerCase().trim())
}

// Explicit select to avoid querying columns that may not exist yet in DB
const TEAM_SELECT = {
  displayName: true,
  flagEmoji: true,
  shortName: true,
} as const

const MATCH_SAFE_SELECT = {
  id: true,
  matchNumber: true,
  group: true,
  kickoffUtc: true,
  status: true,
  team1Goals: true,
  team2Goals: true,
  result: true,
  autoDetectedTeam1Goals: true,
  autoDetectedTeam2Goals: true,
  autoDetectedResult: true,
  autoDetectedSource: true,
  autoDetectionConfidence: true,
  autoDetectedAt: true,
  autoResultStatus: true,
} as const

export async function GET() {
  const now = new Date()
  const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const reviewWindowEnd = new Date(now.getTime() - 6 * 60 * 60 * 1000)

  const [pendingMatches, recentLogs, upcomingAndActiveMatches] = await Promise.all([
    prisma.match.findMany({
      where: { autoResultStatus: 'PENDING_REVIEW' },
      select: {
        ...MATCH_SAFE_SELECT,
        team1: { select: TEAM_SELECT },
        team2: { select: TEAM_SELECT },
      },
      orderBy: { kickoffUtc: 'asc' },
    }),
    prisma.liveResultsLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    // All unfinished matches: from 6h ago through next 48h
    // status SCHEDULED/IN_PROGRESS already excludes FINISHED matches — no need to filter autoResultStatus
    // (NULL != 'CONFIRMED' is false in SQL, which would wrongly exclude unprocessed matches)
    prisma.match.findMany({
      where: {
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        kickoffUtc: { gte: reviewWindowEnd, lte: next48h },
      },
      select: {
        ...MATCH_SAFE_SELECT,
        team1: { select: TEAM_SELECT },
        team2: { select: TEAM_SELECT },
      },
      orderBy: { kickoffUtc: 'asc' },
      take: 20,
    }),
  ])

  const isEnabled = parseBoolean(process.env.LIVE_RESULTS_ENABLED)
  const source = process.env.LIVE_RESULTS_SOURCE?.trim() || 'public_web'

  const lastCronRun = recentLogs.find((l) => l.type === 'CRON_RUN')
  const lastExternalCronRun = recentLogs.find((l) => l.type === 'EXTERNAL_CRON_RUN_COMPLETED')
  const lastCronUnauthorized = recentLogs.find((l) => l.type === 'CRON_UNAUTHORIZED')
  const recentErrors = recentLogs.filter((l) => l.type === 'ERROR').slice(0, 5)

  const lastRunAt = lastCronRun?.createdAt ?? null
  const lastExternalCronAt = lastExternalCronRun?.createdAt ?? null
  // nextCronAt based on last external run (the real 10-min motor)
  const nextCronAt = lastExternalCronAt
    ? new Date(lastExternalCronAt.getTime() + 10 * 60 * 1000)
    : lastRunAt
    ? new Date(lastRunAt.getTime() + 10 * 60 * 1000)
    : null

  return NextResponse.json({
    status: {
      enabled: isEnabled,
      source,
      autoApply: true,
      lastRunAt,
      lastExternalCronAt,
      lastCronUnauthorizedAt: lastCronUnauthorized?.createdAt ?? null,
      nextCronAt,
      lastRunMessage: lastCronRun?.message ?? (
        isEnabled
          ? 'Automatización activada. Usa "Actualizar ahora" para ejecutar manualmente o configura Vercel Cron.'
          : 'Automatización desactivada. Para activar, configura LIVE_RESULTS_ENABLED=true en Vercel.'
      ),
    },
    pendingMatches: pendingMatches.map((m) => ({
      id: m.id,
      matchNumber: m.matchNumber,
      group: m.group,
      kickoffUtc: m.kickoffUtc,
      team1: { displayName: m.team1.displayName, flagEmoji: m.team1.flagEmoji },
      team2: { displayName: m.team2.displayName, flagEmoji: m.team2.flagEmoji },
      currentStatus: m.status,
      currentTeam1Goals: m.team1Goals,
      currentTeam2Goals: m.team2Goals,
      autoDetectedTeam1Goals: m.autoDetectedTeam1Goals,
      autoDetectedTeam2Goals: m.autoDetectedTeam2Goals,
      autoDetectedResult: m.autoDetectedResult,
      autoDetectedSource: m.autoDetectedSource,
      autoDetectionConfidence: m.autoDetectionConfidence,
      autoDetectedAt: m.autoDetectedAt,
    })),
    recentErrors: recentErrors.map((l) => ({
      message: l.message,
      createdAt: l.createdAt,
    })),
    recentLogs: recentLogs.slice(0, 20).map((l) => ({
      type: l.type,
      message: l.message,
      matchId: l.matchId,
      source: l.source,
      confidence: l.confidence,
      detectedGoals1: l.detectedGoals1,
      detectedGoals2: l.detectedGoals2,
      adminAction: l.adminAction,
      createdAt: l.createdAt,
    })),
    upcomingChecks: upcomingAndActiveMatches.map((m) => {
      const nowMs = now.getTime()
      const kickoff = m.kickoffUtc.getTime()
      const firstCheckAt = new Date(kickoff + 120 * 60 * 1000)
      const inPlay = nowMs >= kickoff && nowMs < kickoff + 120 * 60 * 1000
      const inWindow = nowMs >= kickoff + 120 * 60 * 1000
      const pastDeadline = nowMs >= kickoff + 6 * 60 * 60 * 1000
      const status: 'WAITING' | 'LIVE_WAITING' | 'CHECKING' | 'REQUIRES_MANUAL' = pastDeadline
        ? 'REQUIRES_MANUAL'
        : inWindow
        ? 'CHECKING'
        : inPlay
        ? 'LIVE_WAITING'
        : 'WAITING'
      return {
        id: m.id,
        matchNumber: m.matchNumber,
        team1: { displayName: m.team1.displayName, flagEmoji: m.team1.flagEmoji },
        team2: { displayName: m.team2.displayName, flagEmoji: m.team2.flagEmoji },
        kickoffUtc: m.kickoffUtc,
        firstCheckAt,
        status,
      }
    }),
  })
}

const actionSchema = z.object({
  action: z.enum(['confirm', 'reject', 'edit']),
  matchId: z.string(),
  // Only required for 'edit'
  team1Goals: z.number().int().min(0).optional(),
  team2Goals: z.number().int().min(0).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = actionSchema.parse(body)

    if (data.action === 'confirm') {
      await confirmAutoResult(data.matchId)
      return NextResponse.json({ success: true, message: 'Resultado confirmado y ranking actualizado' })
    }

    if (data.action === 'reject') {
      await rejectAutoResult(data.matchId)
      return NextResponse.json({ success: true, message: 'Resultado automático rechazado' })
    }

    if (data.action === 'edit') {
      if (data.team1Goals === undefined || data.team2Goals === undefined) {
        return NextResponse.json({ error: 'Se requieren team1Goals y team2Goals para editar' }, { status: 400 })
      }
      await applyResultToDb(data.matchId, data.team1Goals, data.team2Goals, 'manual_edit')
      return NextResponse.json({ success: true, message: 'Resultado editado y ranking actualizado' })
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
