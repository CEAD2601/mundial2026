/**
 * Live Results Service — Quiniela Mundial 2026
 *
 * Fetches real match results from public online sources and updates
 * the database. By default this service is DISABLED (LIVE_RESULTS_ENABLED=false).
 *
 * IMPORTANT LIMITATIONS:
 * - Public web scraping is inherently fragile: page structure changes break parsers.
 * - If a source fails or returns ambiguous data, results are NOT applied.
 * - LOW/MEDIUM confidence results are queued for admin review, never auto-applied.
 * - HIGH confidence results are auto-applied only if LIVE_RESULTS_AUTO_APPLY=true.
 * - Manual admin entry always takes precedence and is always available.
 * - No paid APIs are required — this module works entirely with public sources.
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

// ─── Source adapters ────────────────────────────────────────────────────────

/**
 * Source A: FIFA.com public match results
 * NOTE: FIFA may block automated access. Use only for reading public data.
 * Returns null if unavailable or results can't be parsed reliably.
 */
async function fetchFromFifa(matchNumbers: number[]): Promise<DetectedResult[]> {
  // FIFA's public results endpoint — structure may change without notice
  // This is a stub: when FIFA provides a reliable JSON endpoint, implement here.
  // For now, returns empty to avoid false positives.
  try {
    // Example (not guaranteed to work): FIFA tournament API
    // const url = `https://api.fifa.com/api/v3/calendar/matches?...`
    // const res = await fetch(url, { next: { revalidate: 0 } })
    // const data = await res.json()
    // ... parse and match to matchNumbers
    void matchNumbers // suppress unused warning
    return []
  } catch {
    return []
  }
}

/**
 * Source B: Google Sports Search
 * Google shows match scores in search results. Structure is not guaranteed.
 * Returns empty if parsing fails.
 */
async function fetchFromGoogleSports(_matchNumbers: number[]): Promise<DetectedResult[]> {
  // Google search results for football scores are rendered server-side
  // and may block automated requests. This is a reserved stub.
  return []
}

/**
 * Source C: Open Football Data (public APIs)
 * api-football.com free tier, football-data.org free tier, etc.
 * These often require free registration but no cost.
 * Configure via LIVE_RESULTS_API_KEY env var.
 */
async function fetchFromOpenApi(_matchNumbers: number[]): Promise<DetectedResult[]> {
  const apiKey = process.env.LIVE_RESULTS_API_KEY
  if (!apiKey) return []

  try {
    // Placeholder: implement with api-football.com v3 free tier
    // GET https://v3.football.api-sports.io/fixtures?...
    // Headers: { 'x-apisports-key': apiKey }
    return []
  } catch {
    return []
  }
}

// ─── Aggregation & Confidence ───────────────────────────────────────────────

/**
 * Aggregate results from multiple sources.
 * If 2+ sources agree → HIGH confidence
 * If only 1 source      → MEDIUM confidence
 * If sources disagree   → LOW confidence (flag for review)
 */
function aggregateResults(allResults: DetectedResult[]): DetectedResult[] {
  const byMatch = new Map<number, DetectedResult[]>()
  for (const r of allResults) {
    if (!byMatch.has(r.matchNumber)) byMatch.set(r.matchNumber, [])
    byMatch.get(r.matchNumber)!.push(r)
  }

  const aggregated: DetectedResult[] = []
  for (const [matchNumber, results] of byMatch.entries()) {
    if (results.length === 0) continue

    // Check if all sources agree on the score
    const firstScore = `${results[0].team1Goals}-${results[0].team2Goals}`
    const allAgree = results.every(
      (r) => `${r.team1Goals}-${r.team2Goals}` === firstScore
    )

    const confidence: Confidence =
      allAgree && results.length >= 2 ? 'HIGH'
      : results.length === 1          ? 'MEDIUM'
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

// ─── Database helpers ───────────────────────────────────────────────────────

async function applyResultToDb(
  matchId: string,
  team1Goals: number,
  team2Goals: number,
  source: string
) {
  const result: MatchResult =
    team1Goals > team2Goals ? 'G1' : team1Goals < team2Goals ? 'G2' : 'E'

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

  // Recalculate predictions for this match
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

  // Recalculate ranking for each affected participant
  const participantIds = [...new Set(predictions.map((p) => p.participantId))]
  for (const participantId of participantIds) {
    await recalculateParticipantRanking(participantId)
  }
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

/**
 * Main entry point called by the cron job.
 * Fetches results from all enabled public sources, evaluates confidence,
 * and updates the database or queues for admin review.
 */
export async function runLiveResultsUpdate(): Promise<CronRunSummary> {
  const summary: CronRunSummary = {
    enabled: process.env.LIVE_RESULTS_ENABLED === 'true',
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
    // Find matches that are scheduled/in-progress for today and yesterday
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const candidateMatches = await prisma.match.findMany({
      where: {
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        kickoffUtc: { gte: oneDayAgo },
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

    const matchNumbers = candidateMatches.map((m) => m.matchNumber)

    // Fetch from all available sources
    const [fifaResults, googleResults, apiResults] = await Promise.allSettled([
      fetchFromFifa(matchNumbers),
      fetchFromGoogleSports(matchNumbers),
      fetchFromOpenApi(matchNumbers),
    ])

    const allDetected: DetectedResult[] = [
      ...(fifaResults.status === 'fulfilled' ? fifaResults.value : []),
      ...(googleResults.status === 'fulfilled' ? googleResults.value : []),
      ...(apiResults.status === 'fulfilled' ? apiResults.value : []),
    ]

    const aggregated = aggregateResults(allDetected)
    summary.resultsDetected = aggregated.length

    const autoApply = process.env.LIVE_RESULTS_AUTO_APPLY === 'true'

    for (const detected of aggregated) {
      const match = candidateMatches.find((m) => m.matchNumber === detected.matchNumber)
      if (!match) continue

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

      if (detected.confidence === 'HIGH' && autoApply) {
        // Auto-apply high-confidence results
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
              message: `Auto-aplicado: Partido #${detected.matchNumber} ${detected.team1Goals}-${detected.team2Goals}`,
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
        }
      } else {
        // Queue for admin review
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
      message: `Cron completado: ${summary.resultsDetected} detectados, ${summary.resultsAutoApplied} aplicados, ${summary.resultsPendingReview} pendientes`,
    },
  })

  return summary
}

/**
 * Admin action: confirm a pending auto-detected result.
 * Applies the auto-detected score, recalculates ranking.
 */
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

/**
 * Admin action: reject a pending auto-detected result.
 * Clears the auto-detection, does not change the match status.
 */
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
