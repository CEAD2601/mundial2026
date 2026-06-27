'use client'

/**
 * Quiniela Eliminatorias 2026 — Prototipo v3
 * Ruta: /admin/prototipo-eliminatorias-avanzado  (solo admin, sin DB, sin Prisma)
 * Datos: lib/prototype/knockout-data.ts (editable)
 * Picks: sessionStorage (no producción, no base real)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Minus, Plus, ArrowRight, Save, Lock, CheckCircle,
  Trophy, TrendingUp, TrendingDown, ChevronRight,
} from 'lucide-react'
import {
  KNOCKOUT_MATCHES, STAGE_META, DEMO_RANKING,
  type KOMatch, type Stage,
} from '@/lib/prototype/knockout-data'
import {
  STAT_CATEGORIES, DEMO_STATS, DEMO_TEAM_STATS, DEMO_PENDING_EVENTS, SIMULATED_MATCH,
  type StatCategory, type StatCategoryId, type PendingMatchEvent,
} from '@/lib/prototype/knockout-stats'

// ── Types ──────────────────────────────────────────────────────────────────────

type View = 'home' | 'llenado' | 'bracket' | 'mi-quiniela' | 'ranking' | 'estadisticas' | 'admin' | 'registro'
type Pick = { home: number; away: number }
type Picks = Record<string, Pick>

const STAGES: Stage[] = ['R32', 'R16', 'QF', 'SF', 'FINAL']
const STORAGE_KEY = 'ko-proto-v3-picks'
const DEMO_NAME   = 'Carlos Demo'
const DEMO_CEDULA = '12345678'
const DEMO_WA     = '04141234567'

function maskCedula(c: string) {
  if (c.length <= 4) return 'V-' + '•'.repeat(c.length)
  return 'V-' + c.slice(0, 2) + '••••' + c.slice(-2)
}

// ── Storage ────────────────────────────────────────────────────────────────────

function loadPicks(): Picks {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function storePicks(p: Picks) { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p)) }

// ── Data helpers ───────────────────────────────────────────────────────────────

function openMatches(s: Stage) {
  return KNOCKOUT_MATCHES.filter(m => m.stage === s && m.isOpenForPredictions)
}
function allMatches(s: Stage) {
  return KNOCKOUT_MATCHES.filter(m => m.stage === s)
}
function stageComplete(s: Stage, picks: Picks) {
  const open = openMatches(s)
  return open.length > 0 && open.every(m => picks[m.id] !== undefined)
}
function stagePartial(s: Stage, picks: Picks) {
  const open = openMatches(s)
  return open.some(m => picks[m.id] !== undefined) && !stageComplete(s, picks)
}
function totalOpen() {
  return KNOCKOUT_MATCHES.filter(m => m.isOpenForPredictions).length
}
function totalFilled(picks: Picks) {
  return KNOCKOUT_MATCHES.filter(m => m.isOpenForPredictions && picks[m.id] !== undefined).length
}

// ── GoalStepper ────────────────────────────────────────────────────────────────

function GoalStepper({
  value, onChange, disabled,
}: {
  value: number; onChange: (v: number) => void; disabled: boolean
}) {
  const handleManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (!isNaN(n) && n >= 0 && n <= 20) onChange(n)
  }
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled || value === 0}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-slate-700 transition-colors touch-manipulation shrink-0"
        type="button"
        aria-label="Restar gol"
      >
        <Minus size={15} />
      </button>
      <input
        type="number" min={0} max={20} value={value} onChange={handleManual} disabled={disabled}
        className="w-12 h-11 text-center text-2xl font-extrabold text-slate-900 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-green-500 disabled:bg-slate-50 disabled:text-slate-400 tabular-nums"
        aria-label="Goles"
      />
      <button
        onClick={() => !disabled && onChange(Math.min(20, value + 1))}
        disabled={disabled || value === 20}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-slate-700 transition-colors touch-manipulation shrink-0"
        type="button"
        aria-label="Sumar gol"
      >
        <Plus size={15} />
      </button>
    </div>
  )
}

// ── FlagDisplay ────────────────────────────────────────────────────────────────

function FlagDisplay({ flag, name, placeholder, side }: {
  flag: string | null; name: string | null; placeholder: string; side: 'left' | 'right'
}) {
  const display = name || placeholder
  return (
    <div className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className="w-9 h-9 shrink-0 flex items-center justify-center text-3xl leading-none">
        {flag
          ? <span role="img">{flag}</span>
          : <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">?</span>
        }
      </div>
      <div className={`min-w-0 ${side === 'right' ? 'text-right' : 'text-left'}`}>
        <p className="font-bold text-slate-800 text-sm leading-tight" style={{ maxWidth: 88, wordBreak: 'break-word' }}>
          {display.length > 14 ? display.slice(0, 13) + '…' : display}
        </p>
      </div>
    </div>
  )
}

// ── KOMatchCard ────────────────────────────────────────────────────────────────

function KOMatchCard({ match, pick, onPick, highlight }: {
  match: KOMatch; pick: Pick | undefined
  onPick: (id: string, p: Pick) => void; highlight?: boolean
}) {
  const hasPick = pick !== undefined
  const current = pick ?? { home: 0, away: 0 }
  const locked = !match.isOpenForPredictions

  const dateObj = new Date(match.date + 'T12:00:00')
  const dateStr = dateObj.toLocaleDateString('es-VE', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Caracas',
  })

  return (
    <article
      className={`bg-white rounded-2xl border-2 p-4 transition-all duration-200 ${
        highlight
          ? 'border-amber-400 shadow-lg ring-2 ring-amber-300/50'
          : hasPick
          ? 'border-green-300 shadow-sm'
          : locked
          ? 'border-slate-100 bg-slate-50/60'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
      aria-label={`Partido ${match.fifaMatchNumber}`}
    >
      {/* Top row: match # · date · time */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
          #{match.fifaMatchNumber}
        </span>
        <div className="text-right min-w-0">
          <p className="text-xs text-slate-600 font-semibold">{dateStr} · {match.displayTime} VET</p>
        </div>
      </div>

      {/* Teams and scores */}
      <div className="flex items-center gap-2">
        {/* Home */}
        <div className="flex-1 min-w-0">
          <FlagDisplay flag={match.home.flag} name={match.home.name} placeholder={match.home.placeholder} side="left" />
          <div className="mt-3">
            {locked ? (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock size={13} />
                <span className="text-xs">Por definir</span>
              </div>
            ) : (
              <GoalStepper
                value={current.home}
                onChange={v => onPick(match.id, { ...current, home: v })}
                disabled={locked}
              />
            )}
          </div>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center shrink-0 gap-1 px-1">
          <span className="text-xs font-bold text-slate-300">vs</span>
          {hasPick && (
            <span className={`text-sm font-extrabold ${
              current.home > current.away ? 'text-green-600' :
              current.away > current.home ? 'text-blue-600' :
              'text-amber-600'
            }`}>
              {current.home}–{current.away}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <FlagDisplay flag={match.away.flag} name={match.away.name} placeholder={match.away.placeholder} side="right" />
          <div className="mt-3 flex justify-end">
            {locked ? (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-xs">Por definir</span>
                <Lock size={13} />
              </div>
            ) : (
              <GoalStepper
                value={current.away}
                onChange={v => onPick(match.id, { ...current, away: v })}
                disabled={locked}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer: venue · status */}
      <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-2 ${hasPick ? 'border-green-100' : 'border-slate-100'}`}>
        <p className="text-xs text-slate-400 min-w-0 truncate">
          📍 {match.venue} · {match.city}
        </p>
        {hasPick && (
          <span className="text-xs font-bold text-green-600 flex items-center gap-1 shrink-0">
            <CheckCircle size={11} /> Listo
          </span>
        )}
        {!hasPick && !locked && (
          <span className="text-xs text-slate-400 shrink-0">Pendiente</span>
        )}
      </div>
    </article>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PrototipoEliminatoriasV3() {
  const [view, setView] = useState<View>('home')
  const [picks, setPicks] = useState<Picks>({})
  const [activeStage, setActiveStage] = useState<Stage>('R32')
  const [toast, setToast] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const matchListTopRef = useRef<HTMLDivElement>(null)

  // Registro demo
  const [registered, setRegistered] = useState(false)
  const [regForm, setRegForm] = useState({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' })
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})

  // Mi Quiniela — búsqueda
  const [miqQuery, setMiqQuery] = useState('')
  const [miqFound, setMiqFound] = useState(false)

  // Admin — búsqueda participantes
  const [adminSearch, setAdminSearch] = useState('')

  // Estadísticas — tab activo y estado de simulación
  const [statTab, setStatTab]           = useState<StatCategoryId>('goals')
  const [statLastUpdate, setStatLastUpdate] = useState<string | null>(null)
  const [statSimLogs, setStatSimLogs]   = useState<string[]>([])
  const [statSimRunning, setStatSimRunning] = useState(false)
  const [pendingEvents, setPendingEvents] = useState<PendingMatchEvent[]>(DEMO_PENDING_EVENTS)

  useEffect(() => { setPicks(loadPicks()) }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const updatePick = useCallback((id: string, p: Pick) => {
    setPicks(prev => {
      const next = { ...prev, [id]: p }
      storePicks(next)
      return next
    })
  }, [])

  const handleSave = useCallback(() => {
    storePicks(picks)
    setToast('✅ Guardado correctamente')
  }, [picks])

  const goToFirstPending = useCallback(() => {
    const stageList = openMatches(activeStage)
    const first = stageList.find(m => !picks[m.id])
    if (!first) return
    setHighlightId(first.id)
    setTimeout(() => {
      document.getElementById(`match-${first.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    setTimeout(() => setHighlightId(null), 2500)
  }, [activeStage, picks])

  const goToNextStage = useCallback(() => {
    const idx = STAGES.indexOf(activeStage)
    if (idx < STAGES.length - 1) {
      setActiveStage(STAGES[idx + 1])
      matchListTopRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeStage])

  // ── Derived values ──────────────────────────────────────────────────────────

  const totalOpenCount = totalOpen()
  const filledCount = totalFilled(picks)
  const pctTotal = totalOpenCount > 0 ? Math.round(filledCount / totalOpenCount * 100) : 0

  const activeOpenMatches = openMatches(activeStage)
  const activeFilled = activeOpenMatches.filter(m => picks[m.id] !== undefined).length
  const activeTotal = activeOpenMatches.length
  const activePct = activeTotal > 0 ? Math.round(activeFilled / activeTotal * 100) : 0
  const activeDone = stageComplete(activeStage, picks)
  const pendingInStage = activeOpenMatches.filter(m => !picks[m.id]).length

  const nextStageIdx = STAGES.indexOf(activeStage) + 1
  const nextStage = nextStageIdx < STAGES.length ? STAGES[nextStageIdx] : null

  // ── Navigation ──────────────────────────────────────────────────────────────

  const navItems: { id: View; label: string; emoji: string }[] = [
    { id: 'home',          label: 'Inicio',      emoji: '🏠' },
    { id: 'llenado',       label: 'Llenar',      emoji: '⚽' },
    { id: 'mi-quiniela',   label: 'Mi quiniela', emoji: '📋' },
    { id: 'ranking',       label: 'Ranking',     emoji: '🏆' },
    { id: 'bracket',       label: 'Cuadro',      emoji: '📊' },
    { id: 'estadisticas',  label: 'Stats',       emoji: '📈' },
  ]

  // ── HOME ────────────────────────────────────────────────────────────────────

  function renderHome() {
    return (
      <div>
        {/* Hero */}
        <header className="relative overflow-hidden text-white" style={{ minHeight: '520px' }}>
          {/* Background image — mobile/portrait */}
          <div className="absolute inset-0 block sm:hidden">
            <img
              src="/assets/hero/hero-mobile.webp"
              alt="Quiniela Eliminatorias 2026 — jugadores internacionales"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
          </div>
          {/* Background image — desktop/landscape */}
          <div className="absolute inset-0 hidden sm:block">
            <img
              src="/assets/hero/hero-desktop.webp"
              alt="Quiniela Eliminatorias 2026 — jugadores internacionales"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Dark gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
          {/* Green tint at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />

          <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-20 text-center">
            {/* Country badge */}
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/90 text-xs font-bold mb-4">
              🇲🇽 México · 🇺🇸 EE.UU. · 🇨🇦 Canadá 2026
            </div>

            {/* Status badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-yellow-400/25 border border-yellow-400/50 rounded-full px-4 py-1.5 text-yellow-300 text-sm font-bold animate-pulse">
                🟢 Inscripciones abiertas
              </div>
            </div>

            {/* Main title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight tracking-tight drop-shadow-2xl">
              Quiniela<br />
              <span className="text-yellow-400">Eliminatorias 2026</span>
            </h1>

            <p className="text-white/90 text-base mb-2 font-semibold drop-shadow-md">
              Nueva ronda · Nuevos participantes · Nuevo ranking
            </p>
            <p className="text-white/65 text-sm mb-6">
              Dieciseisavos · Octavos · Cuartos · Semifinales · Final
            </p>

            {/* Progress bar if started */}
            {filledCount > 0 && (
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-3 mb-5 max-w-xs mx-auto">
                <p className="text-xs text-green-200 mb-1.5 font-semibold">Tu progreso</p>
                <div className="w-full bg-white/20 rounded-full h-2.5 mb-1.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pctTotal}%` }} />
                </div>
                <p className="text-xs text-yellow-300 font-extrabold">
                  {filledCount} / {totalOpenCount} partidos · {pctTotal}%
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-sm mx-auto sm:max-w-none">
              <button
                onClick={() => setView(registered || filledCount > 0 ? 'llenado' : 'registro')}
                className="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base shadow-2xl transition-all active:scale-95 touch-manipulation"
              >
                ⚽ {filledCount > 0 ? 'Continuar llenando' : 'Participar ahora'}
              </button>
              <button
                onClick={() => setView('ranking')}
                className="bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-white font-bold px-6 py-4 rounded-2xl text-base transition-all touch-manipulation backdrop-blur-sm"
              >
                🏆 Ver ranking
              </button>
              <button
                onClick={() => setView('mi-quiniela')}
                className="bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-white font-bold px-6 py-4 rounded-2xl text-base transition-all touch-manipulation backdrop-blur-sm"
              >
                📋 Mi quiniela
              </button>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
            </svg>
          </div>
        </header>

        {/* Stats bar */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 py-5 grid grid-cols-4 gap-2 text-center">
            {[
              { v: '32', l: 'partidos' },
              { v: '5',  l: 'rondas' },
              { v: '32', l: 'equipos' },
              { v: '19 jul', l: 'final' },
            ].map(s => (
              <div key={s.l}>
                <p className="text-xl font-extrabold text-slate-800">{s.v}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

          {/* Etapas overview */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-800 mb-4">Etapas de la eliminatoria</h2>
            <div className="space-y-3">
              {STAGES.map(s => {
                const meta = STAGE_META[s]
                const open = openMatches(s)
                const filled = open.filter(m => picks[m.id] !== undefined).length
                const done = stageComplete(s, picks)
                const partial = stagePartial(s, picks)
                const locked = open.length === 0
                return (
                  <div
                    key={s}
                    className={`rounded-2xl border-2 p-4 flex items-center justify-between gap-3 transition-all ${
                      done    ? 'border-green-300 bg-green-50' :
                      partial ? 'border-amber-300 bg-amber-50/60' :
                      locked  ? 'border-slate-200 bg-slate-50 opacity-60' :
                      'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">
                        {done ? '✅' : partial ? '📝' : locked ? '🔒' : '⚽'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{meta.label}</p>
                        <p className="text-xs text-slate-500">{meta.dates} · {meta.matches} partidos</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {locked ? (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
                          Por definir
                        </span>
                      ) : (
                        <button
                          onClick={() => { setActiveStage(s); setView('llenado') }}
                          className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95 touch-manipulation ${
                            done ? 'bg-green-600 text-white hover:bg-green-700' :
                            'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {done ? `${filled}/${open.length} ✓` : `${filled}/${open.length} → Llenar`}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Scoring system */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-800 mb-4">Sistema de puntuación</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { pts: '3 pts',  label: 'Marcador exacto',    emoji: '🎯', bg: 'bg-yellow-50', border: 'border-yellow-300', chip: 'bg-yellow-400 text-slate-900' },
                { pts: '1 pt',   label: 'Resultado correcto', emoji: '✅', bg: 'bg-green-50',  border: 'border-green-300',  chip: 'bg-green-500 text-white' },
                { pts: '0 pts',  label: 'Incorrecto',         emoji: '❌', bg: 'bg-slate-50',  border: 'border-slate-200',  chip: 'bg-slate-300 text-slate-700' },
              ].map(c => (
                <div key={c.pts} className={`${c.bg} border ${c.border} rounded-2xl p-4 text-center`}>
                  <div className="text-2xl mb-2">{c.emoji}</div>
                  <span className={`${c.chip} text-xs font-extrabold rounded-lg px-2 py-1 mb-2 inline-block`}>{c.pts}</span>
                  <p className="text-xs text-slate-600 leading-tight mt-1">{c.label}</p>
                </div>
              ))}
            </div>
            {/* Example */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-800 mb-2">Ejemplo:</p>
              <div className="flex gap-3 text-xs text-blue-700">
                <span>Real: <strong>2-1</strong></span>
                <span>|</span>
                <span>Predices <strong>2-1</strong> → 🎯 3 pts</span>
                <span>|</span>
                <span>Predices <strong>1-0</strong> → ✅ 1 pt</span>
                <span>|</span>
                <span>Predices <strong>0-2</strong> → ❌ 0 pts</span>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-800 mb-4">¿Cómo funciona?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: '1', emoji: '📝', title: 'Inscríbete', desc: 'Regístrate con tu nombre y paga' },
                { n: '2', emoji: '⚽', title: 'Llena tu quiniela', desc: 'Predice los 32 partidos' },
                { n: '3', emoji: '✅', title: 'Confirma', desc: 'Revisa y bloquea tu quiniela' },
                { n: '4', emoji: '🏆', title: '¡Gana!', desc: 'El mejor quinielero gana el 65%' },
              ].map(s => (
                <div key={s.n} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{s.emoji} {s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats teaser card */}
          <section>
            <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg">
              <div>
                <p className="text-white font-extrabold text-base leading-tight">📈 Estadísticas del torneo</p>
                <p className="text-slate-400 text-xs mt-1">Goleadores · Asistencias · Tarjetas</p>
                <div className="flex gap-2 mt-2.5">
                  {STAT_CATEGORIES.map(c => (
                    <span key={c.id} className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {c.emoji} {c.label.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setView('estadisticas')}
                className="shrink-0 bg-white text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-100 active:scale-95 transition-all touch-manipulation"
              >
                Ver stats
              </button>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='12' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '50px 50px',
            }} />
            <div className="relative">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¿Listo para participar?</h2>
              <p className="text-green-100 mb-8 text-sm sm:text-base max-w-sm mx-auto">
                Predice los 32 partidos y compite por el primer lugar de la Quiniela Eliminatorias 2026.
              </p>
              <button
                onClick={() => setView(registered || filledCount > 0 ? 'llenado' : 'registro')}
                className="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-10 py-4 rounded-2xl text-lg shadow-xl transition-all active:scale-95 touch-manipulation"
              >
                ⚽ {registered || filledCount > 0 ? 'Llenar mi quiniela' : 'Inscribirme ahora'}
              </button>
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ── LLENADO ─────────────────────────────────────────────────────────────────

  function renderLlenado() {
    return (
      <div className="pb-28">
        {/* Sticky progress header */}
        <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white sticky top-0 z-20 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-green-200">Quiniela de</p>
                <p className="font-bold text-sm truncate max-w-[160px]">{DEMO_NAME}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-200">Marcadores</p>
                <p className="font-bold text-lg text-yellow-300">{filledCount}/{totalOpenCount}</p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pctTotal}%` }}
                role="progressbar"
                aria-valuenow={pctTotal}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-green-100 mt-1 text-right">{pctTotal}% completado</p>
          </div>
        </header>

        {/* Step indicator */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-hide">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <span className="text-slate-400 shrink-0">Registro</span>
              <div className="flex-1 h-px bg-slate-200 min-w-3" />
              <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span className="font-semibold text-green-700 shrink-0">Pronósticos</span>
              <div className="flex-1 h-px bg-slate-200 min-w-3" />
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span className="text-slate-400 shrink-0">Revisar</span>
              <div className="flex-1 h-px bg-slate-200 min-w-3" />
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <span className="text-slate-400 shrink-0">Confirmar</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Scoring hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-blue-800 mb-1.5">Sistema de puntuación:</p>
            <div className="flex gap-4 text-xs text-blue-700 flex-wrap">
              <span>🎯 <strong>3 pts</strong> — Marcador exacto</span>
              <span>✅ <strong>1 pt</strong> — Resultado correcto</span>
              <span>❌ <strong>0 pts</strong> — Incorrecto</span>
            </div>
          </div>

          {/* Stage tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {STAGES.map(s => {
              const meta = STAGE_META[s]
              const open = openMatches(s)
              const done = stageComplete(s, picks)
              const partial = stagePartial(s, picks)
              const active = s === activeStage
              const locked = open.length === 0
              return (
                <button
                  key={s}
                  onClick={() => { if (!locked) { setActiveStage(s); matchListTopRef.current?.scrollIntoView({ behavior: 'smooth' }) } }}
                  disabled={locked}
                  aria-pressed={active}
                  className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation ${
                    active  ? 'bg-green-600 text-white shadow-sm' :
                    done    ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                    partial ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' :
                    locked  ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                    'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {meta.short}
                  {done && !active && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full text-white text-[8px] flex items-center justify-center">✓</span>
                  )}
                  {partial && !active && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Stage heading */}
          <div ref={matchListTopRef} className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-800 text-base">{STAGE_META[activeStage].label}</h2>
              <p className="text-xs text-slate-500">{STAGE_META[activeStage].dates}</p>
            </div>
            <span className={`text-sm font-extrabold ${activeDone ? 'text-green-600' : 'text-slate-500'}`}>
              {activeFilled}/{activeTotal}
            </span>
          </div>

          {/* Match list */}
          {activeOpenMatches.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <Lock size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-slate-500 text-base">Etapa bloqueada</p>
              <p className="text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                Los partidos de esta ronda se desbloquean cuando avance la competencia.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOpenMatches.map(m => (
                <div key={m.id} id={`match-${m.id}`}>
                  <KOMatchCard
                    match={m}
                    pick={picks[m.id]}
                    onPick={updatePick}
                    highlight={highlightId === m.id}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Stage completion block */}
          {activeOpenMatches.length > 0 && (
            <div className="mt-6">
              {activeDone ? (
                <div className="bg-green-600 rounded-2xl p-5 shadow-lg">
                  <p className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    ✅ ¡Etapa completada!
                  </p>
                  <p className="text-green-200 text-xs mb-4">Todos los partidos de esta ronda están listos.</p>
                  {nextStage ? (
                    <button
                      onClick={goToNextStage}
                      className="w-full bg-white text-green-700 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 text-base hover:bg-green-50 shadow transition-all active:scale-95 touch-manipulation"
                    >
                      Continuar a {STAGE_META[nextStage].label} <ArrowRight size={20} />
                    </button>
                  ) : filledCount === totalOpenCount ? (
                    <button
                      onClick={() => setView('mi-quiniela')}
                      className="w-full bg-white text-green-700 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 text-base hover:bg-green-50 shadow transition-all active:scale-95 touch-manipulation"
                    >
                      Revisar mi quiniela completa <ArrowRight size={20} />
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📝</span>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">
                        {pendingInStage === 1
                          ? 'Te falta 1 partido en esta etapa.'
                          : `Te faltan ${pendingInStage} partidos en esta etapa.`}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">Ingresa el marcador de cada partido.</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{activeFilled}/{activeTotal} en esta etapa</span>
                      <span>{activePct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${activePct}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 bg-slate-200 text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed"
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={goToFirstPending}
                      className="flex-none bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all touch-manipulation"
                    >
                      🔍 Ir al pendiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 md:ml-56 bg-white border-t-2 border-slate-200 shadow-2xl z-30">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {activeDone ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="shrink-0 border border-green-600 text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 flex items-center gap-1.5 text-sm transition-all touch-manipulation"
                >
                  <Save size={14} /> Guardar
                </button>
                {nextStage ? (
                  <button
                    onClick={goToNextStage}
                    className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-all touch-manipulation"
                  >
                    {STAGE_META[nextStage].short} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setView('mi-quiniela')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-all touch-manipulation"
                  >
                    Revisar quiniela <ArrowRight size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="shrink-0 border border-slate-300 text-slate-600 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 text-sm transition-all touch-manipulation"
                >
                  <Save size={14} /> Guardar
                </button>
                <button
                  onClick={goToFirstPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all touch-manipulation"
                >
                  🔍 Ir al primer pendiente
                  <span className="bg-amber-700/70 text-xs px-2 py-0.5 rounded-full font-extrabold">
                    {pendingInStage}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-green-700 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 animate-bounce">
              {toast}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── BRACKET ─────────────────────────────────────────────────────────────────

  function renderBracket() {
    const BKT_H    = 720   // total column height px
    const CARD_H   = 44    // each match card height px
    const COL_W    = 148   // card column width px
    const CONN_W   = 22    // connector column width px

    // Bracket ordered top→bottom so connectors align correctly:
    // R32 pair[0,1]→R16[0], pair[2,3]→R16[1], ... pair[14,15]→R16[7]
    // R16 pair[0,1]→QF[0],  pair[2,3]→QF[1],  pair[4,5]→QF[2],  pair[6,7]→QF[3]
    // QF  pair[0,1]→SF[0],  pair[2,3]→SF[1]
    // SF  pair[0,1]→FINAL[0]
    const BRACKET_COLS: Array<{ label: string; dates: string; ids: string[] }> = [
      { label: 'Dieciseisavos', dates: '28 jun – 3 jul', ids: [
        'r32-74','r32-77','r32-73','r32-75',
        'r32-83','r32-84','r32-81','r32-82',
        'r32-76','r32-78','r32-79','r32-80',
        'r32-86','r32-88','r32-85','r32-87',
      ]},
      { label: 'Octavos de final', dates: '4 – 7 jul', ids: [
        'r16-89','r16-90','r16-93','r16-94',
        'r16-91','r16-92','r16-95','r16-96',
      ]},
      { label: 'Cuartos de final', dates: '9 – 11 jul', ids: [
        'qf-97','qf-98','qf-99','qf-100',
      ]},
      { label: 'Semifinales', dates: '14 – 15 jul', ids: [
        'sf-101','sf-102',
      ]},
      { label: 'Final', dates: '19 jul', ids: [
        'f-104',
      ]},
    ]

    function cardTop(idx: number, total: number) {
      return Math.round((idx + 0.5) * (BKT_H / total) - CARD_H / 2)
    }

    function connectorSVG(leftCount: number) {
      const slotH = BKT_H / leftCount
      const d = Array.from({ length: leftCount / 2 }, (_, i) => {
        const y1 = (2 * i + 0.5) * slotH
        const y2 = (2 * i + 1.5) * slotH
        return `M0,${y1} H${CONN_W} V${y2} H0`
      }).join(' ')
      return (
        <svg
          width={CONN_W} height={BKT_H}
          style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}
        >
          <path d={d} fill="none" stroke="#22c55e" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }

    const totalW = BRACKET_COLS.length * COL_W + (BRACKET_COLS.length - 1) * CONN_W

    const m3rd = KNOCKOUT_MATCHES.find(m => m.id === 'f-103')

    return (
      <div className="px-4 py-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Cuadro eliminatorio</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Mundial 2026 · 32 partidos · 28 jun – 19 jul
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full mt-1 shrink-0 ml-3">
            ← Desliza →
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Cada columna es una ronda · Toca un partido para ir a llenarlo
        </p>

        {/* Horizontally scrollable bracket — works on mobile + desktop */}
        <div className="overflow-x-auto -mx-4 px-4 pb-4" style={{ WebkitOverflowScrolling: 'touch' as const }}>
          <div style={{ minWidth: totalW }}>

            {/* Round headers */}
            <div className="flex mb-2">
              {BRACKET_COLS.map((col, ci) => (
                <div key={col.label} style={{ display: 'flex' }}>
                  <div style={{ width: COL_W, flexShrink: 0 }}>
                    <div style={{
                      background: ci === BRACKET_COLS.length - 1 ? '#fbbf24' : '#16a34a',
                      color: ci === BRACKET_COLS.length - 1 ? '#1c1917' : 'white',
                      borderRadius: '8px 8px 0 0',
                      padding: '5px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      whiteSpace: 'nowrap' as const,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {col.label}
                      <span style={{ display: 'block', fontSize: 9, opacity: .8, fontWeight: 400, marginTop: 1 }}>
                        {col.dates}
                      </span>
                    </div>
                  </div>
                  {ci < BRACKET_COLS.length - 1 && (
                    <div style={{ width: CONN_W, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Columns + SVG connectors */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {BRACKET_COLS.map((col, ci) => {
                const count = col.ids.length
                return (
                  <div key={col.label} style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {/* Card column */}
                    <div style={{ width: COL_W, height: BKT_H, position: 'relative', flexShrink: 0 }}>
                      {col.ids.map((id, idx) => {
                        const m = KNOCKOUT_MATCHES.find(x => x.id === id)
                        if (!m) return null
                        const pick = picks[m.id]
                        const homeDisplay = m.home.name ?? m.home.placeholder
                        const awayDisplay = m.away.name ?? m.away.placeholder
                        const top = cardTop(idx, count)
                        return (
                          <div
                            key={id}
                            onClick={() => m.isOpenForPredictions ? setView('llenado') : undefined}
                            style={{
                              position: 'absolute',
                              left: 0, right: 0, top,
                              height: CARD_H,
                              background: pick ? '#f0fdf4' : 'white',
                              border: `1px solid ${pick ? '#86efac' : '#e2e8f0'}`,
                              borderRadius: 8,
                              padding: '3px 7px',
                              cursor: m.isOpenForPredictions ? 'pointer' : 'default',
                              overflow: 'hidden',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 1, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              #{m.fifaMatchNumber} · {m.displayTime} · {m.city}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden' }}>
                              <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{m.home.flag ?? '🛡️'}</span>
                              <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{homeDisplay}</span>
                              {pick && <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', flexShrink: 0 }}>{pick.home}</span>}
                            </div>
                            <div style={{ height: 0.5, background: '#e2e8f0', margin: '2px 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden' }}>
                              <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{m.away.flag ?? '🛡️'}</span>
                              <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{awayDisplay}</span>
                              {pick && <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', flexShrink: 0 }}>{pick.away}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* SVG connector to next column */}
                    {ci < BRACKET_COLS.length - 1 && (
                      <div style={{ width: CONN_W, height: BKT_H, flexShrink: 0 }}>
                        {connectorSVG(count)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3rd place match */}
        {m3rd && (() => {
          const pick3 = picks[m3rd.id]
          return (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                3.er y 4.º Lugar · 18 jul · Hard Rock Stadium · Miami
              </p>
              <div className={`bg-white border rounded-xl p-3 ${pick3 ? 'border-green-200' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none shrink-0">{m3rd.home.flag ?? '🛡️'}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                    {m3rd.home.placeholder}
                  </span>
                  <span className={`shrink-0 font-extrabold text-sm ${pick3 ? 'text-slate-800' : 'text-slate-300'}`}>
                    {pick3 ? `${pick3.home} – ${pick3.away}` : 'vs'}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-700 truncate text-right">
                    {m3rd.away.placeholder}
                  </span>
                  <span className="text-lg leading-none shrink-0">{m3rd.away.flag ?? '🛡️'}</span>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    )
  }

  // ── MI QUINIELA ─────────────────────────────────────────────────────────────

  function renderMiQuiniela() {
    const allOpen = KNOCKOUT_MATCHES.filter(m => m.isOpenForPredictions)
    const filled  = allOpen.filter(m => picks[m.id] !== undefined).length
    const pct     = allOpen.length > 0 ? Math.round(filled / allOpen.length * 100) : 0

    // Determine if we're showing the registered user's quiniela or search mode
    const showQuiniela = registered || miqFound || filledCount > 0
    const displayName  = registered ? regForm.nombre || DEMO_NAME : DEMO_NAME
    const displayCed   = registered ? regForm.cedula || DEMO_CEDULA : DEMO_CEDULA

    // Search handler (demo: matches cedula or WhatsApp)
    function handleSearch() {
      const q = miqQuery.trim()
      if (q === DEMO_CEDULA || q === DEMO_WA || q === '04141234567' || q.toLowerCase() === 'carlos') {
        setMiqFound(true)
      } else {
        setToast('❌ No se encontró ninguna quiniela con ese dato')
      }
    }

    if (!showQuiniela) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Search card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📋</div>
              <h2 className="text-xl font-extrabold text-slate-800 mb-1">Buscar mi quiniela</h2>
              <p className="text-sm text-slate-500">Ingresa tu cédula o WhatsApp para ver tu quiniela.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cédula o WhatsApp</label>
                <input
                  type="text"
                  value={miqQuery}
                  onChange={e => setMiqQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Ej: 12345678  ó  04141234567"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 font-mono"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all active:scale-95"
              >
                🔍 Buscar quiniela
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-700 font-semibold mb-1">¿No tienes quiniela todavía?</p>
            <button
              onClick={() => setView('registro')}
              className="text-xs text-blue-600 underline font-bold"
            >
              Inscribirme ahora →
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            Demo: prueba con cédula <strong>12345678</strong> o WhatsApp <strong>04141234567</strong>
          </p>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
        {/* Header card */}
        <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl p-5 text-white mb-5 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-green-200 text-xs font-semibold">Quiniela Eliminatorias 2026</p>
              <p className="text-xl font-extrabold mt-0.5">{displayName}</p>
            </div>
            {/* Cédula mascarada — no código */}
            <div className="bg-white/15 border border-white/30 rounded-xl px-3 py-2 text-right shrink-0 ml-3">
              <p className="text-xs text-green-200">Cédula</p>
              <p className="font-extrabold text-sm tracking-wider font-mono">{maskCedula(displayCed)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-yellow-400 text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full">
              Eliminatorias 2026
            </span>
            <span className="bg-green-500/30 border border-green-400/30 text-green-100 text-xs px-2.5 py-1 rounded-full">
              {pct}% completado
            </span>
            {confirmed && (
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                ✅ Confirmada
              </span>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { val: '#1',        label: 'Posición',   color: 'text-yellow-600' },
            { val: '28 pts',    label: 'Puntos',     color: 'text-green-600' },
            { val: `${filled}`, label: 'Llenados',   color: 'text-emerald-600' },
            { val: '6',         label: '🎯 Exactos', color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 text-center">
              <p className={`text-lg font-extrabold leading-tight ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">Progreso total</span>
            <span className="font-extrabold text-green-600">{filled}/{allOpen.length}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 text-right">{pct}% completado</p>
        </div>

        {/* Predictions by stage */}
        <h2 className="font-extrabold text-slate-800 mb-3">Mis pronósticos por etapa</h2>
        <div className="space-y-4">
          {STAGES.map(s => {
            const open = openMatches(s)
            if (open.length === 0) return null
            const done = stageComplete(s, picks)
            const stageFilled = open.filter(m => picks[m.id]).length
            return (
              <div key={s} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className={`px-4 py-3 flex items-center justify-between ${done ? 'bg-green-50 border-b border-green-100' : 'bg-slate-50 border-b border-slate-100'}`}>
                  <span className="font-bold text-slate-800 text-sm">{STAGE_META[s].label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${done ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-500'}`}>
                    {stageFilled}/{open.length}
                  </span>
                </div>
                {stageFilled === 0 ? (
                  <div className="px-4 py-4 text-xs text-slate-400 italic">Sin pronósticos todavía.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {open.map(m => {
                      const pick = picks[m.id]
                      const homeDisplay = m.home.name || m.home.placeholder
                      const awayDisplay = m.away.name || m.away.placeholder
                      return (
                        <div key={m.id} className={`px-4 py-3 flex items-center gap-2 ${!pick ? 'opacity-40' : ''}`}>
                          <span className="text-lg shrink-0 leading-none">{m.home.flag || '⬜'}</span>
                          <span className="flex-1 text-slate-600 text-xs truncate">{homeDisplay}</span>
                          <span className="font-extrabold text-slate-900 shrink-0 text-sm tabular-nums">
                            {pick ? `${pick.home} – ${pick.away}` : '—'}
                          </span>
                          <span className="flex-1 text-slate-600 text-xs truncate text-right">{awayDisplay}</span>
                          <span className="text-lg shrink-0 leading-none">{m.away.flag || '⬜'}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setView('llenado')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 text-base shadow-lg transition-all active:scale-95 touch-manipulation"
          >
            ✏️ Editar pronósticos
          </button>
          {filled === totalOpenCount && !confirmed && (
            <button
              onClick={() => { storePicks(picks); setConfirmed(true); setToast('🎉 ¡Quiniela confirmada!') }}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 text-base shadow-lg transition-all active:scale-95 touch-manipulation"
            >
              ✅ Confirmar quiniela
            </button>
          )}
          {confirmed && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-green-700 font-extrabold text-base">¡Quiniela confirmada!</p>
              <p className="text-green-600 text-sm mt-1">Cédula: <strong className="font-mono">{maskCedula(displayCed)}</strong></p>
            </div>
          )}
          {miqFound && !registered && (
            <button
              onClick={() => { setMiqFound(false); setMiqQuery('') }}
              className="w-full border border-slate-200 text-slate-500 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-all"
            >
              ← Buscar otra quiniela
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── RANKING ─────────────────────────────────────────────────────────────────

  function renderRanking() {
    const top3 = DEMO_RANKING.slice(0, 3)
    const rest = DEMO_RANKING.slice(3)

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl p-5 text-white mb-5 shadow-lg">
          <h1 className="text-xl font-extrabold mb-0.5">🏆 Ranking Eliminatorias</h1>
          <p className="text-green-200 text-sm mb-4">Mundial 2026 · Fase eliminatoria · Demo</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-extrabold text-yellow-400">{DEMO_RANKING.length}</p>
              <p className="text-xs text-green-200 mt-0.5">Participantes</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-yellow-400">0</p>
              <p className="text-xs text-green-200 mt-0.5">Partidos jugados</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-yellow-400 truncate">{top3[0].name.split(' ')[0]}</p>
              <p className="text-xs text-green-200 mt-0.5">Líder actual</p>
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-600 mb-5 text-center uppercase tracking-wide">Pódio</h2>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            <div className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
              <div className="w-11 h-11 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center font-extrabold text-slate-600 text-base">
                {top3[1].name[0]}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">{top3[1].name.split(' ')[0]}</p>
                <p className="text-sm font-extrabold text-slate-500">{top3[1].pts}</p>
                <p className="text-xs text-slate-400">pts</p>
              </div>
              <div className="w-full bg-slate-200 rounded-t-xl flex items-center justify-center" style={{ height: 64 }}>
                <span className="text-2xl">🥈</span>
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
              <Trophy size={18} className="text-yellow-500" />
              <div className="w-14 h-14 rounded-full bg-yellow-400 border-4 border-yellow-300 flex items-center justify-center font-extrabold text-slate-900 text-xl shadow-lg">
                {top3[0].name[0]}
              </div>
              <div className="text-center">
                <p className="text-sm font-extrabold text-slate-800">{top3[0].name.split(' ')[0]}</p>
                <p className="text-base font-extrabold text-yellow-600">{top3[0].pts}</p>
                <p className="text-xs text-slate-400">pts</p>
              </div>
              <div className="w-full bg-yellow-400 rounded-t-xl flex items-center justify-center shadow-md" style={{ height: 96 }}>
                <span className="text-3xl">🥇</span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
              <div className="w-11 h-11 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center font-extrabold text-amber-700 text-base">
                {top3[2].name[0]}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">{top3[2].name.split(' ')[0]}</p>
                <p className="text-sm font-extrabold text-amber-600">{top3[2].pts}</p>
                <p className="text-xs text-slate-400">pts</p>
              </div>
              <div className="w-full bg-amber-200 rounded-t-xl flex items-center justify-center" style={{ height: 44 }}>
                <span className="text-2xl">🥉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="grid gap-0 text-xs font-bold text-slate-500 bg-slate-50 border-b border-slate-200 px-3 py-2.5"
            style={{ gridTemplateColumns: '36px 1fr 44px 36px 36px 28px' }}>
            <span className="text-center">#</span>
            <span>Participante</span>
            <span className="text-center">Pts</span>
            <span className="text-center">🎯</span>
            <span className="text-center">✅</span>
            <span />
          </div>

          {/* Top 3 */}
          {top3.map(r => {
            const isMe = r.name === DEMO_NAME
            return (
              <div
                key={`${r.pos}-${r.name}`}
                className={`grid gap-0 px-3 py-3 items-center border-b border-slate-100 ${
                  isMe ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : r.pos === 1 ? 'bg-yellow-50/50' : ''
                }`}
                style={{ gridTemplateColumns: '36px 1fr 44px 36px 36px 28px' }}
              >
                <span className="text-center font-extrabold text-base">
                  {r.pos === 1 ? '🥇' : r.pos === 2 ? '🥈' : '🥉'}
                </span>
                <span className="font-semibold text-slate-800 text-xs truncate">{r.name}</span>
                <span className="text-center font-extrabold text-slate-900 text-sm">{r.pts}</span>
                <span className="text-center text-slate-600 text-xs">{r.exact}</span>
                <span className="text-center text-slate-600 text-xs">{r.correct}</span>
                <span className="flex items-center justify-center">
                  {r.move > 0 ? <TrendingUp size={13} className="text-green-500" /> :
                   r.move < 0 ? <TrendingDown size={13} className="text-red-400" /> :
                   <span className="text-slate-300 text-[10px]">—</span>}
                </span>
              </div>
            )
          })}

          {/* Rest */}
          {rest.map(r => {
            const isMe = r.name === DEMO_NAME
            return (
              <div
                key={`${r.pos}-${r.name}`}
                className={`grid gap-0 px-3 py-3 items-center border-b border-slate-100 last:border-b-0 ${isMe ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}
                style={{ gridTemplateColumns: '36px 1fr 44px 36px 36px 28px' }}
              >
                <span className="text-center font-bold text-slate-400 text-xs">{r.pos}</span>
                <span className="font-medium text-slate-700 text-xs truncate">{r.name}</span>
                <span className="text-center font-extrabold text-slate-900 text-sm">{r.pts}</span>
                <span className="text-center text-slate-500 text-xs">{r.exact}</span>
                <span className="text-center text-slate-500 text-xs">{r.correct}</span>
                <span className="flex items-center justify-center">
                  {r.move > 0 ? <TrendingUp size={13} className="text-green-500" /> :
                   r.move < 0 ? <TrendingDown size={13} className="text-red-400" /> :
                   <span className="text-slate-300 text-[10px]">—</span>}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-400 text-center mt-4 pb-4">
          Se actualizará con resultados reales al inicio del torneo
        </p>
      </div>
    )
  }

  // ── ESTADÍSTICAS ─────────────────────────────────────────────────────────────

  function renderEstadisticas() {
    const activeCat = STAT_CATEGORIES.find(c => c.id === statTab)!
    const isTeams   = statTab === 'teams'
    const players   = isTeams ? [] : DEMO_STATS[statTab as Exclude<StatCategoryId, 'teams'>]
    const pendingCount = pendingEvents.filter(e => e.status === 'pending').length

    return (
      <div className="max-w-2xl mx-auto px-3 py-5 pb-28">

        {/* Pending badge */}
        {pendingCount > 0 && (
          <button
            onClick={() => setView('admin')}
            className="w-full flex items-center justify-between bg-amber-400 text-slate-900 rounded-xl px-4 py-2.5 mb-3 text-xs font-bold touch-manipulation hover:bg-amber-300 transition-colors"
          >
            <span>⚠️ {pendingCount} evento{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de revisión</span>
            <span className="underline">Revisar →</span>
          </button>
        )}

        {/* Header card — dark Google-style */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl mb-4">
          <div className="px-5 pt-5 pb-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white text-xl font-extrabold tracking-tight">Estadísticas</h1>
                <p className="text-slate-400 text-xs mt-0.5">Quiniela Eliminatorias 2026</p>
              </div>
              {/* Last update */}
              <div className="text-right shrink-0 ml-3">
                {statLastUpdate ? (
                  <p className="text-green-400 text-[10px] font-semibold leading-tight">
                    ✓ Actualizado<br />
                    <span className="text-slate-400">{statLastUpdate}</span>
                  </p>
                ) : (
                  <p className="text-slate-500 text-[10px]">datos demo</p>
                )}
              </div>
            </div>

            {/* Tabs — scrollable on mobile */}
            <div className="flex gap-0 overflow-x-auto -mx-1 px-1 mt-4" style={{ scrollbarWidth: 'none' }}>
              {STAT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setStatTab(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap touch-manipulation ${
                    statTab === cat.id
                      ? 'text-white border-blue-400'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Jugadores ── */}
          {!isTeams && (
            <div className="divide-y divide-slate-800">
              <div className="grid px-4 py-2 bg-slate-800/60"
                style={{ gridTemplateColumns: '28px 40px 1fr 48px' }}>
                <span className="text-[10px] text-slate-500 font-bold">#</span>
                <span />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Jugador</span>
                <span className="text-[10px] text-slate-500 font-bold text-right uppercase tracking-wide">
                  {activeCat.unitShort}
                </span>
              </div>

              {players.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="grid items-center px-4 py-3 hover:bg-slate-800/50 transition-colors"
                  style={{ gridTemplateColumns: '28px 40px 1fr 48px' }}
                >
                  <span className={`text-sm font-extrabold tabular-nums ${
                    p.rank === 1 ? 'text-yellow-400' : 'text-slate-500'
                  }`}>
                    {p.rank}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ring-2 ring-slate-700"
                    style={{ backgroundColor: p.color + '22', color: p.color }}
                  >
                    {p.initials}
                  </div>
                  <div className="pl-2 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{p.name}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <span>{p.flag}</span>
                      <span className="truncate">{p.country}</span>
                    </p>
                  </div>
                  <span className="text-white text-lg font-extrabold text-right tabular-nums">
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Equipos ── */}
          {isTeams && (
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                {/* Header */}
                <div className="grid px-4 py-2 bg-slate-800/60 text-[10px] font-bold text-slate-500 uppercase tracking-wide"
                  style={{ gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 48px 48px 40px' }}>
                  <span>#</span><span>Equipo</span>
                  <span className="text-center">PJ</span><span className="text-center">G</span>
                  <span className="text-center">E</span><span className="text-center">P</span>
                  <span className="text-center">GF</span><span className="text-center">GC</span>
                  <span className="text-center">DG</span>
                </div>
                {DEMO_TEAM_STATS.map(t => (
                  <div
                    key={t.code}
                    className="grid items-center px-4 py-2.5 border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    style={{ gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 48px 48px 40px' }}
                  >
                    <span className={`text-sm font-extrabold tabular-nums ${t.rank === 1 ? 'text-yellow-400' : 'text-slate-500'}`}>{t.rank}</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base leading-none shrink-0">{t.flag}</span>
                      <span className="text-white text-xs font-semibold truncate">{t.name}</span>
                    </div>
                    <span className="text-slate-400 text-xs text-center">{t.played}</span>
                    <span className="text-green-400 text-xs text-center font-bold">{t.wins}</span>
                    <span className="text-slate-400 text-xs text-center">{t.draws}</span>
                    <span className="text-red-400 text-xs text-center">{t.losses}</span>
                    <span className="text-white text-xs text-center font-semibold">{t.goalsFor}</span>
                    <span className="text-slate-400 text-xs text-center">{t.goalsAgainst}</span>
                    <span className={`text-xs text-center font-extrabold tabular-nums ${
                      t.goalDiff > 0 ? 'text-green-400' : t.goalDiff < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {t.goalDiff > 0 ? '+' : ''}{t.goalDiff}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between">
            <p className="text-[10px] text-slate-500">⚠️ Datos demo · no son estadísticas oficiales</p>
            <button
              onClick={() => setView('admin')}
              className="text-[10px] text-slate-400 hover:text-white underline transition-colors"
            >
              Admin →
            </button>
          </div>
        </div>

        <button
          onClick={() => setView('home')}
          className="w-full text-slate-400 text-xs py-2 hover:text-slate-600 transition-colors"
        >
          ← Volver al inicio
        </button>
      </div>
    )
  }

  // ── ADMIN DEMO ───────────────────────────────────────────────────────────────

  // Demo participants with full cedula (visible only in admin)
  const DEMO_PARTICIPANTS = [
    { name: 'Carlos Demo',    cedula: '12345678',  wa: '04141234567', ciudad: 'Caracas',   email: 'carlos@demo.com',  pts: 28 },
    { name: 'María Delgado',  cedula: '8765432',   wa: '04121234567', ciudad: 'Valencia',  email: '',                 pts: 25 },
    { name: 'Laura Bracho',   cedula: '15234567',  wa: '04261234567', ciudad: 'Maracaibo', email: 'laura@demo.com',   pts: 22 },
    { name: 'José Martínez',  cedula: '10234567',  wa: '04141234568', ciudad: 'Barquisimeto', email: '',              pts: 20 },
    { name: 'Ana Rodríguez',  cedula: '18234567',  wa: '04241234567', ciudad: 'Caracas',   email: '',                 pts: 18 },
    { name: 'Pedro Gómez',    cedula: '9234567',   wa: '04161234567', ciudad: 'Maracay',   email: '',                 pts: 16 },
    { name: 'Diana Torres',   cedula: '20234567',  wa: '04121234568', ciudad: 'Caracas',   email: '',                 pts: 14 },
    { name: 'Rafael López',   cedula: '11234567',  wa: '04141234569', ciudad: 'Valencia',  email: '',                 pts: 12 },
  ]

  function renderAdmin() {
    const q = adminSearch.toLowerCase().trim()
    const filtered = q === ''
      ? DEMO_PARTICIPANTS
      : DEMO_PARTICIPANTS.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.cedula.includes(q) ||
          p.wa.includes(q)
        )

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-slate-800 text-white rounded-2xl p-5 mb-5 shadow-lg">
          <h1 className="text-xl font-extrabold mb-0.5">⚙️ Panel Admin Demo</h1>
          <p className="text-slate-400 text-sm">Solo revisión interna · Sin conexión a producción</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Partidos abiertos',  val: totalOpenCount,              icon: '⚽' },
            { label: 'Picks en sesión',    val: Object.keys(picks).length,   icon: '📝' },
            { label: 'Etapa actual',       val: STAGE_META[activeStage].short, icon: '📍' },
            { label: 'Participantes',      val: DEMO_PARTICIPANTS.length,    icon: '👥' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-extrabold text-slate-800">{s.val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Participant search */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-700 text-sm">👥 Participantes</h2>
            <span className="text-xs text-slate-400">{filtered.length} / {DEMO_PARTICIPANTS.length}</span>
          </div>
          <div className="px-4 py-3 border-b border-slate-100">
            <input
              type="text"
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              placeholder="Buscar por nombre, cédula o WhatsApp…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500"
            />
          </div>
          {/* Table header */}
          <div className="grid px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500"
            style={{ gridTemplateColumns: '1fr 90px 100px 40px' }}>
            <span>Participante</span>
            <span>Cédula</span>
            <span>WhatsApp</span>
            <span className="text-center">Pts</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-xs text-slate-400 text-center italic">Sin resultados</div>
          ) : (
            filtered.map(p => (
              <div
                key={p.cedula}
                className="grid px-3 py-2.5 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50 transition-colors"
                style={{ gridTemplateColumns: '1fr 90px 100px 40px' }}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                  {p.ciudad && <p className="text-[10px] text-slate-400">{p.ciudad}</p>}
                </div>
                {/* Cédula completa visible en admin */}
                <span className="text-xs font-mono text-slate-600">V-{p.cedula}</span>
                <span className="text-xs text-slate-500">{p.wa}</span>
                <span className="text-xs font-extrabold text-green-700 text-center">{p.pts}</span>
              </div>
            ))
          )}
        </div>

        {/* Simulate match finished */}
        <div className="bg-slate-900 rounded-2xl p-5 mb-5 shadow-lg">
          <h2 className="text-white font-extrabold text-sm mb-1">🔁 Simular partido finalizado</h2>
          <p className="text-slate-400 text-xs mb-4">
            Simula el ciclo completo: resultado → ranking → estadísticas → logs.<br />
            Basado en: <span className="text-green-400 font-bold">{SIMULATED_MATCH.matchLabel}</span> (#{SIMULATED_MATCH.fifaMatchNumber})
          </p>
          <button
            disabled={statSimRunning}
            onClick={() => {
              setStatSimRunning(true)
              setStatSimLogs([])
              let i = 0
              const interval = setInterval(() => {
                if (i < SIMULATED_MATCH.logs.length) {
                  setStatSimLogs(prev => [...prev, SIMULATED_MATCH.logs[i]])
                  i++
                } else {
                  clearInterval(interval)
                  setStatSimRunning(false)
                  setStatLastUpdate(`Partido #${SIMULATED_MATCH.fifaMatchNumber} · ${SIMULATED_MATCH.matchLabel}`)
                  setToast('✅ Estadísticas actualizadas (simulación)')
                }
              }, 500)
            }}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-extrabold py-3 rounded-xl text-sm transition-all touch-manipulation"
          >
            {statSimRunning ? '⏳ Ejecutando…' : '▶ Simular partido finalizado'}
          </button>

          {statSimLogs.length > 0 && (
            <div className="mt-3 bg-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-1">
              {statSimLogs.map((log, i) => (
                <p key={i} className={`${log.startsWith('STATS_APPLIED') ? 'text-green-400' : log.startsWith('STATS_SKIP') ? 'text-yellow-400' : 'text-slate-300'}`}>
                  {log}
                </p>
              ))}
              {!statSimRunning && <p className="text-blue-400 mt-1">✓ Proceso completado</p>}
            </div>
          )}
        </div>

        {/* Pending events review */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-700 text-sm">📋 Estadísticas pendientes</h2>
            {pendingEvents.filter(e => e.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {pendingEvents.filter(e => e.status === 'pending').length} pendientes
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 px-4 py-2 border-b border-slate-100 bg-slate-50/50">
            Eventos detectados con confianza media/baja · Requieren revisión antes de aplicarse
          </p>
          {pendingEvents.length === 0 ? (
            <div className="px-4 py-6 text-xs text-slate-400 text-center italic">Sin eventos pendientes</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingEvents.map(ev => (
                <div key={ev.id} className={`px-4 py-3 ${ev.status !== 'pending' ? 'opacity-40' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">{ev.matchLabel}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-base">{ev.flag}</span>
                        <span className="text-sm font-bold text-slate-800">{ev.playerName}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ev.eventType === 'GOAL'        ? 'bg-green-100 text-green-700' :
                          ev.eventType === 'ASSIST'      ? 'bg-blue-100 text-blue-700'  :
                          ev.eventType === 'YELLOW_CARD' ? 'bg-amber-100 text-amber-700':
                                                           'bg-red-100 text-red-700'
                        }`}>
                          {ev.eventType === 'GOAL' ? '⚽ Gol' : ev.eventType === 'ASSIST' ? '🅰️ Asistencia' : ev.eventType === 'YELLOW_CARD' ? '🟨 Amarilla' : '🟥 Roja'}
                        </span>
                        <span className="text-[10px] text-slate-400">min. {ev.minute}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Fuente: <span className="font-semibold">{ev.source}</span> ·{' '}
                        Confianza:{' '}
                        <span className={`font-extrabold ${
                          ev.confidence === 'high' ? 'text-green-600' :
                          ev.confidence === 'medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>{ev.confidence}</span>
                      </p>
                    </div>
                    {ev.status !== 'pending' && (
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg shrink-0 ${
                        ev.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {ev.status === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
                      </span>
                    )}
                  </div>
                  {ev.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPendingEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'approved' } : e))
                          setToast(`✅ Aprobado: ${ev.playerName} — ${ev.eventType}`)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-all touch-manipulation"
                      >
                        ✓ Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setPendingEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'rejected' } : e))
                          setToast(`🗑 Rechazado: ${ev.playerName}`)
                        }}
                        className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-lg transition-all touch-manipulation"
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setView('estadisticas')}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all touch-manipulation"
          >
            📈 Ver panel de estadísticas
          </button>
          <button
            onClick={() => { setPicks({}); storePicks({}); setToast('🗑 Picks borrados') }}
            className="w-full bg-red-50 border border-red-200 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-100 transition-all touch-manipulation"
          >
            🗑 Borrar todos los picks demo
          </button>
          <button
            onClick={() => { setActiveStage('R32'); setView('llenado') }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all touch-manipulation"
          >
            🔄 Ir a Dieciseisavos de final
          </button>
          <button
            onClick={() => setView('home')}
            className="w-full bg-green-50 border border-green-200 text-green-700 font-bold py-3.5 rounded-xl hover:bg-green-100 transition-all touch-manipulation"
          >
            🏠 Ver como participante
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 font-extrabold text-sm mb-3">⚠️ Confirmación de aislamiento</p>
          <ul className="text-xs text-amber-700 space-y-1.5">
            {[
              'Sin conexión a base de datos real',
              'Sin Prisma ni migraciones',
              'Sin modificar participantes reales',
              'Sin afectar ranking real',
              'Sin tocar fase de grupos actual',
              'Sin automatización real de resultados',
              'Datos almacenados en sessionStorage solamente',
            ].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle size={12} className="text-green-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ── REGISTRO ────────────────────────────────────────────────────────────────

  function renderRegistro() {
    function validate() {
      const errs: Record<string, string> = {}
      if (!regForm.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
      if (!regForm.cedula.trim()) {
        errs.cedula = 'La cédula es obligatoria'
      } else if (!/^\d{6,10}$/.test(regForm.cedula.trim())) {
        errs.cedula = 'Solo números, entre 6 y 10 dígitos'
      }
      if (!regForm.whatsapp.trim()) {
        errs.whatsapp = 'El WhatsApp es obligatorio'
      } else if (!/^04\d{9}$/.test(regForm.whatsapp.replace(/[\s\-]/g, ''))) {
        errs.whatsapp = 'Formato venezolano: 04XXXXXXXXX'
      }
      return errs
    }

    function handleSubmit() {
      const errs = validate()
      setRegErrors(errs)
      if (Object.keys(errs).length === 0) {
        setRegistered(true)
        setToast('✅ ¡Inscripción exitosa! Ahora llena tu quiniela.')
        setView('llenado')
      }
    }

    const field = (
      id: keyof typeof regForm,
      label: string,
      placeholder: string,
      required: boolean,
      hint?: string,
      type = 'text'
    ) => (
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={regForm[id]}
          onChange={e => setRegForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
            regErrors[id] ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-green-500'
          }`}
        />
        {hint && !regErrors[id] && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
        {regErrors[id] && <p className="text-[10px] text-red-500 mt-1">⚠ {regErrors[id]}</p>}
      </div>
    )

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
          <button
            onClick={() => setView('home')}
            className="text-green-200 text-xs mb-3 flex items-center gap-1 hover:text-white"
          >
            ← Volver
          </button>
          <h1 className="text-xl font-extrabold mb-0.5">📝 Inscripción</h1>
          <p className="text-green-200 text-sm">Quiniela Eliminatorias 2026 · Mundial 2026</p>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-xs text-blue-700">
          <strong>Tu cédula es tu identificador.</strong> La usarás para acceder a tu quiniela en cualquier momento. No necesitas recordar ningún código adicional.
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 mb-6">
          {field('nombre',   'Nombre completo',     'Ej: Carlos Eduardo Acosta',    true)}
          {field('cedula',   'Cédula de identidad', 'Ej: 12345678',                 true,  'Solo números, sin V- ni E-')}
          {field('whatsapp', 'WhatsApp',             'Ej: 04141234567',              true,  'Número venezolano: 04XXXXXXXXX', 'tel')}
          {field('ciudad',   'Ciudad',               'Ej: Caracas',                  false)}
          {field('email',    'Email',                'Ej: correo@ejemplo.com',       false, undefined, 'email')}
        </div>

        {/* Privacy note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-xs text-slate-500 space-y-1">
          <p>🔒 <strong>Privacidad:</strong> tu cédula no se mostrará completa en el ranking público.</p>
          <p>🚫 Una cédula puede inscribirse <strong>una sola vez</strong> en esta quiniela eliminatoria.</p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg transition-all active:scale-95 touch-manipulation"
        >
          ✅ Inscribirme en la quiniela
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-3">
          Vista previa interna · Datos de prueba
        </p>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo banner */}
      <div className="bg-amber-400 text-slate-900 text-xs font-bold py-1.5 text-center px-4 flex items-center justify-center gap-2 flex-wrap">
        <span>🔒 PROTOTIPO PRIVADO · Sin conexión a producción</span>
        <button
          onClick={() => setView('admin')}
          className="underline text-slate-700 hover:text-slate-900"
        >
          Panel admin
        </button>
      </div>

      {/* Navigation tabs */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center py-2.5 px-1 text-[10px] font-semibold transition-colors touch-manipulation border-b-2 ${
                  view === item.id
                    ? 'text-green-600 border-green-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-base leading-none mb-0.5">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>
        {view === 'home'          && renderHome()}
        {view === 'registro'      && renderRegistro()}
        {view === 'llenado'       && renderLlenado()}
        {view === 'bracket'       && renderBracket()}
        {view === 'mi-quiniela'   && renderMiQuiniela()}
        {view === 'ranking'       && renderRanking()}
        {view === 'estadisticas'  && renderEstadisticas()}
        {view === 'admin'         && renderAdmin()}
      </main>

      {/* Global toast (outside llenado which has its own) */}
      {toast && view !== 'llenado' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-green-700 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
