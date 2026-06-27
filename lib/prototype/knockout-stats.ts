/**
 * Estadísticas demo — Prototipo Quiniela Eliminatorias 2026
 * MOCK DATA — no conectado a producción, Prisma ni base real.
 * Editar aquí para actualizar las estadísticas visibles en el prototipo.
 *
 * En producción podría alimentarse desde:
 *   - FIFA API oficial
 *   - ESPN Stats & Info API
 *   - Proveedor deportivo (SportsData.io, Opta, etc.)
 *   - Carga manual desde admin → tabla MatchEvent / PlayerTournamentStats en DB
 *
 * Flujo futuro (producción):
 *   FINAL MATCH DETECTED
 *   → APPLY RESULT
 *   → RECALCULATE RANKING
 *   → FETCH MATCH EVENTS (FIFA / ESPN)
 *   → UPDATE STATS  (idempotente por clave matchId+player+eventType+minute)
 *   → LOG UPDATE
 */

// ── Tipos de categorías ────────────────────────────────────────────────────────

export type StatCategoryId = 'goals' | 'assists' | 'yellow' | 'red' | 'teams'

export type StatCategory = {
  id: StatCategoryId
  label: string
  emoji: string
  unitShort: string
}

export const STAT_CATEGORIES: StatCategory[] = [
  { id: 'goals',   label: 'Goles',             emoji: '⚽', unitShort: 'G'  },
  { id: 'assists', label: 'Asistencias',        emoji: '🅰️', unitShort: 'A'  },
  { id: 'yellow',  label: 'Amarillas',          emoji: '🟨', unitShort: 'TA' },
  { id: 'red',     label: 'Rojas',              emoji: '🟥', unitShort: 'TR' },
  { id: 'teams',   label: 'Equipos',            emoji: '🏳️', unitShort: 'GF' },
]

// ── Jugadores ─────────────────────────────────────────────────────────────────

export type StatPlayer = {
  rank: number
  name: string
  country: string
  countryCode: string
  flag: string
  initials: string
  color: string   // accent color for the avatar bubble
  value: number
}

