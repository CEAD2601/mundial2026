/**
 * KO Live Results Service — Quiniela Mundial 2026
 *
 * Detecta resultados de partidos KO desde ESPN y los aplica automáticamente.
 * Llamado por el cron existente (/api/cron/update-live-results).
 *
 * Mismo patrón que liveResultsService.ts pero usa tablas KO:
 *   KOMatchResult  /  KOPick  /  KORankingSnapshot
 */

import { prisma } from './prisma'
import { KNOCKOUT_MATCHES, type KOMatch } from './prototype/knockout-data'
import { calcKOPoints } from './ko/utils'
import { checkTeamsMatch } from './ko/resolvePickTeams'

// ─── Helpers ────────────────────────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
}

function teamNames(team: KOMatch['home']): string[] {
  const names: string[] = []
  if (team.name)        names.push(team.name)
  if (team.code)        names.push(team.code)
  if (team.placeholder) names.push(team.placeholder)
  return [...new Set(names.map(norm))].filter(Boolean)
}

function teamMatchScore(espnName: string, espnAbbr: string, team: KOMatch['home']): number {
  const n = norm(espnName)
  const a = norm(espnAbbr)
  const names = teamNames(team)
  if (names.includes(a))                                              return 3
  if (names.includes(n))                                              return 2
  if (names.some(x => x.startsWith(a) || a.startsWith(x.slice(0,3)))) return 1
  return 0
}

function toVetDateStr(d: Date): string {
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
}

// ─── ESPN Fetch ──────────────────────────────────────────────────────────────

interface DetectedKOResult {
  matchId:       string
  homeGoals:     number
  awayGoals:     number
  penaltyWinner: 'home' | 'away' | null
  confidence:    'HIGH' | 'MEDIUM'
  source:        string
}

