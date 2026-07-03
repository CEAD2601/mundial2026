'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

// ── Types ────────────────────────────────────────────────────────────────────

type KOEntry = {
  position:          number
  previousPosition:  number | null
  movement:          number
  participationCode: string
  fullName:          string
  city:              string | null
  totalPoints:       number
  classifiedCorrect: number
  exactScores:       number
  penaltyBonus:      number
  playedMatches:     number
}

type KOResult = {
  id:            string
  homeGoals:     number | null
  awayGoals:     number | null
  penaltyWinner: string | null
  status:        string
}

type PickEntry = {
  participationCode: string
  fullName:          string
  homeGoals:         number | null
  awayGoals:         number | null
  penaltyWinner:     string | null
  points:            number | null
  hasPick:           boolean
  lateRegistration:  boolean
}

// ── Flag helpers ─────────────────────────────────────────────────────────────

const SPECIAL_FLAGS: Record<string, string> = {
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb-sct',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls',
}

function emojiToFlagUrl(flag: string | null | undefined): string | null {
  if (!flag) return null
  if (SPECIAL_FLAGS[flag]) return `https://flagcdn.com/w40/${SPECIAL_FLAGS[flag]}.png`
  try {
    const codePoints = [...flag].map(c => c.codePointAt(0)!)
    if (codePoints.length < 2) return null
    const iso2 = codePoints.map(cp => String.fromCharCode(cp - 0x1F1E6 + 65)).join('').toLowerCase()
    if (!/^[a-z]{2}$/.test(iso2)) return null
    return `https://flagcdn.com/w40/${iso2}.png`
  } catch { return null }
}

