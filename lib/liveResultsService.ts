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
  // partial: does espn abbreviation appear in any team name token?
  if (names.some((x) => x.startsWith(a) || a.startsWith(x.slice(0, 3)))) return 1
  return 0
}

interface EspnCompetitor {
  homeAway: string
  score: string
  team: { name: string; abbreviation: string }
}

/**
 * Match ESPN event competitors to our candidate matches.
 * Returns the candidate match and which competitor is team1/team2,
 * or null if confidence is too low.
 */
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
    // Try compA=team1, compB=team2
    const s1 = matchScore(nameA, abbrA, cand.team1) + matchScore(nameB, abbrB, cand.team2)
    // Try compA=team2, compB=team1 (swapped)
    const s2 = matchScore(nameA, abbrA, cand.team2) + matchScore(nameB, abbrB, cand.team1)

    const best = Math.max(s1, s2)
    if (best < 2) continue // need at least one strong match

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

/**
 * Source A: ESPN public scoreboard API (no auth required)
 * Endpoint: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=YYYYMMDD
 */
async function fetchFromEspn(candidates: CandidateMatch[]): Promise<DetectedResult[]> {
  const results: DetectedResult[] = []
  const now = new Date()

  // Check today and yesterday in VET timezone
  const dates = [
    toVetDateStr(now),
    toVetDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
  ]

  for (const date of dates) {
    const dateStr = date.replace(/-/g, '') // YYYYMMDD
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
      if (!status?.completed) continue // only finished

      const competitors = (comp.competitors as EspnCompetitor[]) ?? []
      const resolved = resolveMatch(competitors, candidates)
      if (!resolved) continue

      // Avoid duplicates (same matchNumber from two date pages)
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
          statusName: status.name,
        }),
      })
    }
  }

  return results
}

/**
 * Source B: api-football.com (free tier — requires LIVE_RESULTS_API_KEY)
 * Falls back to empty if no API key configured.
 */
async function fetchFromApiFootball(candidates: CandidateMatch[]): Promise<DetectedResult[]> {
  const apiKey = process.env.LIVE_RESULTS_API_KEY
  if (!apiKey) return []

  try {
    // World Cup 2026 league ID in api-football = 1 (FIFA World Cup)
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

    // Cast to CandidateMatch (DB result has same shape after include)
    const candidates = candidateMatches as unknown as CandidateMatch[]

    // Fetch from all available sources (ESPN always; api-football if API key present)
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
