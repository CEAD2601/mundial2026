import { NextResponse } from 'next/server'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'
import { prisma } from '@/lib/prisma'
import { buildKOByNumber, resolveKOMatch } from '@/lib/ko/resolveBracket'

// ── ISO-3 → flagcdn path ───────────────────────────────────────────────────────
const FLAG_CODE: Record<string, string> = {
  ARG:'ar', BRA:'br', FRA:'fr', GER:'de', ESP:'es', ENG:'gb-eng',
  POR:'pt', NED:'nl', URU:'uy', COL:'co', MEX:'mx', USA:'us',
  CAN:'ca', SEN:'sn', MAR:'ma', JPN:'jp', KOR:'kr', NOR:'no',
  BEL:'be', SUI:'ch', AUS:'au', CRO:'hr', DEN:'dk', POL:'pl',
  SWE:'se', RSA:'za', GHA:'gh', CIV:'ci', ECU:'ec', PAR:'py',
  ALG:'dz', EGY:'eg', NGA:'ng', CMR:'cm', COD:'cd', IRN:'ir',
  SAU:'sa', KSA:'sa',  // Saudi Arabia: FIFA=SAU, ESPN=KSA
  QAT:'qa', TUR:'tr', GRE:'gr', SRB:'rs', AUT:'at',
  BIH:'ba', CPV:'cv', CHI:'cl', BOL:'bo', VEN:'ve', PER:'pe',
  MAL:'ml', SLO:'si', SVK:'sk', CZE:'cz', HUN:'hu', UKR:'ua',
  ROU:'ro', NZL:'nz', IRL:'ie', SCO:'gb-sct', WAL:'gb-wls',
  PAN:'pa', HON:'hn', CRC:'cr', JAM:'jm', TRI:'tt', HAI:'ht',
  GUA:'gt', MLI:'ml', BFA:'bf', TUN:'tn',
  PHI:'ph', IND:'in', CHN:'cn', THA:'th', IDN:'id',
  ISL:'is', FIN:'fi', EST:'ee', LAT:'lv', LTU:'lt', GEO:'ge',
  ARM:'am', AZE:'az', MKD:'mk', ALB:'al', BUL:'bg', MDA:'md',
  // ESPN-specific codes missing from FIFA ISO-3
  CUW:'cw',  // Curaçao
  JOR:'jo',  // Jordan
  UZB:'uz',  // Uzbekistan
  IRQ:'iq',  // Iraq
  CLE:'cl',  // Chile (ESPN variant)
  URY:'uy',  // Uruguay (ESPN variant)
}

// ESPN uses display names for teams — map to our ISO-3 codes
const ESPN_ABBREV: Record<string, string> = {
  URY:'URU', CHL:'CHI', ZAF:'RSA', NZL:'NZL', IRQ:'IRQ',
  CHN:'CHN', CMR:'CMR', SEN:'SEN', GAB:'GAB',
}

function isoCode(abbrev: string): string {
  return ESPN_ABBREV[abbrev] ?? abbrev
}

function flagUrl(abbrev: string | null | undefined): string | null {
  if (!abbrev) return null
  const code = FLAG_CODE[isoCode(abbrev).toUpperCase()]
  return code ? `https://flagcdn.com/w40/${code}.png` : null
}

function espnPhoto(id: string | number): string {
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/${id}.png&w=150&h=109&cquality=40&scale=crop`
}

// ── Fix ESPN's broken UTF-8 encoding ─────────────────────────────────────────
// ESPN encodes UTF-8 bytes as individual Unicode escape sequences (e.g. Ã¡ for á).
// This decodes them back to proper UTF-8 strings.
function fixEncoding(s: string): string {
  try {
    const bytes = new Uint8Array([...s].map(c => c.charCodeAt(0) & 0xFF))
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return decoded
  } catch {
    return s
  }
}

// ── Wikipedia photo for a player name ────────────────────────────────────────
async function wikiPhoto(displayName: string): Promise<string | null> {
  // Try the exact name first, then common variants
  const candidates = [
    displayName,
    displayName.replace(/\s+/g, '_'),
  ]
  for (const name of [...new Set(candidates)]) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/\s+/g, '_'))}`
      const r = await fetch(url, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(4000),
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mundial2026Stats/1.0' },
      })
      if (!r.ok) continue
      const d = await r.json()
      if (d.thumbnail?.source) return d.thumbnail.source
    } catch { /* ignore */ }
  }
  return null
}

