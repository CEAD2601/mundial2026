'use client'

import { useState, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Player = {
  rank:      number
  name:      string
  country:   string
  abbrev:    string
  flagUrl:   string | null
  photoUrl:  string | null   // ESPN CDN (puede ser null si 404)
  wikiUrl:   string | null   // Wikipedia thumbnail (fallback)
  goals:     number
  athleteId: string
}

type Team = {
  code:          string
  name:          string
  flagUrl:       string | null
  played:        number
  wins:          number
  draws:         number
  losses:        number
  goalsFor:      number
  goalsAgainst:  number
  goalDiff:      number
  pts:           number
}

// ── Player photo with fallback ─────────────────────────────────────────────────

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ec4899','#8b5cf6',
                '#06b6d4','#ef4444','#84cc16','#f97316','#a855f7',
                '#14b8a6','#e879f9','#fb923c','#4ade80','#60a5fa']

type PhotoState = 'espn' | 'wiki' | 'none'

function PlayerAvatar({ player }: { player: Player }) {
  const [state, setState] = useState<PhotoState>(
    player.photoUrl ? 'espn' : player.wikiUrl ? 'wiki' : 'none'
  )
  const color    = COLORS[(player.rank - 1) % COLORS.length]
  const initials = player.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')

  const src =
    state === 'espn' ? player.photoUrl :
    state === 'wiki' ? player.wikiUrl  : null

  if (src) {
    return (
      <img
        src={src}
        alt={player.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-600 shrink-0"
        style={{ objectPosition: 'center top' }}
        onError={() => {
          if (state === 'espn' && player.wikiUrl) setState('wiki')
          else setState('none')
        }}
      />
    )
  }

  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-slate-700 flex-shrink-0 relative"
      style={{ background: color + '18', color }}>
      <svg viewBox="0 0 40 40" width="40" height="40" className="absolute" aria-hidden>
        <circle cx="20" cy="15" r="7" fill={color} opacity="0.35" />
        <ellipse cx="20" cy="34" rx="11" ry="7" fill={color} opacity="0.25" />
      </svg>
      <span className="relative z-10" style={{ fontSize: 10, fontWeight: 800 }}>{initials}</span>
    </div>
  )
}

// ── Flag image ────────────────────────────────────────────────────────────────

