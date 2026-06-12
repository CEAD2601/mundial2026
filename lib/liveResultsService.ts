/**
 * Live Results Service — Quiniela Mundial 2026
 *
 * Fetches real match results from public online sources and updates
 * the database. By default this service is DISABLED (LIVE_RESULTS_ENABLED=false).
 *
 * CONFIDENCE RULES:
 * - HIGH confidence results are ALWAYS auto-applied (final status + strong team match).
 * - MEDIUM / LOW confidence results are queued for admin review.
 * - Manual admin entry always takes precedence and is never overwritten.
 */

import { prisma } from './prisma'

// ─── Types ─────────────────────────────────────────────────────────────────

export type MatchResult = 'G1' | 'E' | 'G2'
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW'

export interface DetectedResult {
  matchNumber: number
  team1Goals: number
  team2Goals: number
  result: MatchResult
  source: string
  confidence: Confidence
  rawData?: string
}

export interface CronRunSummary {
  enabled: boolean
  matchesChecked: number
  resultsDetected: number
  resultsAutoApplied: number
  resultsPendingReview: number
  errors: string[]
  timestamp: string
}

// ─── Team matching helpers ───────────────────────────────────────────────────

interface CandidateMatch {
  id: string
  matchNumber: number
  team1: { displayName: string; fifaCode: string; isoCode: string; shortName: string; aliases: string }
  team2: { displayName: string; fifaCode: string; isoCode: string; shortName: string; aliases: string }
  kickoffUtc: Date
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function teamNames(t: CandidateMatch['team1']): string[] {
  const names = [t.displayName, t.shortName, t.fifaCode, t.isoCode]
  try { names.push(...(JSON.parse(t.aliases) as string[])) } catch {}
  return names.map(norm).filter(Boolean)
}

function matchScore(espnName: string, espnAbbr: string, team: CandidateMatch['team1']): number {
  const n = norm(espnName)
  const a = norm(espnAbbr)
  const names = teamNames(team)
  if (names.includes(a)) return 3
  if (names.includes(n)) return 2
  if (names.some((x) => x.startsWith(a) || a.startsWith(x.slice(0, 3)))) return 1
  return 0
}

interface EspnCompetitor {
  homeAway: string
  score: string
  team: { name: string; abbreviation: string }
}

function resolveMatch(
  competitors: EspnCompetitor[],
  candidates: CandidateMatch[]
): { match: CandidateMatch; g1: number; g2: number; confidence: Confidence } | null {
  if (competitors.length !== 2) return null

  const [compA, compB] = competitors
  const nameA = compA.team?.name ?? ''
  const abbrA = compA.team?.abbreviation ?? ''
  const nameB = compB.team?.name ?? ''
  const abbrB = compB.team?.abbreviation ?? ''

  for (const cand of candidates) {
    const s1 = matchScore(nameA, abbrA, cand.team1) + matchScore(nameB, abbrB, cand.team2)
    const s2 = matchScore(nameA, abbrA, cand.team2) + matchScore(nameB, abbrB, cand.team1)

    const best = Math.max(s1, s2)
    if (best < 2) continue

    const swapped = s2 > s1
    const g_a = parseInt(compA.score ?? '0', 10)
    const g_b = parseInt(compB.score ?? '0', 10)
    const g1 = swapped ? g_b : g_a
    const g2 = swapped ? g_a : g_b
    const confidence: Confidence = best >= 4 ? 'HIGH' : 'MEDIUM'

    return { match: cand, g1, g2, confidence }
  }
  return null
}

// ─── Source adapters ────────────────────────────────────────────────────────

function toVetDateStr(d: Date): string {
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
}

async function fetchFromEspn(candidates: CandidateMatch[]): Promise<DetectedResult[]> {
  const results: DetectedResult[] = []
  const now = new Date()

  const dates = [
    toVetDateStr(now),
    toVetDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
  ]

  for (const date of dates) {
    const dateStr = date.replace(/-/g, '')
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dateStr}`

    let data: Record<string, unknown>
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(12_000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      })
      if (!res.ok) continue
      data = await res.json() as Record<string, unknown>
    } catch {
      continue
    }

    const events = (data.events as unknown[]) ?? []

    for (const rawEvent of events) {
      const event = rawEvent as Record<string, unknown>
      const comp = ((event.competitions as unknown[])?.[0] ?? {}) as Record<string, unknown>
      const status = (comp.status as Record<string, unknown>)?.type as Record<string, unknown> | undefined

      const isCompleted = status?.completed === true
      const isPostState = (status?.state as string | undefined) === 'post'
      if (!isCompleted || !isPostState) continue

      const competitors = (comp.competitors as EspnCompetitor[]) ?? []
      const resolved = resolveMatch(competitors, candidates)
      if (!resolved) continue

      if (results.some((r) => r.matchNumber === resolved.match.matchNumber)) continue

      const { g1, g2, confidence } = resolved
      const result: MatchResult = g1 > g2 ? 'G1' : g1 < g2 ? 'G2' : 'E'

      results.push({
        matchNumber: resolved.match.matchNumber,
        team1Goals: g1,
        team2Goals: g2,
        result,
        source: 'espn',
        confidence,
        rawData: JSON.stringify({
          competitors: competitors.map((c) => ({
            team: c.team?.abbreviation,
            score: c.score,
            homeAway: c.homeAway,
          })),
          statusName: status?.name,
        }),
      })
    }
  }

  return results
}

async function fetchFromApiFootball(candidates: CandidateMatch[]): Promise<DetectedResult[]> {
  const apiKey = process.env.LIVE_RESULTS_API_KEY
  if (!apiKey) return []

  try {
    const today = toVetDateStr(new Date())
    const url = `https://v3.football.api-sports.io/fixtures?league=1&season=2026&date=${today}&status=FT`
    const res = await fetch(url, {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return []
    const data = await res.json() as { response?: unknown[] }
    const fixtures = data.response ?? []
    const results: DetectedResult[] = []

    for (const rawF of fixtures) {
      const f = rawF as Record<string, unknown>
      const teams = f.teams as Record<string, unknown>
      const goals = f.goals as Record<string, unknown>
      const home = (teams?.home as Record<string, unknown>) ?? {}
      const away = (teams?.away as Record<string, unknown>) ?? {}
      const nameH = (home.name as string) ?? ''
      const nameA = (away.name as string) ?? ''
      const g1 = (goals?.home as number) ?? 0
      const g2 = (goals?.away as number) ?? 0

      const resolved = resolveMatch(
        [
          { homeAway: 'home', score: String(g1), team: { name: nameH, abbreviation: nameH.slice(0, 3).toUpperCase() } },
          { homeAway: 'away', score: String(g2), team: { name: nameA, abbreviation: nameA.slice(0, 3).toUpperCase() } },
        ],
        candidates
      )
      if (!resolved || results.some((r) => r.matchNumber === resolved.match.matchNumber)) continue

      const result: MatchResult = resolved.g1 > resolved.g2 ? 'G1' : resolved.g1 < resolved.g2 ? 'G2' : 'E'
      results.push({
        matchNumber: resolved.match.matchNumber,
        team1Goals: resolved.g1,
        team2Goals: resolved.g2,
        result,
        source: 'api-football',
        confidence: 'HIGH',
        rawData: JSON.stringify({ nameH, nameA, g1, g2 }),
      })
    }
    return results
  } catch {
    return []
  }
}

// ─── Aggregation & Confidence ───────────────────────────────────────────────

function aggregateResults(allResults: DetectedResult[]): DetectedResult[] {
  const byMatch = new Map<number, DetectedResult[]>()
  for (const r of allResults) {
    if (!byMatch.has(r.matchNumber)) byMatch.set(r.matchNumber, [])
    byMatch.get(r.matchNumber)!.push(r)
  }

  const aggregated: DetectedResult[] = []
  for (const [matchNumber, results] of byMatch.entries()) {
    if (results.length === 0) continue

    const firstScore = `${results[0].team1Goals}-${results[0].team2Goals}`
    const allAgree = results.every(
      (r) => `${r.team1Goals}-${r.team2Goals}` === firstScore
    )

    // A single-source result keeps its original confidence if it was HIGH.
    // Only downgrade to MEDIUM if the individual source itself was uncertain.
    const confidence: Confidence =
      allAgree && results.length >= 2               ? 'HIGH'
      : results.length === 1 && results[0].confidence === 'HIGH' ? 'HIGH'
      : results.length === 1                        ? 'MEDIUM'
      : 'LOW'

    aggregated.push({
      matchNumber,
      team1Goals: results[0].team1Goals,
      team2Goals: results[0].team2Goals,
      result: results[0].result,
      source: results.map((r) => r.source).join('+'),
      confidence,
      rawData: JSON.stringify(results),
    })
  }
  return aggregated
}

// ─── Ranking position helpers ───────────────────────────────────────────────

type SnapshotWithParticipant = {
  participantId: string
  totalPoints: number
  exactScores: number
  correctResults: number
  totalGoalDiffError: number
  currentPosition: number
  participant: { createdAt: Date; id: string }
}

function sortedByRanking(snapshots: SnapshotWithParticipant[]): SnapshotWithParticipant[] {
  return [...snapshots].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    if (b.correctResults !== a.correctResults) return b.correctResults - a.correctResults
    if (a.totalGoalDiffError !== b.totalGoalDiffError) return a.totalGoalDiffError - b.totalGoalDiffError
    if (a.participant.createdAt.getTime() !== b.participant.createdAt.getTime()) return a.participant.createdAt.getTime() - b.participant.createdAt.getTime()
    return a.participant.id < b.participant.id ? -1 : 1
  })
}

