'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { FlagIcon } from '@/components/TeamFlag'
import { ChevronDown, ChevronUp, Calendar, LayoutGrid, List } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RankingEntry {
  position: number
  previousPosition: number | null
  movement: number
  participantId: string
  fullName: string
  displayName: string  // formatted: first name + first surname
  city: string | null
  totalPoints: number
  exactScores: number
  correctResults: number
  wrongPredictions: number
  pendingPredictions: number
  playedMatches: number
  totalGoalDiffError: number
  effectivenessPercent: number
  paymentStatus: string
}

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
  isoCode: string
}

interface PredEntry {
  participantName: string
  predictedTeam1Goals: number
  predictedTeam2Goals: number
  points: number | null
  isExactScore: boolean | null
  isCorrectResult: boolean | null
}

interface DailyMatch {
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
  predictionsAvailable: boolean
  predictions: PredEntry[]
}

interface DaySummary {
  totalMatches: number
  finishedMatches: number
  inPlayMatches: number
  pendingMatches: number
  leaderOfDay: { name: string; pts: number; exactCount: number } | null
}

interface ParticipantGridRow {
  name: string
  preds: Record<string, { g1: number; g2: number; pts: number | null; exact: boolean | null; correct: boolean | null }>
  dayPts: number
}

interface DailyData {
  date: string
  dateLabel: string
  availableDates: string[]
  startedMatchIds: string[]
  matches: DailyMatch[]
  summary: DaySummary
  participantGrid: ParticipantGridRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toVetDateStr(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
}

function vetTime(utc: string): string {
  return new Date(utc).toLocaleTimeString('es-VE', {
    timeZone: 'America/Caracas', hour: '2-digit', minute: '2-digit',
  })
}

function shortDateLabel(dateStr: string, today: string): string {
  if (dateStr === today) return 'Hoy'
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T12:00:00-04:00`)
  return dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function ptsBadgeClass(p: PredEntry): string {
  if (p.isExactScore) return 'bg-green-50 border border-green-200'
  if (p.isCorrectResult) return 'bg-emerald-50 border border-emerald-100'
  if (p.points === 0 && p.isExactScore === false) return 'bg-red-50 border border-red-100'
  return 'bg-white border border-slate-100'
}

function ptsLabel(pts: number | null, isExact: boolean | null, isCorrect: boolean | null) {
  if (pts === null) return null
  if (pts === 3) return { txt: '+3 🎯', cls: 'bg-green-600 text-white' }
  if (pts === 1) return { txt: '+1 ✅', cls: 'bg-emerald-100 text-emerald-800' }
  if (isExact === false && isCorrect === false) return { txt: '0 ❌', cls: 'bg-red-100 text-red-700' }
  return { txt: '0', cls: 'bg-slate-100 text-slate-400' }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MovementIcon({ movement }: { movement: number }) {
  if (movement > 0) return <span className="text-green-500 text-xs">↑{movement}</span>
  if (movement < 0) return <span className="text-red-500 text-xs">↓{Math.abs(movement)}</span>
  return <span className="text-slate-400 text-xs">—</span>
}

function MatchDayCard({ match, now }: { match: DailyMatch; now: Date }) {
  const [expanded, setExpanded] = useState(false)
  const kickoff = new Date(match.kickoffUtc)
  const isStarted = now >= kickoff
  const isFinished = match.status === 'FINISHED'

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
      isFinished ? 'border-green-100' : isStarted ? 'border-blue-200' : 'border-slate-100'
    }`}>
      <div className="p-4">
        {/* Match header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">Grupo {match.group} · #{match.matchNumber}</span>
          {isFinished && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Finalizado</span>}
          {isStarted && !isFinished && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> En juego
            </span>
          )}
          {!isStarted && (
            <span className="text-xs text-slate-400">{vetTime(match.kickoffUtc)} VET</span>
          )}
        </div>

        {/* Teams + score */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <FlagIcon isoCode={match.team1.isoCode} size="lg" />
            <span className="font-semibold text-slate-800 text-sm truncate">{match.team1.displayName}</span>
          </div>

          {isFinished ? (
            <div className="shrink-0 text-center">
              <div className="flex items-center gap-2 bg-slate-800 text-white rounded-lg px-3 py-1.5">
                <span className="text-lg font-bold">{match.team1Goals}</span>
                <span className="text-slate-400 text-sm">—</span>
                <span className="text-lg font-bold">{match.team2Goals}</span>
              </div>
            </div>
          ) : (
            <div className="shrink-0 text-center px-2">
              <div className="text-slate-500 font-bold text-sm">vs</div>
              <div className="text-xs text-slate-400">{vetTime(match.kickoffUtc)}</div>
            </div>
          )}

          <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
            <span className="font-semibold text-slate-800 text-sm truncate text-right">{match.team2.displayName}</span>
            <FlagIcon isoCode={match.team2.isoCode} size="lg" />
          </div>
        </div>

        {/* Toggle — always shown since inscriptions are closed */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => { if (!expanded) track('MATCH_PREDICTIONS_OPENED', '/ranking', { matchId: match.id }); setExpanded(v => !v) }}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-1.5 rounded-lg transition-colors ${
              isFinished ? 'text-green-700 hover:bg-green-50' : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Ocultar pronósticos' : isFinished
              ? `🏆 Ver puntos (${match.predictions.length})`
              : `👁 Ver pronósticos (${match.predictions.length})`}
          </button>
        </div>
      </div>

      {/* Predictions panel */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4">
          {match.predictions.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Sin pronósticos verificados</p>
          ) : (
            <div className="space-y-1.5 mt-3 max-h-72 overflow-y-auto pr-1">
              {match.predictions.map((p, i) => {
                const badge = ptsLabel(p.points, p.isExactScore, p.isCorrectResult)
                return (
                  <div key={i} className={`rounded-xl px-3 py-2 flex items-center justify-between gap-2 ${ptsBadgeClass(p)}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-400 text-xs font-mono w-5 text-right shrink-0">{i + 1}</span>
                      <p className="font-semibold text-slate-800 text-sm truncate">{p.participantName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="bg-slate-700 text-white text-sm font-bold rounded-lg px-2.5 py-1 tabular-nums">
                        {p.predictedTeam1Goals}–{p.predictedTeam2Goals}
                      </div>
                      {badge && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.txt}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {!isFinished && (
            <p className="text-xs text-slate-400 text-center mt-2">
              Puntos pendientes hasta que se cargue el resultado final.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function ParticipantGrid({ rows, matches }: { rows: ParticipantGridRow[]; matches: DailyMatch[] }) {
  const startedMatches = matches.filter(m => m.predictionsAvailable)
  if (startedMatches.length === 0 || rows.length === 0) return null

  return (
    <div className="overflow-x-auto">
      {/* Desktop table */}
      <table className="hidden sm:table w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left px-3 py-2 text-xs font-medium text-slate-400 sticky left-0 bg-slate-50 z-10 min-w-[140px]">Participante</th>
            {startedMatches.map(m => (
              <th key={m.id} className="text-center px-2 py-2 text-xs font-medium text-slate-400 min-w-[80px]">
                <span className="block text-base">{m.team1.flagEmoji}</span>
                <span className="block">vs</span>
                <span className="block text-base">{m.team2.flagEmoji}</span>
              </th>
            ))}
            <th className="text-center px-3 py-2 text-xs font-bold text-slate-500 min-w-[60px]">Pts día</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.name} className={`border-b border-slate-50 ${i < 3 ? 'bg-yellow-50/40' : 'hover:bg-slate-50'}`}>
              <td className="px-3 py-2.5 sticky left-0 bg-white z-10">
                <p className="font-semibold text-slate-800 text-sm truncate max-w-[130px]">{row.name}</p>
              </td>
              {startedMatches.map(m => {
                const pred = row.preds[m.id]
                if (!pred) return (
                  <td key={m.id} className="text-center px-2 py-2.5">
                    <span className="text-slate-300 text-xs">—</span>
                  </td>
                )
                const badge = ptsLabel(pred.pts, pred.exact, pred.correct)
                return (
                  <td key={m.id} className="text-center px-2 py-2.5">
                    <div className={`inline-flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 ${
                      pred.exact ? 'bg-green-100' : pred.correct ? 'bg-emerald-50' : pred.pts === 0 && pred.exact === false ? 'bg-red-50' : 'bg-slate-50'
                    }`}>
                      <span className="font-bold text-slate-800 text-xs tabular-nums">{pred.g1}–{pred.g2}</span>
                      {badge && <span className={`text-xs font-bold px-1 rounded ${badge.cls}`}>{badge.txt}</span>}
                    </div>
                  </td>
                )
              })}
              <td className="text-center px-3 py-2.5">
                <span className={`font-bold text-base ${row.dayPts > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  {row.dayPts}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {rows.map((row, i) => (
          <div key={row.name} className={`rounded-xl border p-3 ${i < 3 ? 'border-yellow-200 bg-yellow-50/40' : 'border-slate-100 bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-slate-800 text-sm">{row.name}</p>
              <div className="text-right">
                <p className="text-xs text-slate-400">Pts hoy</p>
                <p className={`font-bold text-lg ${row.dayPts > 0 ? 'text-green-600' : 'text-slate-400'}`}>{row.dayPts}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {startedMatches.map(m => {
                const pred = row.preds[m.id]
                if (!pred) return null
                const badge = ptsLabel(pred.pts, pred.exact, pred.correct)
                return (
                  <div key={m.id} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs ${
                    pred.exact ? 'bg-green-100' : pred.correct ? 'bg-emerald-50' : pred.pts === 0 && pred.exact === false ? 'bg-red-50' : 'bg-slate-100'
                  }`}>
                    <span>{m.team1.flagEmoji}vs{m.team2.flagEmoji}</span>
                    <span className="font-bold tabular-nums">{pred.g1}–{pred.g2}</span>
                    {badge && <span className={`font-bold px-1 rounded ${badge.cls}`}>{badge.txt}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loadingRanking, setLoadingRanking] = useState(true)
  const [loadingDaily, setLoadingDaily] = useState(true)
  const [now, setNow] = useState(() => new Date())
  const [gridView, setGridView] = useState(false)

  const today = toVetDateStr(now)

  const fetchDaily = useCallback(async (date: string) => {
    setLoadingDaily(true)
    try {
      const res = await fetch(`/api/public/daily-predictions?date=${date}`)
      const data: DailyData = await res.json()
      setDailyData(data)
    } finally {
      setLoadingDaily(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    track('RANKING_VIEW', '/ranking')
    // Ranking
    fetch('/api/ranking')
      .then(r => r.json())
      .then(d => setRanking(d.ranking ?? []))
      .finally(() => setLoadingRanking(false))

    // Daily (today)
    const todayStr = toVetDateStr(new Date())
    setSelectedDate(todayStr)
    fetchDaily(todayStr)

    // Refresh ticker
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [fetchDaily])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    fetchDaily(date)
  }

  const availableDates = dailyData?.availableDates ?? []
  const top3 = ranking.slice(0, 3)
  const podiumOrder = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null]
  const podiumMedals = ['🥈', '🥇', '🥉']
  const podiumHeights = ['h-20', 'h-28', 'h-16']

  const { summary, matches: dayMatches = [], participantGrid = [] } = dailyData ?? {}
  const startedMatchCount = dayMatches.filter(m => m.predictionsAvailable).length

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">🏆 Ranking</h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-5 space-y-5">

        {/* ── DAILY SECTION ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={15} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Pronósticos del día</h2>
          </div>

          {/* Date selector */}
          {availableDates.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {availableDates.map(d => (
                <button
                  key={d}
                  onClick={() => handleDateChange(d)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    d === selectedDate
                      ? 'bg-green-600 text-white border-green-600'
                      : d === today
                      ? 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {shortDateLabel(d, today)}
                </button>
              ))}
            </div>
          )}

          {loadingDaily ? (
            <div className="text-center py-8 text-slate-400 text-sm">Cargando partidos...</div>
          ) : dayMatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-400">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm">No hay partidos para esta fecha.</p>
            </div>
          ) : (
            <>
              {/* Day stats bar */}
              {summary && (
                <div className="bg-white rounded-xl border border-slate-100 p-3 mb-3">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                    <span className="text-slate-600">
                      <span className="font-bold text-slate-800">{summary.totalMatches}</span> partido{summary.totalMatches !== 1 ? 's' : ''}
                    </span>
                    {summary.finishedMatches > 0 && (
                      <span className="text-green-700">
                        ✅ <span className="font-bold">{summary.finishedMatches}</span> finalizado{summary.finishedMatches !== 1 ? 's' : ''}
                      </span>
                    )}
                    {summary.inPlayMatches > 0 && (
                      <span className="text-blue-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-bold">{summary.inPlayMatches}</span> en juego
                      </span>
                    )}
                    {summary.pendingMatches > 0 && (
                      <span className="text-slate-400">
                        🕐 <span className="font-bold">{summary.pendingMatches}</span> por jugar
                      </span>
                    )}
                    {summary.leaderOfDay && summary.finishedMatches > 0 && (
                      <span className="text-yellow-700 font-medium">
                        🌟 Líder del día: <span className="font-bold">{summary.leaderOfDay.name}</span> ({summary.leaderOfDay.pts} pts)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* View toggle (only if there are started matches with predictions) */}
              {startedMatchCount > 0 && participantGrid.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setGridView(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      !gridView ? 'bg-green-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <List size={13} /> Por partido
                  </button>
                  <button
                    onClick={() => setGridView(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      gridView ? 'bg-green-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutGrid size={13} /> Por participante
                  </button>
                </div>
              )}

              {/* Legend */}
              {startedMatchCount > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 mb-3 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                  <span>🎯 <strong>+3</strong> exacto</span>
                  <span>✅ <strong>+1</strong> correcto</span>
                  <span>❌ <strong>0</strong> incorrecto</span>
                  {(summary?.pendingMatches ?? 0) + (summary?.inPlayMatches ?? 0) > 0 && (
                    <span className="text-slate-400">· Puntos pendientes hasta que se cargue el resultado final</span>
                  )}
                </div>
              )}

              {/* Per-match view */}
              {!gridView && (
                <div className="space-y-2">
                  {dayMatches.map(m => (
                    <MatchDayCard key={m.id} match={m} now={now} />
                  ))}
                </div>
              )}

              {/* Per-participant grid view */}
              {gridView && (
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  {participantGrid.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      Los pronósticos aparecerán aquí cuando comiencen los partidos.
                    </div>
                  ) : (
                    <ParticipantGrid rows={participantGrid} matches={dayMatches} />
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── RANKING GENERAL ── */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            🏆 Ranking general
          </h2>

          {loadingRanking ? (
            <div className="text-center py-8 text-slate-400 text-sm">Cargando ranking...</div>
          ) : ranking.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-slate-500 text-sm">El ranking estará disponible cuando comiencen los partidos</p>
            </div>
          ) : (
            <>
              {/* Podium */}
              {top3.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-end justify-center gap-3">
                    {podiumOrder.map((entry, i) => {
                      if (!entry) return <div key={i} className="w-24" />
                      return (
                        <div key={entry.participantId} className="flex flex-col items-center">
                          <div className="text-2xl mb-1">{podiumMedals[i]}</div>
                          <div className="text-center mb-2">
                            <p className="font-bold text-slate-800 text-sm leading-tight">{entry.displayName}</p>
                            <p className="text-xs text-slate-500">{entry.totalPoints} pts</p>
                            <p className="text-xs text-green-600">🎯 {entry.exactScores}</p>
                          </div>
                          <div className={`${podiumHeights[i]} w-24 rounded-t-xl flex items-center justify-center text-white font-bold text-lg ${
                            i === 1 ? 'bg-yellow-500' : i === 0 ? 'bg-slate-400' : 'bg-orange-400'
                          }`}>
                            {i === 1 ? 1 : i === 0 ? 2 : 3}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Scoring legend */}
              <div className="bg-white rounded-xl border border-slate-100 p-3 mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>🎯 Exacto = <strong>3 pts</strong></span>
                <span>✅ Correcto = <strong>1 pt</strong></span>
                <span>❌ Fallo = <strong>0 pts</strong></span>
              </div>

              {/* Table — cols: 2 pos+mov | 4 name | 2 pts | 2 exactos | 2 correctos */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                  <div className="col-span-2 text-center"># Mov.</div>
                  <div className="col-span-4">Participante</div>
                  <div className="col-span-2 text-center">Pts</div>
                  <div className="col-span-2 text-center" title="Puntos por marcador exacto (×3)">🎯 Exac.</div>
                  <div className="col-span-2 text-center" title="Puntos por resultado correcto (×1)">✅ Corr.</div>
                </div>
                {ranking.map((entry) => (
                  <div
                    key={entry.participantId}
                    className={`px-3 py-3 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${
                      entry.position <= 3 ? 'bg-yellow-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-2 text-center flex flex-col items-center leading-none gap-0.5">
                      <span className="font-bold text-slate-700 text-sm">
                        {entry.position <= 3 ? ['🥇','🥈','🥉'][entry.position - 1] : entry.position}
                      </span>
                      {entry.previousPosition != null && entry.previousPosition !== 0 ? (
                        entry.movement > 0
                          ? <span className="text-green-600 text-xs font-medium">↑{entry.movement}</span>
                          : entry.movement < 0
                            ? <span className="text-red-500 text-xs font-medium">↓{Math.abs(entry.movement)}</span>
                            : <span className="text-slate-300 text-xs">—</span>
                      ) : null}
                    </div>
                    <div className="col-span-4">
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{entry.displayName}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-bold text-green-600 text-base">{entry.totalPoints}</span>
                    </div>
                    {/* Points from exact scores (×3) */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold text-slate-700">{entry.exactScores * 3}</span>
                    </div>
                    {/* Points from correct results (×1) */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-slate-600">{entry.correctResults}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tiebreaker note */}
              <div className="mt-3 bg-slate-100 rounded-xl p-3">
                <p className="text-xs text-slate-600 font-semibold mb-1">Criterios de desempate en caso de empate:</p>
                <ol className="text-xs text-slate-500 space-y-0.5 list-decimal list-inside">
                  <li>Más puntos por marcadores exactos.</li>
                  <li>Más puntos por resultados correctos.</li>
                  <li>Quien se registró primero.</li>
                </ol>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">
                {ranking.length} participante{ranking.length !== 1 ? 's' : ''} · Actualizado automáticamente al cargar resultados
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
