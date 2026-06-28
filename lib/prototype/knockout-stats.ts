/**
 * Estadísticas demo — Prototipo Quiniela Eliminatorias 2026
 * MOCK DATA — no conectado a producción, Prisma ni base real.
 * Solo dos categorías: Goles y Equipos.
 */

// ── Categorías ─────────────────────────────────────────────────────────────────

export type StatCategoryId = 'goals' | 'teams'

export type StatCategory = {
  id: StatCategoryId
  label: string
  emoji: string
  unitShort: string
}

export const STAT_CATEGORIES: StatCategory[] = [
  { id: 'goals', label: 'Goles',   emoji: '⚽', unitShort: 'G'  },
  { id: 'teams', label: 'Equipos', emoji: '🏆', unitShort: 'PTS' },
]

// ── Jugadores ─────────────────────────────────────────────────────────────────

export type StatPlayer = {
  rank: number
  name: string
  country: string
  countryCode: string
  flag: string
  initials: string
  color: string
  photoUrl?: string
  value: number
}

// Photos: randomuser.me CDN provides stable realistic headshots (free, always loads).
// Each player gets a fixed portrait number so the photo is consistent across renders.
// onError chain in the component swaps to ui-avatars.com then to initials div — never empty.
const RP = (n: number) => `https://randomuser.me/api/portraits/men/${n}.jpg`

export const DEMO_GOALS: StatPlayer[] = [
  { rank: 1,  name: 'Lionel Messi',    country: 'Argentina',  countryCode: 'ARG', flag: '🇦🇷', initials: 'LM', color: '#3B82F6', photoUrl: RP(1),  value: 5 },
  { rank: 2,  name: 'Erling Haaland',  country: 'Noruega',    countryCode: 'NOR', flag: '🇳🇴', initials: 'EH', color: '#EF4444', photoUrl: RP(2),  value: 4 },
  { rank: 2,  name: 'Kylian Mbappé',   country: 'Francia',    countryCode: 'FRA', flag: '🇫🇷', initials: 'KM', color: '#1E3A8A', photoUrl: RP(3),  value: 4 },
  { rank: 2,  name: 'Ousmane Dembélé', country: 'Francia',    countryCode: 'FRA', flag: '🇫🇷', initials: 'OD', color: '#1E3A8A', photoUrl: RP(4),  value: 4 },
  { rank: 2,  name: 'Vinícius Júnior', country: 'Brasil',     countryCode: 'BRA', flag: '🇧🇷', initials: 'VJ', color: '#22C55E', photoUrl: RP(5),  value: 4 },
  { rank: 6,  name: 'Bukayo Saka',     country: 'Inglaterra', countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'BS', color: '#60A5FA', photoUrl: RP(6),  value: 3 },
  { rank: 6,  name: 'Lamine Yamal',    country: 'España',     countryCode: 'ESP', flag: '🇪🇸', initials: 'LY', color: '#EF4444', photoUrl: RP(7),  value: 3 },
  { rank: 6,  name: 'Harry Kane',      country: 'Inglaterra', countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'HK', color: '#60A5FA', photoUrl: RP(8),  value: 3 },
  { rank: 6,  name: 'Rodrygo',         country: 'Brasil',     countryCode: 'BRA', flag: '🇧🇷', initials: 'RO', color: '#22C55E', photoUrl: RP(9),  value: 3 },
  { rank: 10, name: 'Romelu Lukaku',   country: 'Bélgica',    countryCode: 'BEL', flag: '🇧🇪', initials: 'RL', color: '#EF4444', photoUrl: RP(10), value: 2 },
]

// Legacy export alias used by renderAdmin / DEMO_STATS references
export const DEMO_STATS = { goals: DEMO_GOALS }

// ── Tabla de equipos — 32 participantes de la fase eliminatoria ───────────────

export type TeamStat = {
  rank: number
  name: string
  code: string
  flag: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  pts: number
}