function FlagImg({ flag, size = 24 }: { flag: string | null | undefined; size?: number }) {
  const url = emojiToFlagUrl(flag)
  if (!url) return null
  return (
    <img src={url} alt="" width={size} height={Math.round(size * 0.67)}
      className="inline-block object-cover rounded-sm shrink-0 align-middle"
      style={{ width: size, height: Math.round(size * 0.67) }}
    />
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PREPOSITIONS = new Set(['de', 'del', 'van', 'von', 'da', 'di', 'du', 'la', 'le', 'los'])

function titleCase(s: string): string {
  // \b no funciona bien con vocales acentuadas; usamos split por espacio
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatPublicName(full: string): string {
  const raw   = full.trim().replace(/\s+/g, ' ')
  const parts = raw.split(' ')

  let display: string
  if (parts.length <= 2) {
    display = raw
  } else if (parts.length === 3) {
    // "Andres De Sa" — preposición en el medio = apellido compuesto → mostrar todo
    display = PREPOSITIONS.has(parts[1].toLowerCase())
      ? raw
      : parts[0] + ' ' + parts[1]   // "Guillermo Santana Gonzalez" → "Guillermo Santana"
  } else {
    // 4+ palabras: primer nombre + primer apellido (posición central)
    const idx = Math.floor(parts.length / 2)
    display = PREPOSITIONS.has(parts[idx].toLowerCase())
      ? parts[0] + ' ' + parts[idx] + ' ' + (parts[idx + 1] ?? '')  // "Andres De Sa"
      : parts[0] + ' ' + parts[idx]                                   // "Minerva Valletta"
  }

  return titleCase(display)
}

function toVetDateStr(d: Date): string {
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
}

function shortDateLabel(dateStr: string, today: string): string {
  if (dateStr === today) return 'Hoy'
  const [y, mo, dy] = dateStr.split('-').map(Number)
  const dt = new Date(`${y}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}T12:00:00-04:00`)
  return dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function ptsBadge(points: number | null): { txt: string; cls: string } | null {
  if (points === null) return null
  // 5 pts = clasificado + marcador exacto + penales (empate exacto + penales correctos)
  if (points === 5) return { txt: '+5 ⭐',  cls: 'bg-yellow-500 text-white' }
  // 4 pts = clasificado + marcador exacto
  if (points === 4) return { txt: '+4 🎯',  cls: 'bg-green-600 text-white' }
  // 3 pts = clasificado + bonus penales (empate no exacto + penales correctos)
  if (points === 3) return { txt: '+3 ⭐',  cls: 'bg-amber-400 text-white' }
  // 2 pts = solo clasificado correcto
  if (points === 2) return { txt: '+2 🏆',  cls: 'bg-emerald-100 text-emerald-800' }
  if (points === 0) return { txt: '0 ❌',   cls: 'bg-red-100 text-red-700' }
  return null
}

// Prioridad VISUAL de orden: 5⭐ > 4🎯 > 3⭐ > 2🏆 > 0❌
function visualScoreRank(points: number | null): number {
  if (points === 5)                return 5
  if (points === 4)                return 4
  if (points === 3)                return 3
  if (points === 2)                return 2
  return 1                                    // 0 pts u otro
}

function pickBgClass(points: number | null): string {
  if (points === 5) return 'bg-yellow-50 border border-yellow-200'
  if (points === 4) return 'bg-green-50 border border-green-200'
  if (points === 3) return 'bg-amber-50 border border-amber-200'
  if (points === 2) return 'bg-emerald-50 border border-emerald-100'
  if (points === 0) return 'bg-red-50 border border-red-100'
  return 'bg-white border border-slate-100'
}

// ── MatchCard (expandable, lazy-loads picks) ─────────────────────────────────

function KOMatchCard({
  match,
  result,
  now,
  totalParticipants,
}: {
  match:             typeof KNOCKOUT_MATCHES[number]
  result:            KOResult | null
  now:               Date
  totalParticipants: number
}) {
  const [expanded,  setExpanded]  = useState(false)
  const [picks,     setPicks]     = useState<PickEntry[] | null>(null)
  const [loading,   setLoading]   = useState(false)

  const isFinished = result?.status === 'FINISHED'

  // Detectar "en juego" por tiempo — KOMatchResult no tiene estado LIVE
  const [hh, mm] = match.timeVet.split(':').map(Number)
  const kickoffVet = new Date(`${match.date}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00-04:00`)
  const isStarted  = now >= kickoffVet
  // En juego: kickoff pasó + no finalizado + máximo 3h desde el inicio (cubre tiempo extra)
  const isLive = isStarted && !isFinished && (now.getTime() - kickoffVet.getTime()) < 3 * 60 * 60 * 1000

  const homeName = match.home.name ?? match.home.placeholder
  const awayName = match.away.name ?? match.away.placeholder

  async function togglePicks() {
    if (expanded) { setExpanded(false); return }
    setExpanded(true)
    if (picks !== null) return
    setLoading(true)
    try {
      const res  = await fetch(`/api/ko/match-picks/${match.id}?_=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json()
      // Copia defensiva: nunca mutar el array original devuelto por la API
      const raw: PickEntry[] = [...(data.picks ?? [])]
      raw.sort((a, b) => {
        // Sin pronóstico siempre al final
        if (!a.hasPick && b.hasPick) return 1
        if (a.hasPick && !b.hasPick) return -1
        if (!a.hasPick && !b.hasPick) return 0

        // Partidos NO finalizados (pendientes o en juego): orden ascendente por marcador,
        // agrupando juntos a quienes pusieron el mismo resultado. No aplica lógica de puntos.
        if (!isFinished) {
          const aH = a.homeGoals ?? 0, aA = a.awayGoals ?? 0
          const bH = b.homeGoals ?? 0, bA = b.awayGoals ?? 0
          const totalA = aH + aA, totalB = bH + bA
          if (totalA !== totalB) return totalA - totalB
          if (aH !== bH) return aH - bH
          if (aA !== bA) return aA - bA
          return a.fullName.localeCompare(b.fullName)
        }

        // 1. Orden principal: por prioridad VISUAL del badge (+4 > +2 > +1 ⭐ > 0),
        // no por el puntaje interno crudo (el bono de penales vale 3 pts pero se muestra como "+1 ⭐"
        // y debe listarse después de los +2 🏆, no antes).
        const rankA = visualScoreRank(a.points)
        const rankB = visualScoreRank(b.points)
        if (rankA !== rankB) return rankB - rankA
        // 2. Mismo puntaje: desempate por cercanía al marcador real
        if (result && result.homeGoals != null && result.awayGoals != null) {
          const rH = result.homeGoals as number
          const rA = result.awayGoals as number
          const aH = a.homeGoals ?? 0, aA = a.awayGoals ?? 0
          const bH = b.homeGoals ?? 0, bA = b.awayGoals ?? 0
          // 1. Distancia total: suma de diferencias absolutas por equipo
          const diffA = Math.abs(aH - rH) + Math.abs(aA - rA)
          const diffB = Math.abs(bH - rH) + Math.abs(bA - rA)
          if (diffA !== diffB) return diffA - diffB
          // 2. Menor diferencia de gol (diferencia de marcador) respecto al real
          const realGD = rH - rA
          const gdDiffA = Math.abs((aH - aA) - realGD)
          const gdDiffB = Math.abs((bH - bA) - realGD)
          if (gdDiffA !== gdDiffB) return gdDiffA - gdDiffB
          // 3. Menor diferencia en los goles del ganador real
          const realWinnerGoals = realGD > 0 ? rH : realGD < 0 ? rA : Math.max(rH, rA)
          const aWinnerGoals = (aH - aA) > 0 ? aH : (aH - aA) < 0 ? aA : Math.max(aH, aA)
          const bWinnerGoals = (bH - bA) > 0 ? bH : (bH - bA) < 0 ? bA : Math.max(bH, bA)
          const wgDiffA = Math.abs(aWinnerGoals - realWinnerGoals)
          const wgDiffB = Math.abs(bWinnerGoals - realWinnerGoals)
          if (wgDiffA !== wgDiffB) return wgDiffA - wgDiffB
        }
        // 4. Orden alfabético como último criterio
        return a.fullName.localeCompare(b.fullName)
      })
      setPicks(raw)
    } catch {
      setPicks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
      isFinished ? 'border-green-100' : isStarted ? 'border-blue-200' : 'border-slate-100'
    }`}>
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">
            Dieciseisavos · #{match.fifaMatchNumber}
          </span>
          {isFinished && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Finalizado</span>
          )}
          {isLive && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> En juego
            </span>
          )}
          {!isFinished && !isLive && (
            <span className="text-xs text-slate-400">{match.displayTime} VET</span>
          )}
        </div>

        {/* Teams + score */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-1.5">
            <FlagImg flag={match.home.flag} size={22} />
            <span className="font-semibold text-slate-800 text-sm">{homeName}</span>
          </div>

          {isFinished && result ? (
            <div className="shrink-0 w-20 flex flex-col items-center">
              <div className="w-20 h-9 flex items-center justify-center gap-2 bg-slate-800 text-white rounded-lg">
                <span className="text-lg font-bold leading-none">{result.homeGoals}</span>
                <span className="text-slate-400 text-sm leading-none">—</span>
                <span className="text-lg font-bold leading-none">{result.awayGoals}</span>
              </div>
              {result.penaltyWinner && (
                <p className="w-20 text-xs text-slate-500 mt-1 text-center truncate">
                  Pen: {result.penaltyWinner === 'home' ? homeName : awayName}
                </p>
              )}
            </div>
          ) : (
            <div className="shrink-0 w-20 flex flex-col items-center">
              <div className="w-20 h-9 flex items-center justify-center">
                <span className="text-slate-500 font-bold text-sm leading-none">vs</span>
              </div>
              <div className="w-20 text-xs text-slate-400 text-center truncate">{match.displayTime}</div>
            </div>
          )}

          <div className="flex-1 flex justify-end items-center gap-1.5 min-w-0">
            <span className="font-semibold text-slate-800 text-sm text-right">{awayName}</span>
            <FlagImg flag={match.away.flag} size={22} />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 truncate">📍 {match.venue} · {match.city}</p>

        {/* Toggle */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={togglePicks}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-1.5 rounded-lg transition-colors ${
              isFinished ? 'text-green-700 hover:bg-green-50' : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            {expanded ? '▲ Ocultar pronósticos' : isFinished
              ? `🏆 Ver puntos (${totalParticipants} participantes)`
              : `👁 Ver pronósticos (${totalParticipants} participantes)`}
          </button>
        </div>
      </div>

      {/* Picks panel */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4">
          {loading ? (
            <p className="text-center text-slate-400 text-sm py-4">Cargando pronósticos…</p>
          ) : !picks || picks.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Sin pronósticos verificados</p>
          ) : (
            <div className="space-y-1.5 mt-3 max-h-80 overflow-y-auto pr-1">
              {picks.map((pk, i) => {
                const badge = pk.hasPick ? ptsBadge(pk.points) : null
                return (
                  <div key={pk.participationCode}
                    className={`rounded-xl px-3 py-2 flex items-center justify-between gap-2 ${pk.hasPick ? pickBgClass(pk.points) : 'bg-slate-50 border border-slate-100 opacity-60'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-400 text-xs font-mono w-5 text-right shrink-0">{i + 1}</span>
                      <p className="font-semibold text-slate-800 text-sm truncate">{formatPublicName(pk.fullName)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {pk.hasPick ? (
                        <div className="bg-slate-700 text-white text-sm font-bold rounded-lg px-2.5 py-1 tabular-nums">
                          {pk.homeGoals}–{pk.awayGoals}
                          {pk.penaltyWinner && (
                            <span className="text-slate-300 font-normal text-xs ml-1">
                              (Pen {pk.penaltyWinner === 'home' ? '←' : '→'})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin pronóstico</span>
                      )}
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
              Puntos pendientes hasta que finalice el partido.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function KORankingPage() {
  const [ranking,      setRanking]      = useState<KOEntry[]>([])
  const [results,      setResults]      = useState<Record<string, KOResult>>({})
  const [selectedDate, setSelectedDate] = useState('')
  const [loadingRank,  setLoadingRank]  = useState(true)
  const [myCode,       setMyCode]       = useState<string | null>(null)
  const [now,          setNow]          = useState(() => new Date())
  const [activePhase,  setActivePhase]  = useState<string>('R32')

  const scrollRef      = useRef<HTMLDivElement>(null)
  const activeDateRef  = useRef<HTMLButtonElement>(null)
  const today          = toVetDateStr(now)

  useEffect(() => {
    // Leer código propio del participante
    try {
      const s = localStorage.getItem('ko_participant_session')
      if (s) setMyCode(JSON.parse(s).participationCode ?? null)
    } catch { /* ignore */ }

    setSelectedDate(toVetDateStr(new Date()))

    async function load() {
      const [rankRes, resultsRes, phaseRes] = await Promise.allSettled([
        fetch(`/api/ko/ranking?_=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()),
        fetch(`/api/ko/results?_=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/ko/active-phase', { cache: 'no-store' }).then(r => r.json()),
      ])

      if (rankRes.status === 'fulfilled') {
        setRanking(rankRes.value.ranking ?? [])
        setLoadingRank(false)
      }
      if (phaseRes.status === 'fulfilled') {
        setActivePhase(phaseRes.value.phase ?? 'R32')
      }

      if (resultsRes.status === 'fulfilled') {
        const map: Record<string, KOResult> = {}
        for (const m of (resultsRes.value.matches ?? [])) {
          if (m.result) map[m.id] = m.result
        }
        setResults(map)
      }
    }

    load()
    const iv = setInterval(() => { load(); setNow(new Date()) }, 60_000)
    return () => clearInterval(iv)
  }, [])

  // Scroll active date into view — instant on first render, smooth on user navigation
  const isFirstScroll = useRef(true)
  useEffect(() => {
    if (!activeDateRef.current) return
    const behavior = isFirstScroll.current ? 'instant' : 'smooth'
    isFirstScroll.current = false
    activeDateRef.current.scrollIntoView({ behavior: behavior as ScrollBehavior, inline: 'center', block: 'nearest' })
  }, [selectedDate])

  // Derived
  const allDates   = [...new Set(KNOCKOUT_MATCHES.map(m => m.date))].sort()
  const activeDate = allDates.includes(selectedDate) ? selectedDate : (allDates[0] ?? selectedDate)
  const dayMatches = KNOCKOUT_MATCHES.filter(m => m.date === activeDate).sort((a, b) => a.timeVet.localeCompare(b.timeVet))

  const top3         = ranking.slice(0, 3)
  const podiumOrder  = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null]
  const totalPlayed  = Object.values(results).filter(r => r.status === 'FINISHED').length
  const finishedMatches = dayMatches.filter(m => results[m.id]?.status === 'FINISHED').length

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="font-bold text-2xl">
            🏆 Ranking — {activePhase === 'knockout_round_16_to_final' ? 'Octavos a Final' : 'Dieciseisavos'}
          </h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026 · {ranking.length} participante{ranking.length !== 1 ? 's' : ''}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-5 space-y-5">

        {/* ── SECCIÓN PARTIDOS DEL DÍA ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">📅 Partidos del día</span>
          </div>

          {/* Date selector */}
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {allDates.map(d => (
              <button
                key={d}
                ref={d === activeDate ? activeDateRef : null}
                onClick={() => setSelectedDate(d)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  d === activeDate
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

          {/* Day stats */}
          <div className="bg-white rounded-xl border border-slate-100 p-3 mb-3">
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              <span className="text-slate-600">
                <span className="font-bold text-slate-800">{dayMatches.length}</span> partido{dayMatches.length !== 1 ? 's' : ''}
              </span>
              {finishedMatches > 0 && (
                <span className="text-green-700">
                  ✅ <span className="font-bold">{finishedMatches}</span> finalizado{finishedMatches !== 1 ? 's' : ''}
                </span>
              )}
              {dayMatches.length - finishedMatches > 0 && (
                <span className="text-slate-400">
                  🕐 <span className="font-bold">{dayMatches.length - finishedMatches}</span> por jugar
                </span>
              )}
              {totalPlayed > 0 && ranking.length > 0 && (
                <span className="text-yellow-700 font-medium">
                  🏆 Líder: <span className="font-bold">{formatPublicName(ranking[0].fullName)}</span> ({ranking[0].totalPoints} pts)
                </span>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 mb-3 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
            <span>🏆 <strong>+2</strong> clasif. correcto</span>
            <span>🎯 <strong>+2</strong> marcador exacto</span>
            <span>⭐ <strong>+1</strong> bono penales</span>
            <span className="text-slate-400">· Máx. <strong className="text-slate-600">5 pts</strong> por partido</span>
          </div>

          {/* Match cards */}
          <div className="space-y-2">
            {dayMatches.map(m => (
              <KOMatchCard
                key={m.id}
                match={m}
                result={results[m.id] ?? null}
                now={now}
                totalParticipants={ranking.length}
              />
            ))}
            {dayMatches.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-400">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm">No hay partidos para esta fecha.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── RANKING GENERAL ── */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            🏆 Ranking general
          </h2>

          {loadingRank ? (
            <div className="text-center py-8 text-slate-400 text-sm">Cargando ranking…</div>
          ) : (
            <>
              {/* Podium — solo cuando hay resultados */}
              {top3.length >= 2 && totalPlayed > 0 && (
                <div className="mb-5">
                  <div className="flex items-end justify-center gap-3">
                    {podiumOrder.map((entry, i) => {
                      if (!entry) return <div key={i} className="w-24" />
                      const isMe = entry.participationCode === myCode
                      return (
                        <div key={entry.participationCode} className="flex flex-col items-center">
                          <div className="text-2xl mb-1">{['🥈','🥇','🥉'][i]}</div>
                          <div className="text-center mb-2">
                            <p className="font-bold text-slate-800 text-sm leading-tight">{formatPublicName(entry.fullName)}</p>
                            {isMe && <span className="inline-block text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full mt-0.5">Tú</span>}
                            <p className="text-xs text-slate-500">{entry.totalPoints} pts</p>
                            <p className="text-xs text-green-600">🏆 {entry.classifiedCorrect} · 🎯 {entry.exactScores}</p>
                          </div>
                          <div className={`${['h-20','h-28','h-16'][i]} w-24 rounded-t-xl flex items-center justify-center text-white font-bold text-lg ${
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
                <span>🏆 Clasif. = <strong>2 pts</strong></span>
                <span>🎯 Exacto = <strong>+2 pts</strong></span>
                <span>⭐ Penales = <strong>+1 pt</strong></span>
                <span>❌ Fallo = <strong>0 pts</strong></span>
              </div>

              {/* Ranking table — ALL 18 participants, even at 0 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                  <div className="col-span-2 text-center"># Mov.</div>
                  <div className="col-span-4">Participante</div>
                  <div className="col-span-2 text-center">Pts</div>
                  <div className="col-span-2 text-center" title="Clasificados correctos">🏆 Clas.</div>
                  <div className="col-span-1 text-center" title="Marcador exacto">🎯</div>
                  <div className="col-span-1 text-center" title="Bono penales">⭐</div>
                </div>

                {ranking.map(entry => {
                  const isMe = entry.participationCode === myCode
                  return (
                    <div key={entry.participationCode}
                      className={`px-3 py-3 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${
                        isMe           ? 'bg-yellow-50 border-l-4 border-l-yellow-400' :
                        entry.position <= 3 && totalPlayed > 0 ? 'bg-yellow-50/50' :
                        'hover:bg-slate-50'
                      }`}>
                      <div className="col-span-2 text-center flex flex-col items-center leading-none gap-0.5">
                        <span className="font-bold text-slate-700 text-sm">
                          {(entry.position <= 3 && totalPlayed > 0) ? ['🥇','🥈','🥉'][entry.position - 1] : entry.position}
                        </span>
                        {entry.previousPosition != null && entry.movement !== 0 ? (
                          entry.movement > 0
                            ? <span className="text-green-600 text-xs font-medium">↑{entry.movement}</span>
                            : <span className="text-red-500 text-xs font-medium">↓{Math.abs(entry.movement)}</span>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </div>

                      <div className="col-span-4 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{formatPublicName(entry.fullName)}</p>
                        {isMe && <span className="text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full leading-none">Tú</span>}
                      </div>

                      <div className="col-span-2 text-center">
                        <span className={`font-bold text-base ${entry.totalPoints > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                          {entry.totalPoints}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm font-semibold text-slate-700">{entry.classifiedCorrect}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-sm text-slate-600">{entry.exactScores}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-sm text-amber-600 font-semibold">{entry.penaltyBonus}</span>
                      </div>
                    </div>
                  )
                })}

                {ranking.length === 0 && !loadingRank && activePhase === 'knockout_round_16_to_final' && (
                  <div className="px-4 py-10 text-center">
                    <div className="text-4xl mb-3">🏟️</div>
                    <p className="font-bold text-slate-700 mb-1">Octavos a Final — Inscripciones abiertas</p>
                    <p className="text-slate-500 text-sm mb-4">Todavía no hay participantes inscritos para esta fase.</p>
                    <a href="/octavos/registro"
                      className="inline-block bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                      🚀 Inscribirme en Octavos a Final
                    </a>
                  </div>
                )}
                {ranking.length === 0 && (loadingRank || activePhase === 'R32') && (
                  <div className="px-4 py-8 text-center text-slate-400 text-sm">
                    {loadingRank ? 'Cargando participantes…' : 'Sin participantes verificados aún.'}
                  </div>
                )}
              </div>

              {/* Tiebreakers */}
              <div className="mt-3 bg-slate-100 rounded-xl p-3">
                <p className="text-xs text-slate-600 font-semibold mb-1">Criterios de desempate en caso de empate:</p>
                <ol className="text-xs text-slate-500 space-y-0.5 list-decimal list-inside">
                  <li>Más clasificados correctos.</li>
                  <li>Más marcadores exactos.</li>
                  <li>Más bonos de penales.</li>
                  <li>Menor diferencia acumulada de goles (pronóstico más cercano al marcador real).</li>
                  <li>Quien se registró primero.</li>
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
            </>
          )}
        </section>
      </div>
    </div>
  )
}