/**
 * Saves the current computed positions as previousPosition (snapshot before a result is applied).
 * Also sets currentPosition to match so both are in sync before the update.
 */
async function saveCurrentPositionsAsPrevious(): Promise<void> {
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { createdAt: true, id: true } } },
  })
  if (all.length === 0) return

  const sorted = sortedByRanking(all as SnapshotWithParticipant[])
  for (let i = 0; i < sorted.length; i++) {
    const pos = i + 1
    await prisma.rankingSnapshot.update({
      where: { participantId: sorted[i].participantId },
      data: { previousPosition: pos, currentPosition: pos },
    })
  }
}

/**
 * Recomputes positions from current stats and saves as currentPosition.
 * Called after stats have been recalculated for the affected participants.
 */
async function updateCurrentPositions(): Promise<void> {
  const all = await prisma.rankingSnapshot.findMany({
    include: { participant: { select: { createdAt: true, id: true } } },
  })
  if (all.length === 0) return

  const sorted = sortedByRanking(all as SnapshotWithParticipant[])
  for (let i = 0; i < sorted.length; i++) {
    await prisma.rankingSnapshot.update({
      where: { participantId: sorted[i].participantId },
      data: { currentPosition: i + 1 },
    })
  }
}

// ─── Database helpers ───────────────────────────────────────────────────────