export const DEMO_TEAM_STATS: TeamStat[] = [
  // Computed pts = wins*3 + draws
  { rank:  1, name: 'Argentina',         code: 'ARG', flag: '🇦🇷', played: 3, wins: 3, draws: 0, losses: 0, goalsFor: 9,  goalsAgainst: 2,  goalDiff:  7, pts: 9 },
  { rank:  2, name: 'Francia',           code: 'FRA', flag: '🇫🇷', played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 7,  goalsAgainst: 3,  goalDiff:  4, pts: 7 },
  { rank:  3, name: 'Brasil',            code: 'BRA', flag: '🇧🇷', played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 6,  goalsAgainst: 3,  goalDiff:  3, pts: 7 },
  { rank:  4, name: 'Alemania',          code: 'GER', flag: '🇩🇪', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 7,  goalsAgainst: 4,  goalDiff:  3, pts: 6 },
  { rank:  5, name: 'España',            code: 'ESP', flag: '🇪🇸', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 6,  goalsAgainst: 3,  goalDiff:  3, pts: 6 },
  { rank:  6, name: 'Portugal',          code: 'POR', flag: '🇵🇹', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 7,  goalsAgainst: 5,  goalDiff:  2, pts: 6 },
  { rank:  7, name: 'Inglaterra',        code: 'ENG', flag: '🇬🇧', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5,  goalsAgainst: 3,  goalDiff:  2, pts: 6 },
  { rank:  8, name: 'Países Bajos',      code: 'NED', flag: '🇳🇱', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5,  goalsAgainst: 4,  goalDiff:  1, pts: 6 },
  { rank:  9, name: 'USA',               code: 'USA', flag: '🇺🇸', played: 3, wins: 1, draws: 2, losses: 0, goalsFor: 4,  goalsAgainst: 3,  goalDiff:  1, pts: 5 },
  { rank: 10, name: 'México',            code: 'MEX', flag: '🇲🇽', played: 3, wins: 1, draws: 2, losses: 0, goalsFor: 4,  goalsAgainst: 4,  goalDiff:  0, pts: 5 },
  { rank: 11, name: 'Marruecos',         code: 'MAR', flag: '🇲🇦', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 3,  goalsAgainst: 3,  goalDiff:  0, pts: 4 },
  { rank: 12, name: 'Uruguay',           code: 'URU', flag: '🇺🇾', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 3,  goalsAgainst: 4,  goalDiff: -1, pts: 4 },
  { rank: 13, name: 'Colombia',          code: 'COL', flag: '🇨🇴', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 3,  goalsAgainst: 4,  goalDiff: -1, pts: 4 },
  { rank: 14, name: 'Japón',             code: 'JPN', flag: '🇯🇵', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 4,  goalsAgainst: 6,  goalDiff: -2, pts: 4 },
  { rank: 15, name: 'Senegal',           code: 'SEN', flag: '🇸🇳', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3,  goalsAgainst: 4,  goalDiff: -1, pts: 3 },
  { rank: 16, name: 'Bélgica',           code: 'BEL', flag: '🇧🇪', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 4,  goalsAgainst: 6,  goalDiff: -2, pts: 3 },
  { rank: 17, name: 'Corea del Sur',     code: 'KOR', flag: '🇰🇷', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3,  goalsAgainst: 5,  goalDiff: -2, pts: 3 },
  { rank: 18, name: 'Canadá',            code: 'CAN', flag: '🇨🇦', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3,  goalsAgainst: 6,  goalDiff: -3, pts: 3 },
  { rank: 19, name: 'Australia',         code: 'AUS', flag: '🇦🇺', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 2,  goalsAgainst: 5,  goalDiff: -3, pts: 3 },
  { rank: 20, name: 'Suiza',             code: 'SUI', flag: '🇨🇭', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 2,  goalsAgainst: 3,  goalDiff: -1, pts: 2 },
  { rank: 21, name: 'Ecuador',           code: 'ECU', flag: '🇪🇨', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 2,  goalsAgainst: 3,  goalDiff: -1, pts: 2 },
  { rank: 22, name: 'Croacia',           code: 'CRO', flag: '🇭🇷', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 2,  goalsAgainst: 4,  goalDiff: -2, pts: 2 },
  { rank: 23, name: 'Costa de Marfil',   code: 'CIV', flag: '🇨🇮', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 1,  goalsAgainst: 3,  goalDiff: -2, pts: 2 },
  { rank: 24, name: 'Bosnia y Herz.',    code: 'BIH', flag: '🇧🇦', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 2,  goalsAgainst: 5,  goalDiff: -3, pts: 2 },
  { rank: 25, name: 'Arabia Saudita',    code: 'KSA', flag: '🇸🇦', played: 3, wins: 0, draws: 1, losses: 2, goalsFor: 2,  goalsAgainst: 5,  goalDiff: -3, pts: 1 },
  { rank: 26, name: 'Turquía',           code: 'TUR', flag: '🇹🇷', played: 3, wins: 0, draws: 1, losses: 2, goalsFor: 1,  goalsAgainst: 4,  goalDiff: -3, pts: 1 },
  { rank: 27, name: 'Nigeria',           code: 'NGA', flag: '🇳🇬', played: 3, wins: 0, draws: 1, losses: 2, goalsFor: 2,  goalsAgainst: 6,  goalDiff: -4, pts: 1 },
  { rank: 28, name: 'Sudáfrica',         code: 'RSA', flag: '🇿🇦', played: 3, wins: 0, draws: 1, losses: 2, goalsFor: 1,  goalsAgainst: 5,  goalDiff: -4, pts: 1 },
  { rank: 29, name: 'Costa Rica',        code: 'CRC', flag: '🇨🇷', played: 3, wins: 0, draws: 0, losses: 3, goalsFor: 1,  goalsAgainst: 6,  goalDiff: -5, pts: 0 },
  { rank: 30, name: 'Camerún',           code: 'CMR', flag: '🇨🇲', played: 3, wins: 0, draws: 0, losses: 3, goalsFor: 1,  goalsAgainst: 7,  goalDiff: -6, pts: 0 },
  { rank: 31, name: 'Irán',              code: 'IRN', flag: '🇮🇷', played: 3, wins: 0, draws: 0, losses: 3, goalsFor: 0,  goalsAgainst: 6,  goalDiff: -6, pts: 0 },
  { rank: 32, name: 'Arabia Qatarí',     code: 'QAT', flag: '🇶🇦', played: 3, wins: 0, draws: 0, losses: 3, goalsFor: 0,  goalsAgainst: 7,  goalDiff: -7, pts: 0 },
]

