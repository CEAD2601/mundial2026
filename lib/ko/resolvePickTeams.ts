import { KNOCKOUT_MATCHES, type KOMatch } from '@/lib/prototype/knockout-data'

type PickRow  = { matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null }
type ResultRow = { id: string; homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null }
type TeamSlot  = KOMatch['home']
type TeamId    = { code: string | null; name: string | null }

const MATCH_BY_FIFA = new Map(KNOCKOUT_MATCHES.map(m => [m.fifaMatchNumber, m]))

function resolveParticipantExpectedTeam(
  team: TeamSlot,
  pickMap: Map<string, PickRow>,
  depth = 0,
): TeamId | null {
  if (depth > 8) return null
  if (team.name || team.code) return { code: team.code ?? null, name: team.name ?? null }
  const m = team.placeholder?.match(/^(Gan|Perd)\.\s*#(\d+)$/)
  if (!m) return null
  const isWinner = m[1] === 'Gan'
  const srcMatch = MATCH_BY_FIFA.get(Number(m[2]))
  if (!srcMatch) return null
  const pick = pickMap.get(srcMatch.id)
  if (!pick) return null
  const homeWins =
    pick.homeGoals > pick.awayGoals ||
    (pick.homeGoals === pick.awayGoals && pick.penaltyWinner === 'home')
  const resolved = isWinner
    ? (homeWins ? srcMatch.home : srcMatch.away)
    : (homeWins ? srcMatch.away : srcMatch.home)
  return resolveParticipantExpectedTeam(resolved, pickMap, depth + 1)
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
 * For R32 (teams already known) always returns true.
 * pickMap: all picks for this participant, keyed by matchId.
 * resultMap: all finished KOMatchResult rows, keyed by match id.
 */
export function checkTeamsMatch(
  koMatch: KOMatch,
  pickMap: Map<string, PickRow>,
  resultMap: Map<string, ResultRow>,
): boolean {
  if (koMatch.stage === 'R32') return true
  if (!koMatch.home.placeholder && !koMatch.away.placeholder) return true // both teams directly known
  const realHome = resolveRealTeam(koMatch.home, resultMap)
  const realAway = resolveRealTeam(koMatch.away, resultMap)
  if (!realHome?.code || !realAway?.code) return true // can't resolve real teams — be lenient
  const pickHome = resolveParticipantExpectedTeam(koMatch.home, pickMap)
  const pickAway = resolveParticipantExpectedTeam(koMatch.away, pickMap)
  return pickHome?.code === realHome.code && pickAway?.code === realAway.code
}