async function applyResultToDb(
  matchId: string,
  team1Goals: number,
  team2Goals: number,
  source: string
) {
  const result: MatchResult =
    team1Goals > team2Goals ? 'G1' : team1Goals < team2Goals ? 'G2' : 'E'

  // 1. Capture current positions as "previous" before anything changes
  await saveCurrentPositionsAsPrevious()

  // 2. Update the match
  await prisma.match.update({
    where: { id: matchId },
    data: {
      team1Goals,
      team2Goals,
      result,
      status: 'FINISHED',
      resultUpdatedAt: new Date(),
      resultSource: source,
      autoResultStatus: 'CONFIRMED',
    },
  })

  // 3. Recalculate predictions for this match
  const predictions = await prisma.prediction.findMany({ where: { matchId } })
  for (const pred of predictions) {
    const isExactScore =
      pred.predictedTeam1Goals === team1Goals &&
      pred.predictedTeam2Goals === team2Goals
    const isCorrectResult = pred.predictedResult === result
    const goalDifferenceError =
      Math.abs(pred.predictedTeam1Goals - team1Goals) +
      Math.abs(pred.predictedTeam2Goals - team2Goals)
    const points = isExactScore ? 3 : isCorrectResult ? 1 : 0

    await prisma.prediction.update({
      where: { id: pred.id },
      data: { isExactScore, isCorrectResult, goalDifferenceError, points },
    })
  }

  // 4. Recalculate ranking stats for each affected participant
  const participantIds = [...new Set(predictions.map((p) => p.participantId))]
  for (const participantId of participantIds) {
    await recalculateParticipantRanking(participantId)
  }

  // 5. Update current positions (movement = previousPosition - currentPosition)
  await updateCurrentPositions()
}

