'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { FlagIcon } from '@/components/TeamFlag'
import { ChevronDown, ChevronUp, Eye, EyeOff, Clock } from 'lucide-react'

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
  isoCode: string
}

interface Match {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  status: string
  result: string | null
  team1Goals: number | null
  team2Goals: number | null
  team1: Team
  team2: Team
}

interface PredictionEntry {
  participantName: string
  predictedTeam1Goals: number
  predictedTeam2Goals: number
  points: number | null
  isExactScore: boolean | null
  isCorrectResult: boolean | null
}

interface PredictionsResponse {
  available: boolean
  message?: string
  isFinished?: boolean
  predictions?: PredictionEntry[]
  totalPredictions?: number
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function pointsBadge(pts: number | null, isExact: boolean | null, isCorrect: boolean | null) {
  if (pts === null) return null
  if (pts === 3) return { label: '+3 pts · Exacto 🎯', cls: 'bg-green-600 text-white' }
  if (pts === 1) return { label: '+1 pt · Correcto ✅', cls: 'bg-green-100 text-green-800' }
  if (isExact === false && isCorrect === false) return { label: '0 pts · Incorrecto ❌', cls: 'bg-red-100 text-red-700' }
  return { label: '0 pts', cls: 'bg-slate-100 text-slate-500' }
}

function PredictionsList({ matchId, isStarted }: { matchId: string; isStarted: boolean }) {
  const [data, setData] = useState<PredictionsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isStarted) { setLoading(false); return }
    fetch(`/api/public/match-predictions/${matchId}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [matchId, isStarted])

  if (!isStarted) {
    return (
      <div className="mt-3 bg-blue-50 rounded-xl p-4 flex items-center gap-2 text-blue-700 text-sm">
        <Eye size={15} className="shrink-0" />
        Las inscripciones cerraron. Cargando pronósticos…
      </div>
    )
  }
  if (loading) return <div className="mt-3 text-center py-4 text-slate-400 text-sm">Cargando pronósticos...</div>
  if (!data?.available) return (
    <div className="mt-3 bg-slate-50 rounded-xl p-3 text-slate-500 text-sm text-center">
      {data?.message ?? 'Pronósticos no disponibles aún.'}
    </div>
  )

  const preds = data.predictions ?? []

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
          <Eye size={13} /> Pronósticos ({data.totalPredictions})
        </p>
        {data.isFinished
          ? <p className="text-xs text-slate-400">Ordenados por puntos obtenidos</p>
          : <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              En juego · Ranking se actualiza al finalizar
            </div>
        }
      </div>

      {preds.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-4 text-center text-slate-400 text-sm">
          No hay pronósticos verificados para este partido.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {preds.map((p, i) => {
            const badge = pointsBadge(p.points, p.isExactScore, p.isCorrectResult)
            return (
              <div
                key={`${p.participantName}-${i}`}
                className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 ${
                  p.isExactScore ? 'bg-green-50 border border-green-200' :
                  p.isCorrectResult ? 'bg-emerald-50 border border-emerald-100' :
                  p.points === 0 && p.isExactScore === false ? 'bg-red-50 border border-red-100' :
                  'bg-white border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400 text-xs font-mono shrink-0 w-5 text-right">{i + 1}</span>
                  <p className="font-semibold text-slate-800 text-sm truncate">{p.participantName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-slate-700 text-white text-sm font-bold rounded-lg px-3 py-1 tabular-nums">
                    {p.predictedTeam1Goals} — {p.predictedTeam2Goals}
                  </div>
                  {badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full hidden sm:inline ${badge.cls}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {!data.isFinished && (
        <p className="text-xs text-slate-400 text-center mt-2">
          Los puntos se asignar{'á'}n cuando el administrador cargue el resultado final.
        </p>
      )}
    </div>
  )
}

function MatchCard({ match, now }: { match: Match; now: Date }) {
  const [expanded, setExpanded] = useState(false)
  const isFinished = match.status === 'FINISHED'
  const kickoff = new Date(match.kickoffUtc)
  const isStarted = now >= kickoff

  const vetTime = kickoff.toLocaleTimeString('es-VE', {
    timeZone: 'America/Caracas', hour: 'numeric', minute: '2-digit', hour12: true,
  })
  const vetDate = kickoff.toLocaleDateString('es-VE', {
    timeZone: 'America/Caracas', day: 'numeric', month: 'short',
  })

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
      isFinished ? 'border-green-100' : isStarted ? 'border-blue-200' : 'border-slate-100'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Grupo {match.group} · #{match.matchNumber}</span>
          <div className="flex items-center gap-2">
            {isFinished && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Finalizado</span>}
            {isStarted && !isFinished && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> En juego
              </span>
            )}
            {!isStarted && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {vetDate} {vetTime} VET
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <FlagIcon isoCode={match.team1.isoCode} size="lg" />
            <span className="font-semibold text-slate-800 text-sm">{match.team1.displayName}</span>
          </div>

          {isFinished ? (
            <div className="text-center shrink-0">
              <div className="flex items-center gap-2 bg-slate-800 text-white rounded-lg px-4 py-1.5">
                <span className="text-xl font-bold">{match.team1Goals}</span>
                <span className="text-slate-400">—</span>
                <span className="text-xl font-bold">{match.team2Goals}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {match.result === 'G1' ? `Gana ${match.team1.shortName}` :
                 match.result === 'G2' ? `Gana ${match.team2.shortName}` : 'Empate'}
              </div>
            </div>
          ) : (
            <div className="text-center shrink-0 px-3">
              <div className="text-slate-500 font-bold text-sm">vs</div>
              <div className="text-xs text-slate-400">{vetTime}</div>
            </div>
          )}

          <div className="flex-1 flex items-center gap-2 justify-end">
            <span className="font-semibold text-slate-800 text-sm text-right">{match.team2.displayName}</span>
            <FlagIcon isoCode={match.team2.isoCode} size="lg" />
          </div>
        </div>

        {/* Toggle predictions */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setExpanded(v => !v)}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-1.5 rounded-lg transition-colors ${
              isFinished ? 'text-green-700 hover:bg-green-50' : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {expanded ? 'Ocultar' : isFinished ? '🏆 Ver puntos obtenidos' : '👁 Ver pronósticos'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <PredictionsList matchId={match.id} isStarted={true} />
        </div>
      )}
    </div>
  )
}

export default function ResultadosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    track('RESULTS_VIEW', '/resultados')
    fetch('/api/results')
      .then(r => r.json())
      .then(data => setMatches(data.matches ?? []))
      .finally(() => setLoading(false))
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const todayMatches = matches.filter(m => {
    const k = new Date(m.kickoffUtc)
    return (
      k.toLocaleDateString('es-VE', { timeZone: 'America/Caracas' }) ===
      now.toLocaleDateString('es-VE', { timeZone: 'America/Caracas' })
    )
  })

  const filtered = matches.filter(m => {
    const groupOk = activeGroup === 'todos' || m.group === activeGroup
    const statusOk =
      statusFilter === 'todos' ||
      (statusFilter === 'FINISHED' && m.status === 'FINISHED') ||
      (statusFilter === 'upcoming' && m.status !== 'FINISHED')
    return groupOk && statusOk
  })

  const finishedCount = matches.filter(m => m.status === 'FINISHED').length
  const inPlayCount = matches.filter(m => new Date(m.kickoffUtc) <= now && m.status !== 'FINISHED').length

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">⚽ Resultados</h1>
          <p className="text-green-200 text-sm">
            {finishedCount} de {matches.length} partidos jugados
            {inPlayCount > 0 && <> · <span className="text-blue-200 font-semibold">{inPlayCount} en juego ahora</span></>}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-4">

        {/* Partidos de hoy */}
        {todayMatches.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Partidos de hoy
            </h2>
            <div className="space-y-2">
              {todayMatches.map(m => <MatchCard key={`today-${m.id}`} match={m} now={now} />)}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {['todos', ...GROUPS].map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeGroup === g ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {g === 'todos' ? 'Todos' : `Grupo ${g}`}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[{ value: 'todos', label: 'Todos' }, { value: 'FINISHED', label: 'Jugados' }, { value: 'upcoming', label: 'Próximos' }]
              .map(({ value, label }) => (
                <button key={value} onClick={() => setStatusFilter(value)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    statusFilter === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {label}
                </button>
              ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl border border-slate-100 px-4 py-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
          <span>🎯 <strong>+3</strong> marcador exacto</span>
          <span>✅ <strong>+1</strong> resultado correcto</span>
          <span>❌ <strong>0</strong> incorrecto</span>
          <span className="text-slate-400">· Puntos pendientes hasta que se cargue el resultado final</span>
        </div>

        {/* Match list */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando partidos...</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(m => <MatchCard key={m.id} match={m} now={now} />)}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">No hay partidos con estos filtros</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
