'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

// ── Types ────────────────────────────────────────────────────────────────────
type KOEntry = {
  position: number
  previousPosition: number | null
  movement: number
  participationCode: string
  fullName: string
  city: string | null
  totalPoints: number
  classifiedCorrect: number
  exactScores: number
  penaltyBonus: number
  playedMatches: number
  paymentStatus: string
}

type MatchResult = {
  id: string
  homeGoals: number | null
  awayGoals: number | null
  penaltyWinner: string | null
  status: string
}

type GruposEntry = {
  pos: number; name: string; pts: number; exact: number; correct: number; move: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatPublicName(full: string): string {
  const parts = full.trim().split(/\s+/)
  if (parts.length <= 1) return full
  return parts[0] + ' ' + parts[parts.length - 1][0] + '.'
}

const todayStr = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })

function shortDateLabel(d: string) {
  const today = todayStr()
  if (d === today) return 'Hoy'
  const [y, mo, dy] = d.split('-').map(Number)
  const dt = new Date(`${y}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}T12:00:00-04:00`)
  return dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function KORankingPage() {
  const [tab, setTab]           = useState<'grupos' | 'dieciseisavos' | 'octavos'>('dieciseisavos')
  const [ranking, setRanking]   = useState<KOEntry[]>([])
  const [results, setResults]   = useState<Record<string, MatchResult>>({})
  const [grupos, setGrupos]     = useState<GruposEntry[]>([])
  const [myCode, setMyCode]     = useState<string | null>(null)
  const [rankDay, setRankDay]   = useState(todayStr())
  const [loading, setLoading]   = useState(true)

  // Cargar datos
  useEffect(() => {
    // Leer session local
    try {
      const s = localStorage.getItem('ko_participant_session')
      if (s) setMyCode(JSON.parse(s).participationCode ?? null)
    } catch { /* ignore */ }

    async function load() {
      const [rankRes, resultsRes, gruposRes] = await Promise.allSettled([
        fetch('/api/ko/ranking').then(r => r.json()),
        fetch('/api/ko/results').then(r => r.json()),
        fetch('/api/ranking').then(r => r.json()),
      ])

      if (rankRes.status === 'fulfilled')
        setRanking(rankRes.value.ranking ?? [])

      if (resultsRes.status === 'fulfilled') {
        const map: Record<string, MatchResult> = {}
        for (const m of (resultsRes.value.matches ?? [])) {
          if (m.result) map[m.id] = m.result
        }
        setResults(map)
      }

      if (gruposRes.status === 'fulfilled') {
        const raw = gruposRes.value.ranking ?? []
        setGrupos(raw.slice(0, 30).map((e: {name:string;pts:number;exact:number;correct:number;move:number}, i: number) => ({
          pos: i + 1, name: e.name, pts: e.pts, exact: e.exact, correct: e.correct, move: e.move ?? 0,
        })))
      }

      setLoading(false)
    }

    load()

    // Auto-refresh cada 60 s para actualizaciones en vivo
    const iv = setInterval(load, 60_000)
    return () => clearInterval(iv)
  }, [])

  // Derived
  const top3 = ranking.slice(0, 3)
  const podiumOrder = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null]

  const allDates = [...new Set(KNOCKOUT_MATCHES.map(m => m.date))].sort()
  const activeDay = allDates.includes(rankDay) ? rankDay : (allDates[0] ?? rankDay)

  const dayMatches = KNOCKOUT_MATCHES
    .filter(m => m.date === activeDay)
    .sort((a, b) => a.timeVet.localeCompare(b.timeVet))
    .map(m => {
      const res = results[m.id]
      const status = res?.status ?? 'SCHEDULED'
      return { ...m, result: res ?? null, liveStatus: status }
    })

  const totalPlayed = Object.values(results).filter(r => r.status === 'FINISHED').length

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 pt-5 pb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-bold text-2xl">🏆 Ranking</h1>
            <Link href="/eliminatorias" className="text-white/70 text-sm hover:text-white">← Inicio</Link>
          </div>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026 · Cada quiniela es independiente</p>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto scrollbar-none">
            {([
              { key: 'grupos',        label: 'Fase de Grupos' },
              { key: 'dieciseisavos', label: 'Dieciseisavos'  },
              { key: 'octavos',       label: 'Octavos a Final' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  tab === t.key
                    ? 'bg-white text-green-800 border-white shadow'
                    : 'bg-white/10 text-white/75 border-white/20 hover:bg-white/20'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-green-300/80 text-[11px] mt-2">
            {tab === 'dieciseisavos' && 'Ranking en vivo de la quiniela Dieciseisavos.'}
            {tab === 'grupos'        && 'Ranking histórico de la quiniela de Fase de Grupos.'}
            {tab === 'octavos'       && 'Próxima quiniela: Octavos hasta la Final.'}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-5 space-y-5">

        {/* ── FASE DE GRUPOS HISTÓRICO ── */}
        {tab === 'grupos' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-amber-500 text-sm mt-0.5">📜</span>
              <div>
                <p className="text-amber-800 font-bold text-xs">Ranking histórico — Fase de Grupos 2026</p>
                <p className="text-amber-700 text-[10px] mt-0.5">Puntos del torneo anterior. <strong>No se mezclan</strong> con el ranking de Dieciseisavos.</p>
              </div>
            </div>

            {grupos.length >= 3 && (
              <div className="flex items-end justify-center gap-3 pt-2">
                {[grupos[1], grupos[0], grupos[2]].map((e, i) => e ? (
                  <div key={e.pos} className="flex flex-col items-center">
                    <div className="text-2xl mb-1">{['🥈','🥇','🥉'][i]}</div>
                    <div className="text-center mb-2">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{formatPublicName(e.name)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{e.pts} pts</p>
                    </div>
                    <div className={`${['h-20','h-28','h-16'][i]} w-24 ${['bg-slate-300','bg-yellow-400','bg-amber-300'][i]} rounded-t-xl flex items-center justify-center font-bold text-lg text-white`}>
                      {i === 1 ? 1 : i === 0 ? 2 : 3}
                    </div>
                  </div>
                ) : <div key={i} className="w-24" />)}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Participante</div>
                <div className="col-span-2 text-center">Pts</div>
                <div className="col-span-2 text-center">🎯 Exac.</div>
                <div className="col-span-2 text-center">✅ Clas.</div>
              </div>
              {grupos.map(e => (
                <div key={e.pos}
                  className={`px-3 py-2.5 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${e.pos <= 3 ? 'bg-yellow-50/40' : 'hover:bg-slate-50'}`}>
                  <div className="col-span-1 text-center flex flex-col items-center">
                    <span className="font-bold text-slate-700 text-sm">
                      {e.pos <= 3 ? ['🥇','🥈','🥉'][e.pos - 1] : e.pos}
                    </span>
                    {e.move > 0 ? <span className="text-green-600 text-[10px] font-bold">↑{e.move}</span>
                      : e.move < 0 ? <span className="text-red-500 text-[10px] font-bold">↓{Math.abs(e.move)}</span>
                      : <span className="text-slate-300 text-[10px]">—</span>}
                  </div>
                  <div className="col-span-5">
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{formatPublicName(e.name)}</p>
                  </div>
                  <div className="col-span-2 text-center"><span className="font-bold text-slate-700 text-base">{e.pts}</span></div>
                  <div className="col-span-2 text-center"><span className="text-sm text-slate-600">{e.exact}</span></div>
                  <div className="col-span-2 text-center"><span className="text-sm font-semibold text-slate-700">{e.correct}</span></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center">Ranking final · Fase de Grupos 2026 · {grupos.length} participantes</p>
            <button onClick={() => setTab('dieciseisavos')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition-all">
              Ver Ranking Dieciseisavos →
            </button>
          </div>
        )}

        {/* ── OCTAVOS (próxima) ── */}
        {tab === 'octavos' && (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-slate-700 font-extrabold text-lg mb-2">Quiniela Octavos a Final</p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Se activará cuando finalicen los Dieciseisavos y estén definidos los 16 clasificados.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs text-slate-500">
              {['Octavos · R16', 'Cuartos · QF', 'Semifinales · SF', 'Final + 3er lugar'].map(s => (
                <div key={s} className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  🔒 {s}
                </div>
              ))}
            </div>
            <button onClick={() => setTab('dieciseisavos')}
              className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
              Ver Ranking Dieciseisavos →
            </button>
          </div>
        )}

        {/* ── DIECISEISAVOS (activo) ── */}
        {tab === 'dieciseisavos' && (
          <>
            {/* Partidos del día */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-5 bg-green-500 rounded-full shrink-0" />
                <h2 className="font-extrabold text-slate-800 text-base">Partidos del día</h2>
              </div>

              {/* Selector de fecha */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {allDates.map(d => (
                  <button key={d} onClick={() => setRankDay(d)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      d === activeDay
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : d === todayStr()
                        ? 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}>
                    {shortDateLabel(d)}
                  </button>
                ))}
              </div>

              {/* Cards de partidos */}
              <div className="mt-2 space-y-2">
                {dayMatches.map(m => {
                  const isFinished = m.liveStatus === 'FINISHED'
                  const isLive     = m.liveStatus === 'LIVE'
                  const stageLabel = ({ R32:'Dieciseisavos', R16:'Octavos', QF:'Cuartos', SF:'Semis', FINAL:'Final' } as Record<string,string>)[m.stage]

                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className={`px-3 py-1.5 flex items-center justify-between text-xs ${
                        isLive ? 'bg-blue-600 text-white' :
                        isFinished ? 'bg-slate-700 text-white' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="font-bold">{stageLabel} · #{m.fifaMatchNumber}</span>
                        <span className="font-semibold">
                          {isLive ? '🔴 En juego' : isFinished ? '✅ Finalizado' : (m.displayTime + ' VET')}
                        </span>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <span className="font-bold text-slate-800 text-sm">{m.home.flag} {m.home.name ?? m.home.placeholder}</span>
                          </div>
                          <div className="shrink-0 text-center w-20">
                            {isFinished && m.result ? (
                              <span className="font-extrabold text-lg text-slate-800">
                                {m.result.homeGoals} — {m.result.awayGoals}
                                {m.result.penaltyWinner && <span className="text-xs font-normal text-slate-500 block">Pen: {m.result.penaltyWinner === 'home' ? (m.home.name ?? m.home.placeholder) : (m.away.name ?? m.away.placeholder)}</span>}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 font-bold">vs</span>
                            )}
                          </div>
                          <div className="flex-1 flex justify-end">
                            <span className="font-bold text-slate-800 text-sm">{m.away.name ?? m.away.placeholder} {m.away.flag}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 truncate">📍 {m.venue} · {m.city}</p>
                      </div>
                    </div>
                  )
                })}
                {dayMatches.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-400 text-sm">
                    No hay partidos para esta fecha.
                  </div>
                )}
              </div>
            </section>

            {/* Stats bar */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-extrabold text-green-600">{ranking.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Participantes</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-700">{totalPlayed}</p>
                <p className="text-xs text-slate-500 mt-0.5">Partidos jugados</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-yellow-600 truncate">{top3[0] ? formatPublicName(top3[0].fullName) : '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Líder actual</p>
              </div>
            </div>

            {/* Podium */}
            {top3.length >= 2 && (
              <div className="flex items-end justify-center gap-3 pt-2">
                {podiumOrder.map((entry, i) => {
                  if (!entry) return <div key={i} className="w-24" />
                  const isMe = entry.participationCode === myCode
                  return (
                    <div key={entry.participationCode} className="flex flex-col items-center">
                      <div className="text-2xl mb-1">{['🥈','🥇','🥉'][i]}</div>
                      <div className="text-center mb-2">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{formatPublicName(entry.fullName)}</p>
                        {isMe && <span className="inline-block text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full mt-0.5">Tú</span>}
                        <p className="text-xs text-slate-500 mt-0.5">{entry.totalPoints} pts</p>
                        <p className="text-xs text-green-600">🏆 {entry.classifiedCorrect} · 🎯 {entry.exactScores}</p>
                      </div>
                      <div className={`${['h-20','h-28','h-16'][i]} w-24 ${['bg-slate-300','bg-yellow-400','bg-amber-300'][i]} rounded-t-xl flex items-center justify-center font-bold text-lg text-white`}>
                        {i === 1 ? 1 : i === 0 ? 2 : 3}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Leyenda */}
            <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-600 items-center">
              <span>🏆 Clasif. <strong>2 pts</strong></span>
              <span className="text-slate-200">·</span>
              <span>🎯 Exacto <strong>+2</strong></span>
              <span className="text-slate-200">·</span>
              <span>⭐ Penales <strong>+1</strong></span>
              <span className="text-slate-200">·</span>
              <span className="text-slate-400">Máx. <strong className="text-slate-600">5 pts</strong></span>
              <span className="w-full text-[10px] text-slate-400 mt-0.5">El marcador no incluye penales en el conteo de goles.</span>
            </div>

            {/* Tabla de ranking */}
            {loading ? (
              <div className="text-center py-8 text-slate-400">Cargando ranking…</div>
            ) : ranking.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm">El ranking se actualizará cuando haya partidos terminados.</p>
              </div>
            ) : (
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4">Participante</div>
                    <div className="col-span-2 text-center">Pts</div>
                    <div className="col-span-2 text-center" title="Clasificados correctos">🏆 Clas.</div>
                    <div className="col-span-1 text-center" title="Marcador exacto">🎯</div>
                    <div className="col-span-2 text-center" title="Penales correctos">⭐ Pen.</div>
                  </div>

                  {ranking.map(entry => {
                    const isMe = entry.participationCode === myCode
                    return (
                      <div key={entry.participationCode}
                        className={`px-3 py-3 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${
                          isMe ? 'bg-yellow-50 border-l-4 border-l-yellow-400' :
                          entry.position <= 3 ? 'bg-yellow-50/50' : 'hover:bg-slate-50'
                        }`}>
                        <div className="col-span-1 text-center flex flex-col items-center">
                          <span className="font-bold text-slate-700 text-sm">
                            {entry.position <= 3 ? ['🥇','🥈','🥉'][entry.position - 1] : entry.position}
                          </span>
                          {entry.movement > 0
                            ? <span className="text-green-600 text-[10px] font-bold leading-none mt-0.5">↑{entry.movement}</span>
                            : entry.movement < 0
                            ? <span className="text-red-500 text-[10px] font-bold leading-none mt-0.5">↓{Math.abs(entry.movement)}</span>
                            : <span className="text-slate-300 text-[10px] leading-none mt-0.5">—</span>}
                        </div>
                        <div className="col-span-4">
                          <p className="font-semibold text-slate-800 text-sm leading-tight">{formatPublicName(entry.fullName)}</p>
                          {isMe && <span className="text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full leading-none">Tú</span>}
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="font-bold text-green-600 text-base">{entry.totalPoints}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-semibold text-slate-700">{entry.classifiedCorrect}</span>
                        </div>
                        <div className="col-span-1 text-center">
                          <span className="text-sm text-slate-600">{entry.exactScores}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm text-amber-600 font-semibold">{entry.penaltyBonus}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Criterios de desempate */}
                <div className="mt-3 bg-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-600 font-semibold mb-1">Criterios de desempate:</p>
                  <ol className="text-xs text-slate-500 space-y-0.5 list-decimal list-inside">
                    <li>Más puntos totales.</li>
                    <li>Más clasificados correctos.</li>
                    <li>Más marcadores exactos.</li>
                    <li>Más penales correctos.</li>
                    <li>Registro más temprano.</li>
                  </ol>
                </div>

                <p className="text-xs text-slate-400 text-center mt-3">
                  {ranking.length} participante{ranking.length !== 1 ? 's' : ''} · Se actualiza automáticamente con cada resultado
                </p>

                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">¿Ves tu posición? Busca tu quiniela para resaltarla.</p>
                  <Link href="/eliminatorias/mi-quiniela" className="shrink-0 text-xs font-bold text-green-700 hover:text-green-800">
                    Ver la mía →
                  </Link>
                </div>
              </section>
            )}

            {/* Nav entre quinielas */}
            <div className="flex gap-2">
              <button onClick={() => setTab('grupos')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-3 rounded-xl transition-colors text-left">
                <span className="block text-slate-500 text-[10px]">← Anterior</span>
                Fase de Grupos
              </button>
              <button onClick={() => setTab('octavos')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-3 rounded-xl transition-colors text-right">
                <span className="block text-slate-500 text-[10px]">Siguiente →</span>
                Octavos a Final
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