async function recalculateParticipantRanking(participantId: string) {
  const predictions = await prisma.prediction.findMany({
    where: { participantId },
    include: { match: true },
  })

  const played = predictions.filter((p) => p.match.status === 'FINISHED')
  const exactScores = played.filter((p) => p.isExactScore === true).length
  const correctResults = played.filter(
    (p) => p.isCorrectResult === true && !p.isExactScore
  ).length
  const wrongPredictions = played.filter((p) => !p.isCorrectResult).length
  const pending = predictions.filter((p) => p.match.status !== 'FINISHED').length
  const totalPoints = played.reduce((sum, p) => sum + p.points, 0)
  const totalGoalDiffError = played.reduce(
    (sum, p) => sum + (p.goalDifferenceError ?? 0),
    0
  )
  const effectiveness =
    played.length > 0
      ? ((exactScores + correctResults) / played.length) * 100
      : 0

  await prisma.rankingSnapshot.upsert({
    where: { participantId },
    update: {
      totalPoints,
      exactScores,
      correctResults,
      wrongPredictions,
      pendingPredictions: pending,
      playedMatches: played.length,
      totalGoalDiffError,
      effectivenessPercent: effectiveness,
    },
    create: {
      participantId,
      totalPoints,
      exactScores,
      correctResults,
      wrongPredictions,
      pendingPredictions: pending,
      playedMatches: played.length,
      totalGoalDiffError,
      effectivenessPercent: effectiveness,
      currentPosition: 0,
    },
  })
}

// ─── Main exported function ─────────────────────────────────────────────────