export const DEMO_STATS: Record<Exclude<StatCategoryId, 'teams'>, StatPlayer[]> = {
  goals: [
    { rank: 1,  name: 'Lionel Messi',      country: 'Argentina',    countryCode: 'ARG', flag: '🇦🇷', initials: 'LM',  color: '#3B82F6', value: 5 },
    { rank: 2,  name: 'Erling Haaland',    country: 'Noruega',      countryCode: 'NOR', flag: '🇳🇴', initials: 'EH',  color: '#EF4444', value: 4 },
    { rank: 2,  name: 'Kylian Mbappé',     country: 'Francia',      countryCode: 'FRA', flag: '🇫🇷', initials: 'KM',  color: '#1E3A8A', value: 4 },
    { rank: 2,  name: 'Ousmane Dembélé',   country: 'Francia',      countryCode: 'FRA', flag: '🇫🇷', initials: 'OD',  color: '#1E3A8A', value: 4 },
    { rank: 2,  name: 'Vinícius Júnior',   country: 'Brasil',       countryCode: 'BRA', flag: '🇧🇷', initials: 'VJ',  color: '#22C55E', value: 4 },
    { rank: 6,  name: 'Bukayo Saka',       country: 'Inglaterra',   countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'BS',  color: '#60A5FA', value: 3 },
    { rank: 6,  name: 'Lamine Yamal',      country: 'España',       countryCode: 'ESP', flag: '🇪🇸', initials: 'LY',  color: '#EF4444', value: 3 },
    { rank: 6,  name: 'Harry Kane',        country: 'Inglaterra',   countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'HK',  color: '#60A5FA', value: 3 },
    { rank: 6,  name: 'Rodrygo',           country: 'Brasil',       countryCode: 'BRA', flag: '🇧🇷', initials: 'RO',  color: '#22C55E', value: 3 },
    { rank: 10, name: 'Romelu Lukaku',     country: 'Bélgica',      countryCode: 'BEL', flag: '🇧🇪', initials: 'RL',  color: '#EF4444', value: 2 },
  ],
  assists: [
    { rank: 1, name: 'Kevin De Bruyne',    country: 'Bélgica',      countryCode: 'BEL', flag: '🇧🇪', initials: 'KDB', color: '#EF4444', value: 4 },
    { rank: 2, name: 'Lionel Messi',       country: 'Argentina',    countryCode: 'ARG', flag: '🇦🇷', initials: 'LM',  color: '#3B82F6', value: 3 },
    { rank: 2, name: 'Bruno Fernandes',    country: 'Portugal',     countryCode: 'POR', flag: '🇵🇹', initials: 'BF',  color: '#EF4444', value: 3 },
    { rank: 4, name: 'Pedri',              country: 'España',       countryCode: 'ESP', flag: '🇪🇸', initials: 'PE',  color: '#EF4444', value: 2 },
    { rank: 4, name: 'Joshua Kimmich',     country: 'Alemania',     countryCode: 'GER', flag: '🇩🇪', initials: 'JK',  color: '#F59E0B', value: 2 },
    { rank: 4, name: 'Phil Foden',         country: 'Inglaterra',   countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'PF',  color: '#60A5FA', value: 2 },
    { rank: 7, name: 'Rodrigo De Paul',    country: 'Argentina',    countryCode: 'ARG', flag: '🇦🇷', initials: 'RDP', color: '#3B82F6', value: 1 },
    { rank: 7, name: 'Rafael Leão',        country: 'Portugal',     countryCode: 'POR', flag: '🇵🇹', initials: 'RL',  color: '#EF4444', value: 1 },
  ],
  yellow: [
    { rank: 1, name: 'Casemiro',           country: 'Brasil',       countryCode: 'BRA', flag: '🇧🇷', initials: 'CA',  color: '#22C55E', value: 3 },
    { rank: 1, name: 'Granit Xhaka',       country: 'Suiza',        countryCode: 'SUI', flag: '🇨🇭', initials: 'GX',  color: '#EF4444', value: 3 },
    { rank: 3, name: 'Jude Bellingham',    country: 'Inglaterra',   countryCode: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', initials: 'JB',  color: '#60A5FA', value: 2 },
    { rank: 3, name: 'Sergio Busquets',    country: 'España',       countryCode: 'ESP', flag: '🇪🇸', initials: 'SB',  color: '#EF4444', value: 2 },
    { rank: 3, name: 'Nicolás Otamendi',   country: 'Argentina',    countryCode: 'ARG', flag: '🇦🇷', initials: 'NO',  color: '#3B82F6', value: 2 },
    { rank: 6, name: 'Raphaël Varane',     country: 'Francia',      countryCode: 'FRA', flag: '🇫🇷', initials: 'RV',  color: '#1E3A8A', value: 1 },
    { rank: 6, name: 'Rúben Dias',         country: 'Portugal',     countryCode: 'POR', flag: '🇵🇹', initials: 'RD',  color: '#EF4444', value: 1 },
  ],
  red: [
    { rank: 1, name: 'Wout Faes',          country: 'Bélgica',      countryCode: 'BEL', flag: '🇧🇪', initials: 'WF',  color: '#EF4444', value: 1 },
    { rank: 1, name: 'Malo Gusto',         country: 'Francia',      countryCode: 'FRA', flag: '🇫🇷', initials: 'MG',  color: '#1E3A8A', value: 1 },
    { rank: 1, name: 'Joël Veltman',       country: 'Países Bajos', countryCode: 'NED', flag: '🇳🇱', initials: 'JV',  color: '#FF6B00', value: 1 },
  ],
}

// ── Estadísticas de equipos ───────────────────────────────────────────────────

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
}

export const DEMO_TEAM_STATS: TeamStat[] = [
  { rank: 1, name: 'Argentina',    code: 'ARG', flag: '🇦🇷', played: 3, wins: 3, draws: 0, losses: 0, goalsFor: 9,  goalsAgainst: 2,  goalDiff: 7  },
  { rank: 2, name: 'Francia',      code: 'FRA', flag: '🇫🇷', played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 7,  goalsAgainst: 3,  goalDiff: 4  },
  { rank: 3, name: 'Brasil',       code: 'BRA', flag: '🇧🇷', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 6,  goalsAgainst: 3,  goalDiff: 3  },
  { rank: 4, name: 'Alemania',     code: 'GER', flag: '🇩🇪', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5,  goalsAgainst: 3,  goalDiff: 2  },
  { rank: 5, name: 'España',       code: 'ESP', flag: '🇪🇸', played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5,  goalsAgainst: 4,  goalDiff: 1  },
  { rank: 6, name: 'Países Bajos', code: 'NED', flag: '🇳🇱', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 4,  goalsAgainst: 4,  goalDiff: 0  },
  { rank: 7, name: 'Portugal',     code: 'POR', flag: '🇵🇹', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 4,  goalsAgainst: 5,  goalDiff: -1 },
  { rank: 8, name: 'Inglaterra',   code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 4,  goalsAgainst: 6,  goalDiff: -2 },
]