// ── Tipos de eventos de partido (para admin/simulación) ───────────────────────

export type MatchEventConfidence = 'high' | 'medium' | 'low'
export type MatchEventType = 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'OWN_GOAL' | 'PENALTY_GOAL'
export type MatchEventStatus = 'pending' | 'approved' | 'rejected'

export type PendingMatchEvent = {
  id: string
  matchId: string
  matchLabel: string
  eventType: MatchEventType
  playerName: string
  teamName: string
  teamCode: string
  flag: string
  minute: number
  source: string
  confidence: MatchEventConfidence
  status: MatchEventStatus
  dedupeKey: string
}

export const DEMO_PENDING_EVENTS: PendingMatchEvent[] = [
  {
    id: 'pe-001',
    matchId: 'r32-73',
    matchLabel: 'Partido #73 — Sudáfrica vs. Canadá',
    eventType: 'GOAL',
    playerName: 'Thembi Zwane',
    teamName: 'Sudáfrica',
    teamCode: 'RSA',
    flag: '🇿🇦',
    minute: 23,
    source: 'ESPN',
    confidence: 'medium',
    status: 'pending',
    dedupeKey: 'r32-73_zwane_GOAL_23_RSA',
  },
  {
    id: 'pe-003',
    matchId: 'r32-76',
    matchLabel: 'Partido #76 — Brasil vs. Japón',
    eventType: 'GOAL',
    playerName: 'Vinícius Júnior',
    teamName: 'Brasil',
    teamCode: 'BRA',
    flag: '🇧🇷',
    minute: 67,
    source: 'FIFA',
    confidence: 'high',
    status: 'pending',
    dedupeKey: 'r32-76_vinicius_GOAL_67_BRA',
  },
]

export const SIMULATED_MATCH = {
  matchId: 'r32-76',
  matchLabel: 'Brasil 2–0 Japón',
  fifaMatchNumber: 76,
  events: [
    { eventType: 'GOAL'        as MatchEventType, playerName: 'Rodrygo',         teamCode: 'BRA', flag: '🇧🇷', minute: 18, dedupeKey: 'r32-76_rodrygo_GOAL_18_BRA' },
    { eventType: 'GOAL'        as MatchEventType, playerName: 'Vinícius Júnior', teamCode: 'BRA', flag: '🇧🇷', minute: 67, dedupeKey: 'r32-76_vinicius_GOAL_67_BRA' },
    { eventType: 'YELLOW_CARD' as MatchEventType, playerName: 'Casemiro',        teamCode: 'BRA', flag: '🇧🇷', minute: 44, dedupeKey: 'r32-76_casemiro_YELLOW_44_BRA' },
  ],
  logs: [
    'STATS_FETCH_STARTED: Partido #76 — Brasil vs. Japón',
    'STATS_FETCH_SUCCESS: Fuente FIFA · confianza alta',
    'STATS_APPLIED: 2 goles aplicados',
    'LOG_UPDATE: Ranking recalculado · Stats actualizadas · 2026-06-26 14:32 VET',
  ],
}
