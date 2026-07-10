import { KNOCKOUT_MATCHES, type KOMatch } from '@/lib/prototype/knockout-data'

type PickRow   = { matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null }
type ResultRow = { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }
type TeamSlot  = KOMatch['home']
type TeamId    = { code: string | null; name: string | null }

const MATCH_BY_FIFA = new Map(KNOCKOUT_MATCHES.map(m => [m.fifaMatchNumber, m]))

// Mirrors the logic in /api/ko/match-picks/[matchId]/route.ts → resolveParticipantTeam.
// Uses participant picks first; falls back to official results for matches the participant
// didn't fill (e.g. late registrants who skipped R32).
function resolveParticipantExpectedTeam(
  team: TeamSlot,
  pickMap: Map<string, PickRow>,
  resultMap: Map<string, ResultRow>,
  depth = 0,
): TeamId | null {
  if (depth > 8) return null
  if (team.name || team.code) return { code: team.code ?? null, name: team.name ?? null }
  const m = team.placeholder?.match(/^(Gan|Perd)\.\s*#(\d+)$/)
  if (!m) return null
  const isWinner = m[1] === 'Gan'
  const srcMatch = MATCH_BY_FIFA.get(Number(m[2]))
  if (!srcMatch) return null
  // Prefer participant's own pick; fall back to official result (for late registrants)
  const row = pickMap.get(srcMatch.id) ?? (() => {
    const r = resultMap.get(srcMatch.id)
    return r && r.homeGoals != null && r.awayGoals != null
      ? { matchId: srcMatch.id, homeGoals: r.homeGoals!, awayGoals: r.awayGoals!, penaltyWinner: r.penaltyWinner }
      : undefined
  })()
  if (!row) return null
  const homeWins =
    row.homeGoals > row.awayGoals ||
    (row.homeGoals === row.awayGoals && row.penaltyWinner === 'home')
  const resolved = isWinner
    ? (homeWins ? srcMatch.home : srcMatch.away)
    : (homeWins ? srcMatch.away : srcMatch.home)
  return resolveParticipantExpectedTeam(resolved, pickMap, resultMap, depth + 1)
}

function resolveRealTeam(
  team: TeamSlot,
  resultMap: Map<string, ResultRow>,
  depth = 0,
): TeamId | null {
  if (depth > 8) return null
  if (team.name || team.code) return { code: team.code ?? null, name: team.name ?? null }
  const m = team.placeholder?.match(/^(Gan|Perd)\.\s*#(\d+)$/)
  if (!m) return null
  const isWinner = m[1] === 'Gan'
  const srcMatch = MATCH_BY_FIFA.get(Number(m[2]))
  if (!srcMatch) return null
  const result = resultMap.get(srcMatch.id)
  if (!result || result.homeGoals == null || result.awayGoals == null) return null
  const homeWins =
    result.homeGoals > result.awayGoals ||
    (result.homeGoals === result.awayGoals && result.penaltyWinner === 'home')
  const resolved = isWinner
    ? (homeWins ? srcMatch.home : srcMatch.away)
    : (homeWins ? srcMatch.away : srcMatch.home)
  return resolveRealTeam(resolved, resultMap, depth + 1)
}

/**
 * Returns true if the participant's expected teams for a KO match match the real teams.
 * pickMap: all picks for this participant, keyed by matchId.
 * resultMap: all finished KOMatchResult rows, keyed by match id.
 */
export function checkTeamsMatch(
  koMatch: KOMatch,
  pickMap: Map<string, PickRow>,
  resultMap: Map<string, ResultRow>,
): boolean {
  if (koMatch.stage === 'R32') return true
  const realHome = resolveRealTeam(koMatch.home, resultMap)
  const realAway = resolveRealTeam(koMatch.away, resultMap)
  if (!realHome?.code || !realAway?.code) return true // can't resolve real teams — be lenient
  const pickHome = resolveParticipantExpectedTeam(koMatch.home, pickMap, resultMap)
  const pickAway = resolveParticipantExpectedTeam(koMatch.away, pickMap, resultMap)
  // If participant's expected teams can't be resolved, fall back to lenient (no penalty)
  if (!pickHome?.code || !pickAway?.code) return true
  return pickHome.code === realHome.code && pickAway.code === realAway.code
}