export async function runLiveResultsUpdate(): Promise<CronRunSummary> {
  const liveEnabled = ['true', '1', 'yes', 'on'].includes(
    String(process.env.LIVE_RESULTS_ENABLED ?? '').toLowerCase().trim()
  )
  const summary: CronRunSummary = {
    enabled: liveEnabled,
    matchesChecked: 0,
    resultsDetected: 0,
    resultsAutoApplied: 0,
    resultsPendingReview: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  }

  if (!summary.enabled) {
    await prisma.liveResultsLog.create({
      data: { type: 'CRON_RUN', message: 'Live results disabled (LIVE_RESULTS_ENABLED=false)' },
    })
    return summary
  }

  await prisma.liveResultsLog.create({
    data: { type: 'CRON_RUN', message: 'Cron run started' },
  })

  try {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const minFinishTime = new Date(now.getTime() - 115 * 60 * 1000)

    const candidateMatches = await prisma.match.findMany({
      where: {
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        kickoffUtc: { gte: oneDayAgo, lte: minFinishTime },
      },
      include: { team1: true, team2: true },
    })

    summary.matchesChecked = candidateMatches.length

    if (candidateMatches.length === 0) {
      await prisma.liveResultsLog.create({
        data: { type: 'CRON_RUN', message: 'No pending matches to check' },
      })
      return summary
    }

    const candidates = candidateMatches as unknown as CandidateMatch[]

    const [espnResults, apiFootballResults] = await Promise.allSettled([
      fetchFromEspn(candidates),
      fetchFromApiFootball(candidates),
    ])

    const allDetected: DetectedResult[] = [
      ...(espnResults.status === 'fulfilled' ? espnResults.value : []),
      ...(apiFootballResults.status === 'fulfilled' ? apiFootballResults.value : []),
    ]

    if (espnResults.status === 'rejected') {
      summary.errors.push(`ESPN: ${espnResults.reason}`)
    }

    const aggregated = aggregateResults(allDetected)
    summary.resultsDetected = aggregated.length

    for (const detected of aggregated) {
      const match = candidateMatches.find((m) => m.matchNumber === detected.matchNumber)
      if (!match) continue

      // Skip if a manual result is already confirmed for this match
      if (match.status === 'FINISHED' && match.result !== null) {
        const detectedResult: MatchResult =
          detected.team1Goals > detected.team2Goals ? 'G1'
          : detected.team1Goals < detected.team2Goals ? 'G2' : 'E'

        if (detectedResult !== match.result ||
            detected.team1Goals !== match.team1Goals ||
            detected.team2Goals !== match.team2Goals) {
          await prisma.liveResultsLog.create({
            data: {
              type: 'RESULT_DETECTED',
              message: `CONFLICTO: Partido #${match.matchNumber} ya tiene resultado ${match.team1Goals}-${match.team2Goals} pero se detectó ${detected.team1Goals}-${detected.team2Goals}`,
              matchId: match.id,
              source: detected.source,
              confidence: detected.confidence,
              detectedGoals1: detected.team1Goals,
              detectedGoals2: detected.team2Goals,
            },
          })
        }
        continue
      }

      await prisma.liveResultsLog.create({
        data: {
          type: 'RESULT_DETECTED',
          message: `Partido #${detected.matchNumber}: ${detected.team1Goals}-${detected.team2Goals} (${detected.confidence})`,
          matchId: match.id,
          source: detected.source,
          confidence: detected.confidence,
          detectedGoals1: detected.team1Goals,
          detectedGoals2: detected.team2Goals,
          rawData: detected.rawData,
        },
      })

      if (detected.confidence === 'HIGH') {
        // HIGH confidence final results are ALWAYS auto-applied
        try {
          await applyResultToDb(
            match.id,
            detected.team1Goals,
            detected.team2Goals,
            detected.source
          )
          summary.resultsAutoApplied++

          await prisma.liveResultsLog.create({
            data: {
              type: 'RESULT_CONFIRMED',
              message: `AUTO_RESULT_APPLIED: Partido #${detected.matchNumber} ${detected.team1Goals}-${detected.team2Goals}. Ranking recalculado.`,
              matchId: match.id,
              source: detected.source,
              confidence: detected.confidence,
              detectedGoals1: detected.team1Goals,
              detectedGoals2: detected.team2Goals,
              adminAction: 'AUTO_CONFIRMED',
            },
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido'
          summary.errors.push(`Partido #${detected.matchNumber}: ${msg}`)
          await prisma.liveResultsLog.create({
            data: {
              type: 'ERROR',
              message: `Error al auto-aplicar partido #${detected.matchNumber}: ${msg}`,
              matchId: match.id,
            },
          })
        }
      } else {
        // MEDIUM / LOW → queue for admin review
        await prisma.match.update({
          where: { id: match.id },
          data: {
            autoDetectedTeam1Goals: detected.team1Goals,
            autoDetectedTeam2Goals: detected.team2Goals,
            autoDetectedResult: detected.result,
            autoDetectedSource: detected.source,
            autoDetectionConfidence: detected.confidence,
            autoDetectedAt: new Date(),
            autoResultStatus: 'PENDING_REVIEW',
          },
        })
        summary.resultsPendingReview++

        await prisma.liveResultsLog.create({
          data: {
            type: 'RESULT_DETECTED',
            message: `AUTO_RESULT_PENDING: Partido #${detected.matchNumber} requiere revisión (confianza ${detected.confidence})`,
            matchId: match.id,
            source: detected.source,
            confidence: detected.confidence,
            detectedGoals1: detected.team1Goals,
            detectedGoals2: detected.team2Goals,
          },
        })
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    summary.errors.push(msg)
    await prisma.liveResultsLog.create({
      data: { type: 'ERROR', message: msg },
    })
  }

  await prisma.liveResultsLog.create({
    data: {
      type: 'CRON_RUN',
      message: `Cron completado: ${summary.resultsDetected} detectados, ${summary.resultsAutoApplied} aplicados automáticamente, ${summary.resultsPendingReview} pendientes de revisión`,
    },
  })

  return summary
}

export async function confirmAutoResult(matchId: string): Promise<void> {
  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match) throw new Error('Partido no encontrado')
  if (match.autoDetectedTeam1Goals === null || match.autoDetectedTeam2Goals === null) {
    throw new Error('No hay resultado automático pendiente para este partido')
  }

  await applyResultToDb(
    matchId,
    match.autoDetectedTeam1Goals,
    match.autoDetectedTeam2Goals,
    match.autoDetectedSource ?? 'auto'
  )

  await prisma.liveResultsLog.create({
    data: {
      type: 'RESULT_CONFIRMED',
      message: `Admin confirmó resultado: ${match.autoDetectedTeam1Goals}-${match.autoDetectedTeam2Goals}`,
      matchId,
      adminAction: 'CONFIRMED',
    },
  })
}

export async function rejectAutoResult(matchId: string): Promise<void> {
  await prisma.match.update({
    where: { id: matchId },
    data: { autoResultStatus: 'REJECTED' },
  })

  await prisma.liveResultsLog.create({
    data: {
      type: 'RESULT_REJECTED',
      message: 'Admin rechazó resultado automático',
      matchId,
      adminAction: 'REJECTED',
    },
  })
}

export { applyResultToDb, recalculateParticipantRanking }