async function fetchKOFromEspn(candidates: KOMatch[]): Promise<DetectedKOResult[]> {
  const results: DetectedKOResult[] = []
  const now = new Date()
  const dates = [
    toVetDateStr(now),
    toVetDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
  ]

  for (const dateStr of dates) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dateStr.replace(/-/g, '')}`
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
      const event    = rawEvent as Record<string, unknown>
      const comp     = ((event.competitions as unknown[])?.[0] ?? {}) as Record<string, unknown>
      const status   = (comp.status as Record<string, unknown>)?.type as Record<string, unknown> | undefined
      if (status?.completed !== true || (status?.state as string) !== 'post') continue

      const competitors = (comp.competitors as Array<Record<string, unknown>>) ?? []
      if (competitors.length !== 2) continue

      const [cA, cB] = competitors
      const nameA  = ((cA.team as Record<string, unknown>)?.name         as string) ?? ''
      const abbrA  = ((cA.team as Record<string, unknown>)?.abbreviation as string) ?? ''
      const nameB  = ((cB.team as Record<string, unknown>)?.name         as string) ?? ''
      const abbrB  = ((cB.team as Record<string, unknown>)?.abbreviation as string) ?? ''
      const scoreA = parseInt(cA.score as string ?? '0', 10)
      const scoreB = parseInt(cB.score as string ?? '0', 10)
      // ESPN sets winner:true on the competitor that won (including via penalties)
      const winnerA = cA.winner === true
      const winnerB = cB.winner === true

      for (const cand of candidates) {
        if (results.some(r => r.matchId === cand.id)) continue

        const s1 = teamMatchScore(nameA, abbrA, cand.home) + teamMatchScore(nameB, abbrB, cand.away)
        const s2 = teamMatchScore(nameA, abbrA, cand.away) + teamMatchScore(nameB, abbrB, cand.home)
        const best = Math.max(s1, s2)
        if (best < 2) continue

        const swapped   = s2 > s1
        const homeGoals = swapped ? scoreB : scoreA
        const awayGoals = swapped ? scoreA : scoreB
        const homeWins  = swapped ? winnerB : winnerA
        const awayWins  = swapped ? winnerA : winnerB

        // Penalty winner: only when tied in regular/extra time (goals equal)
        let penaltyWinner: 'home' | 'away' | null = null
        if (homeGoals === awayGoals) {
          penaltyWinner = homeWins ? 'home' : awayWins ? 'away' : null
        }

        results.push({
          matchId: cand.id,
          homeGoals,
          awayGoals,
          penaltyWinner,
          confidence: best >= 4 ? 'HIGH' : 'MEDIUM',
          source: 'espn',
        })
        break
      }
    }
  }
  return results
}

// ─── DB helpers ──────────────────────────────────────────────────────────────

async function applyKOResultToDb(detected: DetectedKOResult): Promise<void> {
  const { matchId, homeGoals, awayGoals, penaltyWinner, source } = detected

  await prisma.kOMatchResult.upsert({
    where:  { id: matchId },
    update: { homeGoals, awayGoals, penaltyWinner, status: 'FINISHED' },
    create: { id: matchId, homeGoals, awayGoals, penaltyWinner, status: 'FINISHED' },
  })

  const picks = await prisma.kOPick.findMany({ where: { matchId } })
  const result = { home: homeGoals, away: awayGoals, penaltyWinner }

  const koMatch = KNOCKOUT_MATCHES.find(m => m.id === matchId)

  // For R16+ matches, load all DB results and all participant picks to check team identity
  let allDbResults: { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }[] = []
  let allParticipantPicks: { matchId: string; participantId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null }[] = []
  if (koMatch && koMatch.stage !== 'R32') {
    allDbResults = await prisma.kOMatchResult.findMany({ where: { homeGoals: { not: null } } })
    const participantIds = [...new Set(picks.map(p => p.participantId))]
    allParticipantPicks = await prisma.kOPick.findMany({ where: { participantId: { in: participantIds } } })
  }
  // Include current result in the map so resolution works for this match's children
  const resultMap = new Map(allDbResults.map(r => [r.id, r]))
  resultMap.set(matchId, { id: matchId, homeGoals, awayGoals, penaltyWinner: penaltyWinner ?? null })

  for (const pick of picks) {
    let teamsMatch: boolean | undefined
    if (koMatch && koMatch.stage !== 'R32') {
      const participantPickMap = new Map(
        allParticipantPicks
          .filter(p => p.participantId === pick.participantId)
          .map(p => [p.matchId, p])
      )
      teamsMatch = checkTeamsMatch(koMatch, participantPickMap, resultMap)
    }
    const { total } = calcKOPoints(
      { home: pick.homeGoals, away: pick.awayGoals, penaltyWinner: pick.penaltyWinner as 'home' | 'away' | null | undefined },
      result,
      { teamsMatch },
    )
    await prisma.kOPick.update({ where: { id: pick.id }, data: { points: total } })
  }

  const participantIds = [...new Set(picks.map(p => p.participantId))]
  for (const participantId of participantIds) {
    await recalcKORanking(participantId)
  }

  await prisma.liveResultsLog.create({
    data: {
      type:    'RESULT_CONFIRMED',
      message: `KO AUTO_RESULT_APPLIED: ${matchId} ${homeGoals}-${awayGoals}${penaltyWinner ? ` (Pen: ${penaltyWinner})` : ''} | ${source}`,
    },
  }).catch(() => {})
}

async function recalcKORanking(participantId: string): Promise<void> {
  const allPicks = await prisma.kOPick.findMany({
    where: { participantId, points: { not: null } },
  })

  const totalPoints       = allPicks.reduce((s, p) => s + (p.points ?? 0), 0)
  const playedMatches     = allPicks.length
  const classifiedCorrect = allPicks.filter(p => (p.points ?? 0) >= 2).length
  const exactScores       = allPicks.filter(p => (p.points ?? 0) >= 4).length
  const penaltyBonus      = allPicks.filter(p => p.points === 3 || p.points === 5).length

  await prisma.kORankingSnapshot.upsert({
    where:  { participantId },
    update: { totalPoints, playedMatches, classifiedCorrect, exactScores, penaltyBonus },
    create: { participantId, totalPoints, playedMatches, classifiedCorrect, exactScores, penaltyBonus, phase: 'R32' },
  })
}

// ─── Placeholder team resolution ─────────────────────────────────────────────

type DBResultRow = { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }

// Map FIFA match number → KOMatch for fast lookup
const MATCH_BY_NUMBER: Map<number, KOMatch> = new Map(
  KNOCKOUT_MATCHES.map(m => [m.fifaMatchNumber, m])
)

function resolveTeamFromResults(
  team: KOMatch['home'],
  resultMap: Map<string, DBResultRow>,
  depth = 0,
): KOMatch['home'] {
  if (depth > 8) return team
  if (team.name || team.code) return team
  const m = team.placeholder?.match(/^(Gan|Perd)\.\s*#(\d+)$/)
  if (!m) return team
  const isWinner = m[1] === 'Gan'
  // Look up by FIFA match number (works for R32, R16, QF, SF, etc.)
  const srcMatch = MATCH_BY_NUMBER.get(Number(m[2]))
  if (!srcMatch) return team
  const result = resultMap.get(srcMatch.id)
  if (!result || result.homeGoals == null || result.awayGoals == null) return team
  const homeWins = result.homeGoals > result.awayGoals ||
    (result.homeGoals === result.awayGoals && result.penaltyWinner === 'home')
  const resolved = isWinner
    ? (homeWins ? srcMatch.home : srcMatch.away)
    : (homeWins ? srcMatch.away : srcMatch.home)
  // Recurse if the resolved team is itself a placeholder
  return resolveTeamFromResults(resolved, resultMap, depth + 1)
}

// ─── Main export ─────────────────────────────────────────────────────────────

export interface KOCronSummary {
  checked: number
  applied: number
  skipped: number
  errors:  string[]
}

export async function runKOLiveResultsUpdate(): Promise<KOCronSummary> {
  const summary: KOCronSummary = { checked: 0, applied: 0, skipped: 0, errors: [] }

  try {
    const now         = new Date()
    const vetToday    = toVetDateStr(now)
    const vetYesterday = toVetDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000))

    // Skip matches already finished in DB
    const finishedResults = await prisma.kOMatchResult.findMany({ where: { status: 'FINISHED' } })
    const finishedIds     = new Set(finishedResults.map(r => r.id))

    // Candidate KO matches: today or yesterday, not yet finished
    // Also include matches that started >90min ago (review window)
    const nowMs = now.getTime()
    const candidates = KNOCKOUT_MATCHES.filter(m => {
      if (finishedIds.has(m.id)) return false
      if (m.date !== vetToday && m.date !== vetYesterday) return false
      // Must have started at least 105 min ago (90 + 15 buffer)
      const [hh, mm] = m.timeVet.split(':').map(Number)
      const kickoffVet = new Date(`${m.date}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00-04:00`)
      return nowMs - kickoffVet.getTime() >= 105 * 60 * 1000
    })

    summary.checked = candidates.length
    if (candidates.length === 0) return summary

    // Resolve placeholder teams (e.g. "Gan. #75") from finished R32 results
    const allDbResults = await prisma.kOMatchResult.findMany({
      where: { homeGoals: { not: null } },
    })
    const resultMap = new Map<string, DBResultRow>(allDbResults.map(r => [r.id, r]))
    const resolvedCandidates = candidates.map(cand => ({
      ...cand,
      home: resolveTeamFromResults(cand.home, resultMap),
      away: resolveTeamFromResults(cand.away, resultMap),
    }))

    const detected = await fetchKOFromEspn(resolvedCandidates)

    for (const result of detected) {
      // Only apply HIGH confidence automatically; skip MEDIUM for now
      if (result.confidence !== 'HIGH') { summary.skipped++; continue }
      try {
        await applyKOResultToDb(result)
        summary.applied++
      } catch (err) {
        summary.errors.push(`${result.matchId}: ${err instanceof Error ? err.message : 'Error'}`)
      }
    }

    summary.skipped += candidates.length - detected.length

  } catch (err) {
    summary.errors.push(err instanceof Error ? err.message : 'Error desconocido')
  }

  return summary
}