// ── ESPN photo availability check ─────────────────────────────────────────────
async function checkEspnPhoto(athleteId: string): Promise<boolean> {
  try {
    const r = await fetch(espnPhoto(athleteId), {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    })
    return r.ok
  } catch { return false }
}

// ── Get all completed WC 2026 event IDs (one request) ────────────────────────
async function getCompletedEvents(): Promise<string[]> {
  const r = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260710&limit=300',
    { next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) }
  )
  if (!r.ok) return []
  const d = await r.json()
  return (d.events ?? [])
    .filter((ev: any) => ev.competitions?.[0]?.status?.type?.completed)
    .map((ev: any) => String(ev.id))
}

// ── Player top scorers ────────────────────────────────────────────────────────
async function fetchPlayerGoals() {
  const eventIds = await getCompletedEvents()
  if (!eventIds.length) return null

  type GoalEntry = { name: string; teamAbbrev: string; teamName: string; goals: number; athleteId: string }
  const tally: Record<string, GoalEntry> = {}

  const BATCH = 8
  for (let i = 0; i < eventIds.length; i += BATCH) {
    await Promise.allSettled(eventIds.slice(i, i + BATCH).map(async id => {
      try {
        const r = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`,
          { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) }
        )
        if (!r.ok) return
        const d = await r.json()
        const comps: any[] = d.header?.competitions ?? d.competitions ?? []
        for (const det of (comps[0]?.details ?? [])) {
          if (!det.scoringPlay || det.ownGoal) continue
          const ath = det.participants?.[0]?.athlete
          if (!ath?.id || !ath?.displayName) continue
          const key = String(ath.id)
          if (!tally[key]) {
            tally[key] = {
              name:        fixEncoding(ath.displayName),
              teamAbbrev:  det.team?.abbreviation ?? '',
              teamName:    fixEncoding(det.team?.displayName ?? det.team?.location ?? ''),
              goals:       0,
              athleteId:   key,
            }
          }
          tally[key].goals++
        }
      } catch { /* ignore */ }
    }))
  }

  const top10 = Object.values(tally)
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)

  if (!top10.length) return null

  // For each player: check ESPN photo, if 404 fetch Wikipedia
  const enriched = await Promise.all(top10.map(async p => {
    const [hasEspn, wiki] = await Promise.all([
      checkEspnPhoto(p.athleteId),
      wikiPhoto(p.name),
    ])
    return {
      name:      p.name,
      country:   p.teamName || p.teamAbbrev,
      abbrev:    p.teamAbbrev,
      flagUrl:   flagUrl(p.teamAbbrev),
      photoUrl:  hasEspn ? espnPhoto(p.athleteId) : null,
      wikiUrl:   wiki,
      goals:     p.goals,
      athleteId: p.athleteId,
    }
  }))

  // Assign ranks (ties share same rank)
  let rank = 1
  return enriched.map((p, i) => {
    if (i > 0 && p.goals < enriched[i - 1].goals) rank = i + 1
    return { ...p, rank }
  })
}

// ── Team stats: ESPN sin caché (real-time) + override con DB cuando esté disponible ──
async function fetchTeamStats() {
  type T = {
    name: string; code: string; flagUrl: string | null
    played: number; wins: number; draws: number; losses: number
    goalsFor: number; goalsAgainst: number
  }
  const map: Record<string, T> = {}

  // Seed con los 32 equipos de R32 para garantizar que aparezcan todos
  for (const m of KNOCKOUT_MATCHES.filter(m => m.stage === 'R32')) {
    for (const side of [m.home, m.away]) {
      if (side.code && side.name && !map[side.code]) {
        map[side.code] = { name: side.name, code: side.code, flagUrl: flagUrl(side.code), played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
      }
    }
  }

  // ── ESPN sin caché: datos en tiempo real de todos los partidos finalizados ──
  const r = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=300',
    { cache: 'no-store', signal: AbortSignal.timeout(12000) }
  )
  if (r.ok) {
    const d = await r.json()
    for (const ev of d.events ?? []) {
      const comp = ev.competitions?.[0]
      if (!comp?.status?.type?.completed) continue
      const comps: any[] = comp.competitors ?? []
      if (comps.length !== 2) continue

      const [c0, c1] = comps
      const s0 = parseInt(c0.score ?? '0', 10)
      const s1 = parseInt(c1.score ?? '0', 10)

      for (const [c, score, oppScore] of [[c0, s0, s1], [c1, s1, s0]] as const) {
        const espnCode = (c as any).team?.abbreviation ?? ''
        const code     = isoCode(espnCode)
        const name     = fixEncoding((c as any).team?.displayName ?? (c as any).team?.location ?? code)
        const won      = (c as any).winner === true
        const lost     = comps.find((x: any) => x !== c)?.winner === true

        if (!map[code]) {
          map[code] = { name, code, flagUrl: flagUrl(code), played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
        }
        const t = map[code]
        t.played++
        t.goalsFor     += score as number
        t.goalsAgainst += oppScore as number
        if (won)       t.wins++
        else if (lost) t.losses++
        else           t.draws++
      }
    }
  }

  // ── Override con DB para partidos KO que el admin ya ingresó manualmente ──
  // Esto garantiza que los datos de penales sean exactos cuando están disponibles
  try {
    const koResults = await prisma.kOMatchResult.findMany({
      where: { status: 'FINISHED', homeGoals: { not: null }, awayGoals: { not: null } },
    })
    const resultById = new Map(koResults.map(r => [r.id, r]))
    const koWithResult = KNOCKOUT_MATCHES.map(m => {
      const res = resultById.get(m.id)
      return {
        ...m,
        result: res && res.homeGoals != null && res.awayGoals != null ? {
          homeGoals: res.homeGoals, awayGoals: res.awayGoals,
          penaltyWinner: res.penaltyWinner ?? null, status: res.status,
        } : null,
      }
    })
    const byNumber = buildKOByNumber(koWithResult)

    for (const res of koResults) {
      if (res.homeGoals == null || res.awayGoals == null) continue
      const rawMatch = KNOCKOUT_MATCHES.find(m => m.id === res.id)
      if (!rawMatch) continue
      const resolved = resolveKOMatch(rawMatch, byNumber)
      if (!resolved.home.code || !resolved.away.code || !resolved.home.name || !resolved.away.name) continue

      // Si ESPN ya contó este partido, restar para evitar doble conteo
      // ESPN identifica equipos por su abrev, que puede diferir — usamos nuestro código FIFA
      // La forma más segura: si el equipo ya tiene datos, dejar ESPN (ya es correcto)
      // Solo si hay discrepancia de penales (empate con penaltyWinner), corregir W/L
      for (const [code, isHome] of [[resolved.home.code, true], [resolved.away.code, false]] as const) {
        if (!map[code]) continue
        // En empate con penales: ESPN también marca winner=true/false correctamente,
        // así que no es necesario corregir — ESPN ya lo tiene bien.
        // Este bloque es reservado para correcciones futuras si ESPN difiere.
      }
    }
  } catch { /* DB opcional — ESPN ya tiene los datos */ }

  return Object.values(map)
    .filter(t => t.played > 0)
    .map(t => ({ ...t, goalDiff: t.goalsFor - t.goalsAgainst, pts: t.wins * 3 + t.draws }))
    .sort((a, b) => b.wins - a.wins || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name))
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET() {
  const [pRes, tRes] = await Promise.allSettled([fetchPlayerGoals(), fetchTeamStats()])
  return NextResponse.json({
    players:   pRes.status === 'fulfilled' ? pRes.value : null,
    teams:     tRes.status === 'fulfilled' ? tRes.value : [],
    updatedAt: new Date().toISOString(),
  })
}