// ── Eventos pendientes de revisión (confianza media/baja) ─────────────────────
// Estos eventos serían generados por el cron al detectar estadísticas con baja
// confianza. El admin los revisa antes de aplicarlos.

export type MatchEventConfidence = 'high' | 'medium' | 'low'
export type MatchEventType = 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'OWN_GOAL' | 'PENALTY_GOAL'
export type MatchEventStatus = 'pending' | 'approved' | 'rejected'

export type PendingMatchEvent = {
  id: string
  matchId: string
  matchLabel: string        // e.g. "Partido #73 — Argentina vs. Francia"
  eventType: MatchEventType
  playerName: string
  teamName: string
  teamCode: string
  flag: string
  minute: number
  source: string            // "ESPN" | "FIFA" | "Google Sports"
  confidence: MatchEventConfidence
  status: MatchEventStatus
  // Idempotency key — never duplicate if this key already exists
  dedupeKey: string         // matchId_player_eventType_minute_teamCode
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
    id: 'pe-002',
    matchId: 'r32-73',
    matchLabel: 'Partido #73 — Sudáfrica vs. Canadá',
    eventType: 'YELLOW_CARD',
    playerName: 'Jonathan David',
    teamName: 'Canadá',
    teamCode: 'CAN',
    flag: '🇨🇦',
    minute: 55,
    source: 'Google Sports',
    confidence: 'low',
    status: 'pending',
    dedupeKey: 'r32-73_david_YELLOW_CARD_55_CAN',
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

// ── Simulación de partido finalizado ─────────────────────────────────────────
// Datos que se "aplicarían" al presionar "Simular partido finalizado"
// Representa los eventos del Partido #76: Brasil 2-0 Japón

export const SIMULATED_MATCH = {
  matchId: 'r32-76',
  matchLabel: 'Brasil 2–0 Japón',
  fifaMatchNumber: 76,
  events: [
    { eventType: 'GOAL'        as MatchEventType, playerName: 'Rodrygo',         teamCode: 'BRA', flag: '🇧🇷', minute: 18, dedupeKey: 'r32-76_rodrygo_GOAL_18_BRA' },
    { eventType: 'ASSIST'      as MatchEventType, playerName: 'Vinícius Júnior', teamCode: 'BRA', flag: '🇧🇷', minute: 18, dedupeKey: 'r32-76_vinicius_ASSIST_18_BRA' },
    { eventType: 'GOAL'        as MatchEventType, playerName: 'Vinícius Júnior', teamCode: 'BRA', flag: '🇧🇷', minute: 67, dedupeKey: 'r32-76_vinicius_GOAL_67_BRA' },
    { eventType: 'YELLOW_CARD' as MatchEventType, playerName: 'Casemiro',        teamCode: 'BRA', flag: '🇧🇷', minute: 44, dedupeKey: 'r32-76_casemiro_YELLOW_44_BRA' },
    { eventType: 'YELLOW_CARD' as MatchEventType, playerName: 'Wataru Endo',     teamCode: 'JPN', flag: '🇯🇵', minute: 71, dedupeKey: 'r32-76_endo_YELLOW_71_JPN' },
  ],
  logs: [
    'STATS_FETCH_STARTED: Partido #76 — Brasil vs. Japón',
    'STATS_FETCH_SUCCESS: Fuente FIFA · confianza alta',
    'STATS_APPLIED: 2 goles, 1 asistencia, 2 amarillas aplicadas',
    'STATS_SKIPPED_ALREADY_APPLIED: verificando claves de idempotencia…',
    'LOG_UPDATE: Ranking quiniela recalculado · Stats actualizadas · 2026-06-26 14:32 VET',
  ],
}