function FlagImg({ url, code, size = 20 }: { url: string | null; code?: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const h = Math.round(size * 0.67)
  if (!url || failed) {
    return (
      <span className="inline-flex items-center justify-center rounded-sm bg-slate-700 text-slate-400 font-bold shrink-0"
        style={{ width: size, height: h, fontSize: Math.max(6, Math.round(size * 0.38)) }}>
        {code ? code.slice(0, 2) : '?'}
      </span>
    )
  }
  return (
    <img src={url} alt="" width={size} height={h}
      className="inline-block object-cover rounded-sm shrink-0"
      style={{ width: size, height: h }}
      onError={() => setFailed(true)}
    />
  )
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonGoalRow() {
  return (
    <div className="grid items-center px-5 py-3 border-t border-slate-800/80 animate-pulse"
      style={{ gridTemplateColumns: '28px 44px 1fr 36px' }}>
      <div className="w-4 h-3 bg-slate-800 rounded" />
      <div className="w-10 h-10 bg-slate-800 rounded-full" />
      <div className="pl-2 space-y-1.5">
        <div className="w-28 h-3 bg-slate-800 rounded" />
        <div className="w-16 h-2.5 bg-slate-800 rounded" />
      </div>
      <div className="w-5 h-4 bg-slate-800 rounded ml-auto" />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'goals', emoji: '⚽', label: 'Goles' },
  { id: 'teams', emoji: '🏆', label: 'Equipos' },
] as const
type Tab = typeof TABS[number]['id']

export default function StatsPage() {
  const [tab,     setTab]     = useState<Tab>('goals')
  const [players, setPlayers] = useState<Player[] | null>(null)
  const [teams,   setTeams]   = useState<Team[]>([])
  const [lastUpd, setLastUpd] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      fetch(`/api/ko/player-stats?_=${Date.now()}`)
        .then(r => r.json())
        .then(d => {
          setPlayers(d.players ?? null)
          setTeams(d.teams   ?? [])
          setLastUpd(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }))
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
    load()
    const iv = setInterval(load, 30_000)
    return () => clearInterval(iv)
  }, [])

  const isTeams = tab === 'teams'

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0f172a' }}>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="font-bold text-2xl">📈 Estadísticas</h1>
          <p className="text-green-200 text-sm">Mundial 2026 · fase eliminatoria</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-3 py-5 pb-28">

        {/* Last update banner */}
        {lastUpd && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-3 text-xs text-green-700 font-semibold">
            <span>✓</span>
            <span>Estadísticas actualizadas · {lastUpd}</span>
          </div>
        )}

        {/* Card oscura */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl mb-4">

          {/* Card header */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-white text-xl font-extrabold tracking-tight">Estadísticas</h1>
                <p className="text-slate-400 text-xs mt-0.5">Quiniela Eliminatorias 2026</p>
              </div>
              <p className="text-[10px] text-right shrink-0 ml-3 mt-1">
                {lastUpd
                  ? <span className="text-green-400 font-semibold">✓ {lastUpd}</span>
                  : <span className="text-slate-500">actualizando…</span>
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all touch-manipulation ${
                    tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}>
                  <span>{t.emoji}</span><span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── GOLES ── */}
          {!isTeams && (
            <div className="divide-y divide-slate-800">
              {/* Col header */}
              <div className="grid px-5 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide"
                style={{ gridTemplateColumns: '28px 44px 1fr 36px' }}>
                <span>#</span><span /><span>Jugador</span>
                <span className="text-right">G</span>
              </div>

              {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonGoalRow key={i} />)}

              {!loading && !players && (
                <div className="px-5 py-12 text-center">
                  <div className="text-3xl mb-3">📡</div>
                  <p className="text-slate-400 text-sm">No se pudo conectar con ESPN.</p>
                  <p className="text-slate-600 text-xs mt-1">Los datos aparecerán al finalizar los primeros partidos.</p>
                </div>
              )}

              {!loading && players?.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="text-3xl mb-3">⚽</div>
                  <p className="text-slate-400 text-sm">Aún no hay goleadores registrados.</p>
                  <p className="text-slate-600 text-xs mt-1">Se sincroniza automáticamente al finalizar cada partido.</p>
                </div>
              )}

              {!loading && players && players.map((p, i) => (
                <div key={`${p.name}-${i}`}
                  className="grid items-center px-5 py-3 hover:bg-slate-800/60 transition-colors"
                  style={{ gridTemplateColumns: '28px 44px 1fr 36px' }}>

                  <span className={`text-sm font-extrabold tabular-nums leading-none ${
                    p.rank === 1 ? 'text-yellow-400' : p.rank <= 3 ? 'text-slate-300' : 'text-slate-500'
                  }`}>{p.rank}</span>

                  <PlayerAvatar player={p} />

                  <div className="pl-2 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{p.name}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <FlagImg url={p.flagUrl} code={p.abbrev} size={16} />
                      <span className="truncate">{p.country || p.abbrev}</span>
                    </p>
                  </div>

                  <span className={`text-right text-lg font-extrabold tabular-nums ${
                    p.rank === 1 ? 'text-yellow-400' : 'text-white'
                  }`}>{p.goals}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── EQUIPOS ── */}
          {isTeams && (
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: 520 }}>

                {/* Table header */}
                <div className="grid px-4 py-2 bg-slate-800/70 text-[10px] font-bold text-slate-400 uppercase tracking-wide"
                  style={{ gridTemplateColumns: '28px 1fr 30px 30px 30px 30px 36px 36px 40px 40px' }}>
                  <span>#</span>
                  <span>Equipo</span>
                  <span className="text-center">PJ</span>
                  <span className="text-center">G</span>
                  <span className="text-center">E</span>
                  <span className="text-center">P</span>
                  <span className="text-center">GF</span>
                  <span className="text-center">GC</span>
                  <span className="text-center">DG</span>
                  <span className="text-center text-yellow-400">PTS</span>
                </div>

                {loading && Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid items-center px-4 py-3 border-t border-slate-800/80 animate-pulse"
                    style={{ gridTemplateColumns: '28px 1fr 30px 30px 30px 30px 36px 36px 40px 40px' }}>
                    <div className="w-4 h-3 bg-slate-800 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-5 bg-slate-800 rounded" />
                      <div className="w-20 h-3 bg-slate-800 rounded" />
                    </div>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div key={j} className="w-5 h-3 bg-slate-800 rounded mx-auto" />
                    ))}
                  </div>
                ))}

                {!loading && teams.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <div className="text-3xl mb-3">🏆</div>
                    <p className="text-slate-400 text-sm">Los datos de equipos aparecerán al finalizar los primeros partidos.</p>
                  </div>
                )}

                {!loading && teams.map((t, i) => (
                  <div key={t.code}
                    className="grid items-center px-4 py-2 border-t border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                    style={{ gridTemplateColumns: '28px 1fr 30px 30px 30px 30px 36px 36px 40px 40px' }}>

                    <span className={`text-xs font-extrabold tabular-nums ${
                      i < 3 ? 'text-yellow-400' : i < 8 ? 'text-green-400' : 'text-slate-500'
                    }`}>{i + 1}</span>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <FlagImg url={t.flagUrl} code={t.code} size={20} />
                      <span className="text-white text-xs font-semibold truncate">{t.name}</span>
                    </div>

                    <span className="text-slate-400 text-xs text-center tabular-nums">{t.played}</span>
                    <span className="text-green-400 text-xs text-center font-bold tabular-nums">{t.wins}</span>
                    <span className="text-slate-400 text-xs text-center tabular-nums">{t.draws}</span>
                    <span className="text-red-400 text-xs text-center tabular-nums">{t.losses}</span>
                    <span className="text-white text-xs text-center tabular-nums">{t.goalsFor}</span>
                    <span className="text-slate-400 text-xs text-center tabular-nums">{t.goalsAgainst}</span>
                    <span className={`text-xs text-center font-bold tabular-nums ${
                      t.goalDiff > 0 ? 'text-green-400' : t.goalDiff < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>{t.goalDiff > 0 ? '+' : ''}{t.goalDiff}</span>
                    <span className="text-yellow-400 text-xs text-center font-extrabold tabular-nums">{t.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between">
            <p className="text-[10px] text-slate-500">
              Fuente: ESPN · actualización automática cada 5 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
