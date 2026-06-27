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
  Users, Clock, Star, Shield, BarChart2, ChevronDown, ChevronUp,
} from 'lucide-react'
import {
  KNOCKOUT_MATCHES, STAGE_META, DEMO_RANKING,
  type KOMatch, type Stage,
} from '@/lib/prototype/knockout-data'
import {
  KO_DEMO_RANKING, loadKOEnrolled, saveKOEnrolled, findEnrolled,
  type KOParticipant,
} from '@/lib/prototype/knockout-participants'
import {
  STAT_CATEGORIES, DEMO_GOALS, DEMO_STATS, DEMO_TEAM_STATS, DEMO_PENDING_EVENTS, SIMULATED_MATCH,
  type StatCategory, type StatCategoryId, type PendingMatchEvent,
} from '@/lib/prototype/knockout-stats'

// ── Types ──────────────────────────────────────────────────────────────────────

type View = 'home' | 'llenado' | 'bracket' | 'mi-quiniela' | 'ranking' | 'estadisticas' | 'admin' | 'registro' | 'resultados'
type RegStep = 'choose' | 'lookup' | 'found' | 'not-found' | 'already-enrolled' | 'new'
type Pick = { home: number; away: number; penaltyWinner?: 'home' | 'away' }
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

// A pick is "complete" only if it has a score AND, when it's a draw, a penaltyWinner too.
function pickComplete(p: Pick | undefined): boolean {
  if (!p) return false
  if (p.home === p.away && !p.penaltyWinner) return false  // draw without penalty winner
  return true
}

function openMatches(s: Stage) {
  return KNOCKOUT_MATCHES.filter(m => m.stage === s && m.isOpenForPredictions)
}
function allMatches(s: Stage) {
  return KNOCKOUT_MATCHES.filter(m => m.stage === s)
}
function stageComplete(s: Stage, picks: Picks) {
  const open = openMatches(s)
  return open.length > 0 && open.every(m => pickComplete(picks[m.id]))
}
function stagePartial(s: Stage, picks: Picks) {
  const open = openMatches(s)
  return open.some(m => picks[m.id] !== undefined) && !stageComplete(s, picks)
}
function totalOpen() {
  return KNOCKOUT_MATCHES.filter(m => m.isOpenForPredictions).length
}
function totalFilled(picks: Picks) {
  return KNOCKOUT_MATCHES.filter(m => m.isOpenForPredictions && pickComplete(picks[m.id])).length
}

// ── Flag helpers ───────────────────────────────────────────────────────────────
// Windows browsers don't render Unicode regional indicator flag emoji.
// Convert the emoji to a 2-letter ISO code and serve the flag as a PNG from flagcdn.com.

function emojiToFlagUrl(flag: string | null | undefined): string | null {
  if (!flag) return null
  try {
    const codePoints = [...flag].map(c => c.codePointAt(0)!)
    if (codePoints.length < 2) return null
    const iso2 = codePoints.map(cp => String.fromCharCode(cp - 0x1F1E6 + 65)).join('').toLowerCase()
    if (!/^[a-z]{2}$/.test(iso2)) return null
    return `https://flagcdn.com/w40/${iso2}.png`
  } catch { return null }
}

function FlagImg({ flag, size = 28, className = '' }: { flag: string | null | undefined; size?: number; className?: string }) {
  const url = emojiToFlagUrl(flag)
  if (!url) return <span className={`inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-400 text-xs font-bold ${className}`} style={{ width: size, height: size }}>?</span>
  return <img src={url} alt="" width={size} height={Math.round(size * 0.67)} className={`inline-block object-cover rounded-sm shrink-0 ${className}`} style={{ width: size, height: Math.round(size * 0.67) }} />
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
      <div className="w-9 h-9 shrink-0 flex items-center justify-center">
        <FlagImg flag={flag} size={32} />
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
  const hasPick    = pick !== undefined
  const current    = pick ?? { home: 0, away: 0 }
  const locked     = !match.isOpenForPredictions
  const isDraw     = hasPick && current.home === current.away
  const isComplete = pickComplete(pick)   // draw without penaltyWinner → false

  const homeName = match.home.name ?? match.home.placeholder
  const awayName = match.away.name ?? match.away.placeholder

  const dateObj = new Date(match.date + 'T12:00:00')
  const dateStr = dateObj.toLocaleDateString('es-VE', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Caracas',
  })

  // When score changes: if no longer a draw, remove penaltyWinner
  function handleScoreChange(field: 'home' | 'away', v: number) {
    const next = { ...current, [field]: v }
    if (next.home !== next.away) {
      onPick(match.id, { home: next.home, away: next.away })
    } else {
      onPick(match.id, next)
    }
  }

  return (
    <article
      className={`bg-white rounded-2xl border-2 p-4 transition-all duration-200 ${
        highlight
          ? 'border-amber-400 shadow-lg ring-2 ring-amber-300/50'
          : isComplete
          ? 'border-green-300 shadow-sm'
          : isDraw
          ? 'border-amber-300 shadow-sm'
          : hasPick
          ? 'border-green-200 shadow-sm'
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
                onChange={v => handleScoreChange('home', v)}
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
                onChange={v => handleScoreChange('away', v)}
                disabled={locked}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── PENALTY WINNER (only when draw predicted) ── */}
      {hasPick && isDraw && !locked && (
        <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-800 mb-2.5 flex items-center gap-1.5">
            ⚖️ Empate — ¿Quién gana por penales?
            <span className="font-normal text-amber-600">(obligatorio)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPick(match.id, { ...current, penaltyWinner: 'home' })}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all touch-manipulation ${
                current.penaltyWinner === 'home'
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><FlagImg flag={match.home.flag} size={16} /> {homeName.length > 14 ? homeName.split(' ')[0] : homeName}</span>
            </button>
            <button
              onClick={() => onPick(match.id, { ...current, penaltyWinner: 'away' })}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all touch-manipulation ${
                current.penaltyWinner === 'away'
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><FlagImg flag={match.away.flag} size={16} /> {awayName.length > 14 ? awayName.split(' ')[0] : awayName}</span>
            </button>
          </div>
          {!current.penaltyWinner && (
            <p className="text-[10px] text-amber-600 mt-2 text-center">
              ⚠️ Debes elegir un ganador por penales para que tu pronóstico sea válido.
            </p>
          )}
        </div>
      )}

      {/* Footer: venue · status */}
      <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-2 ${
        isComplete ? 'border-green-100' : isDraw ? 'border-amber-100' : 'border-slate-100'
      }`}>
        <p className="text-xs text-slate-400 min-w-0 truncate">
          📍 {match.venue} · {match.city}
        </p>
        {isComplete && (
          <span className="text-xs font-bold text-green-600 flex items-center gap-1 shrink-0">
            <CheckCircle size={11} /> Listo
          </span>
        )}
        {isDraw && !current.penaltyWinner && (
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 shrink-0">
            ⚠️ Falta penales
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
  const matchListTopRef   = useRef<HTMLDivElement>(null)
  const bracketScrollRef  = useRef<HTMLDivElement>(null)

  // Registro demo
  const [registered, setRegistered] = useState(false)
  const [regForm, setRegForm] = useState({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' })
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})

  // Registration flow (Part 1)
  const [regStep, setRegStep] = useState<RegStep>('choose')
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupResult, setLookupResult] = useState<KOParticipant | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [koEnrolled, setKoEnrolled] = useState<KOParticipant[]>([])

  // Results view
  const [resultDay, setResultDay] = useState(() => {
    const d = new Date()
    return d.toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
  })
  const [resultMatchExpanded, setResultMatchExpanded] = useState<string | null>(null)
  const [resultPhaseFilter, setResultPhaseFilter] = useState<Stage | 'all'>('all')

  // Ranking phase filter
  const [rankingPhase, setRankingPhase] = useState<Stage | 'all'>('all')
  const [rankDay, setRankDay] = useState(() => {
    const dates = [...new Set(KNOCKOUT_MATCHES.map(m => m.date))].sort()
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })
    return dates.includes(today) ? today : (dates[0] ?? today)
  })

  // Mi Quiniela — búsqueda
  const [miqQuery, setMiqQuery] = useState('')
  const [miqFound, setMiqFound] = useState(false)

  // Admin — búsqueda participantes
  const [adminSearch, setAdminSearch] = useState('')

  // FAQ accordion
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  // Bracket — ronda activa (mobile tabs)
  const [bktRound, setBktRound] = useState('r32')

  // Estadísticas — tab activo y estado de simulación
  const [statTab, setStatTab] = useState<StatCategoryId>('goals')

  // Fotos de goleadores — cargadas desde Wikipedia REST API (thumbnails verificados)
  const [playerPhotos, setPlayerPhotos] = useState<Record<string, string>>({})
  useEffect(() => {
    const articles: Record<string, string> = {
      'Lionel Messi':    'Lionel_Messi',
      'Erling Haaland':  'Erling_Haaland',
      'Kylian Mbappé':   'Kylian_Mbapp%C3%A9',
      'Ousmane Dembélé': 'Ousmane_Demb%C3%A9l%C3%A9',
      'Vinícius Júnior': 'Vin%C3%ADcius_J%C3%BAnior',
      'Bukayo Saka':     'Bukayo_Saka',
      'Lamine Yamal':    'Lamine_Yamal',
      'Harry Kane':      'Harry_Kane',
      'Rodrygo':         'Rodrygo',
      'Romelu Lukaku':   'Romelu_Lukaku',
    }
    Promise.all(
      Object.entries(articles).map(async ([player, article]) => {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${article}`,
            { headers: { 'Accept': 'application/json' } }
          )
          const data = await res.json()
          if (data.thumbnail?.source) return [player, data.thumbnail.source] as [string, string]
        } catch { /* silently fall through */ }
        return null
      })
    ).then(results => {
      const photos: Record<string, string> = {}
      results.forEach(r => { if (r) photos[r[0]] = r[1] })
      setPlayerPhotos(photos)
    })
  }, [])
  const [statLastUpdate, setStatLastUpdate] = useState<string | null>(null)
  const [statSimLogs, setStatSimLogs]   = useState<string[]>([])
  const [statSimRunning, setStatSimRunning] = useState(false)
  const [pendingEvents, setPendingEvents] = useState<PendingMatchEvent[]>(DEMO_PENDING_EVENTS)

  useEffect(() => { setPicks(loadPicks()) }, [])
  useEffect(() => { setKoEnrolled(loadKOEnrolled()) }, [])

  // Scroll-reveal — activa .ko-visible cuando la sección entra al viewport.
  // setTimeout(80) es crítico: sin él el observer fires antes de que el browser
  // pinte opacity:0, y la transición no es perceptible.
  useEffect(() => {
    if (view !== 'home') return
    let io: IntersectionObserver | null = null
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.ko-reveal'))
      if (!els.length) return
      io = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('ko-visible')
            io?.unobserve(e.target)
          }
        }),
        { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => io!.observe(el))
    }, 80)
    return () => { clearTimeout(timer); io?.disconnect() }
  }, [view])

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
    { id: 'resultados',    label: 'Resultados',  emoji: '📅' },
    { id: 'bracket',       label: 'Cuadro',      emoji: '📊' },
    { id: 'estadisticas',  label: 'Stats',       emoji: '📈' },
  ]

  // ── Formateador de nombre público ──────────────────────────────────────────
  // Regla: primer nombre + primer apellido.
  // Cuidado con apellidos compuestos: "De Sá", "Del Valle", "De la Cruz"
  function formatPublicName(fullName: string): string {
    if (!fullName.trim()) return fullName
    const COMPOUND_PREFIXES = ['de', 'del', 'de la', 'de las', 'de los', 'van', 'von', 'da', 'das', 'do', 'dos']
    const parts = fullName.trim().split(/\s+/)
    if (parts.length <= 2) return fullName.trim()
    const firstName = parts[0]
    // Find first surname (index 1+), skipping second names if we detect compound structure
    // Simple heuristic: take parts[1] as surname; if it's a compound prefix, take parts[1]+parts[2]
    const surnameParts: string[] = []
    let i = 1
    // Skip what looks like a second given name: if parts[1] is short and part[2] is not a compound prefix
    // Strategy: take the last two "words" groups starting at index 1 as surname candidates
    // Actually simpler: take parts[1] as surname start; if lowercase compound prefix grab the next word too
    surnameParts.push(parts[i])
    i++
    if (i < parts.length) {
      const nextLower = parts[i].toLowerCase()
      // If what we just took is a compound prefix, grab one more word
      if (COMPOUND_PREFIXES.includes(surnameParts[0].toLowerCase())) {
        surnameParts.push(parts[i])
      }
    }
    return `${firstName} ${surnameParts.join(' ')}`
  }

  // ── HOME ────────────────────────────────────────────────────────────────────

  function renderHome() {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">

        {/* ── Animaciones y transiciones ── */}
        <style>{`
          /* Hero enter (above the fold, plays on mount) */
          @keyframes ko-rise {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .ko-rise    { animation: ko-rise 0.65s cubic-bezier(.22,1,.36,1) both; }
          .ko-rise-d1 { animation: ko-rise 0.65s 0.10s cubic-bezier(.22,1,.36,1) both; }
          .ko-rise-d2 { animation: ko-rise 0.65s 0.20s cubic-bezier(.22,1,.36,1) both; }
          .ko-rise-d3 { animation: ko-rise 0.65s 0.32s cubic-bezier(.22,1,.36,1) both; }
          .ko-rise-d4 { animation: ko-rise 0.65s 0.46s cubic-bezier(.22,1,.36,1) both; }

          /* Scroll reveal — IntersectionObserver agrega .ko-visible */
          .ko-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.65s cubic-bezier(.22,1,.36,1),
                        transform 0.65s cubic-bezier(.22,1,.36,1);
            will-change: transform, opacity;
          }
          .ko-reveal.ko-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* FAQ accordion transition con max-height */
          .ko-faq-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.32s cubic-bezier(.22,1,.36,1),
                        opacity 0.28s ease;
            opacity: 0;
          }
          .ko-faq-body.ko-faq-open {
            max-height: 360px;
            opacity: 1;
          }

          /* Botón CTA principal */
          .ko-btn-cta {
            transition: transform 0.18s cubic-bezier(.22,1,.36,1),
                        box-shadow 0.18s ease,
                        filter 0.15s ease;
          }
          .ko-btn-cta:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 32px rgba(34,197,94,0.4);
            filter: brightness(1.08);
          }
          .ko-btn-cta:active { transform: scale(0.96); }

          /* Cards con elevación suave */
          .ko-card-hover {
            transition: transform 0.22s cubic-bezier(.22,1,.36,1),
                        box-shadow 0.22s ease;
          }
          .ko-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.14);
          }
          .ko-card-hover:active { transform: scale(0.98); }

          /* Prefers reduced motion — disable everything */
          @media (prefers-reduced-motion: reduce) {
            .ko-rise, .ko-rise-d1, .ko-rise-d2, .ko-rise-d3, .ko-rise-d4 {
              animation: none !important;
            }
            .ko-reveal {
              opacity: 1 !important;
              transform: none !important;
              transition: none !important;
            }
            .ko-faq-body {
              transition: none !important;
              max-height: 360px !important;
              opacity: 1 !important;
            }
            .ko-btn-cta, .ko-card-hover {
              transition: none !important;
              transform: none !important;
            }
          }
        `}</style>

        {/* ── HERO ── */}
        <header className="relative overflow-hidden text-white flex flex-col min-h-screen sm:min-h-[600px]">

          {/* Mobile image */}
          <div className="absolute inset-0 block sm:hidden">
            <img src="/assets/hero/hero-mobile.webp" alt="Quiniela Eliminatorias 2026"
              className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
          </div>
          {/* Desktop image */}
          <div className="absolute inset-0 hidden sm:block">
            <img src="/assets/hero/hero-desktop.webp" alt="Quiniela Eliminatorias 2026"
              className="w-full h-full object-cover object-center" />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-black/55 via-transparent to-black/85" />
          <div className="absolute inset-0 hidden sm:block bg-[radial-gradient(ellipse_60%_80%_at_50%_40%,rgba(0,0,0,0.55)_0%,transparent_100%)]" />
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-blue-900/20" />

          {/* Content */}
          <div className="relative flex-1 flex flex-col max-w-3xl mx-auto px-4 w-full
                          sm:pt-14 sm:pb-20 sm:justify-start
                          pt-8 pb-16 justify-end text-center items-center ko-rise">

            {/* Host badge */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 shadow-lg">
              <span>🇲🇽 🇺🇸 🇨🇦</span>
              <span className="text-white/90">México · EE.UU. · Canadá 2026</span>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5 text-yellow-300 text-sm font-bold mb-5 animate-pulse">
              🟢 Inscripciones abiertas
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-[1.05] tracking-tight"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)' }}>
              Quiniela{' '}
              <span className="text-yellow-300" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>
                Dieciseisavos 2026
              </span>
            </h1>

            <p className="text-base sm:text-xl text-white/90 mb-3 max-w-lg mx-auto leading-relaxed"
               style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              Predice los <strong className="text-yellow-300 font-bold">16 partidos</strong> de Dieciseisavos,
              compite con tus amigos y gana el pozo acumulado.
            </p>

            <p className="text-white/55 text-sm mb-8" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              🟢 Quiniela activa: <strong className="text-yellow-300/80">Dieciseisavos</strong>
              <span className="mx-2 opacity-40">·</span>
              ⏳ Próxima: <span className="opacity-70">Octavos → Final</span>
            </p>

            {/* Progress bar if started */}
            {filledCount > 0 && (
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-3 mb-6 max-w-xs mx-auto w-full">
                <p className="text-xs text-green-200 mb-1.5 font-semibold">Tu progreso</p>
                <div className="w-full bg-white/20 rounded-full h-2.5 mb-1.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pctTotal}%` }} />
                </div>
                <p className="text-xs text-yellow-300 font-extrabold">{filledCount} / {totalOpenCount} partidos · {pctTotal}%</p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none">
              <button
                onClick={() => setView(registered || filledCount > 0 ? 'llenado' : 'registro')}
                className="ko-btn-cta group relative bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-2xl inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation"
                style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">⚽</span>
                {filledCount > 0 ? 'Continuar quiniela' : 'Participar ahora'}
                <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400">
                  20 USD
                </span>
              </button>
              <button
                onClick={() => setView('ranking')}
                className="bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation"
              >
                🏆 Ver ranking
              </button>
              <button
                onClick={() => setView('mi-quiniela')}
                className="bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation"
              >
                📋 Mi quiniela
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/50 text-xs">
              <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Pago Móvil o Zelle</span>
              <span className="w-px h-3 bg-white/20 hidden sm:block" />
              <span className="flex items-center gap-1"><span className="text-green-400">✓</span> 20 USD / 14.600 Bs · Tasa fija</span>
              <span className="w-px h-3 bg-white/20 hidden sm:block" />
              <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Ranking en tiempo real</span>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
            </svg>
          </div>
        </header>

        {/* ── STATS BAR ── */}
        <div className="bg-white border-b border-slate-200 shadow-sm ko-rise-d1">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
            {[
              { value: '16',      label: 'Partidos',         color: 'text-green-600' },
              { value: '32',      label: 'Equipos',          color: 'text-blue-600' },
              { value: '20 USD',  label: 'Entrada',          color: 'text-yellow-600' },
              { value: '14.600',  label: 'Monto en Bs',      color: 'text-amber-600' },
              { value: '65%',     label: 'Premio 1er lugar', color: 'text-purple-600' },
            ].map(({ value, label, color }, i) => (
              <div key={label} className={i >= 3 ? 'hidden sm:block' : ''}>
                <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-14 w-full space-y-20">

          {/* ── DOS QUINIELAS SEPARADAS ── */}
          <section className="ko-rise-d2">
            <div className="text-center mb-8">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Tus quinielas</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Las Eliminatorias en <span className="text-green-600">dos quinielas</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                Las eliminatorias se dividen en dos quinielas independientes,<br className="hidden sm:block" />
                cada una con su propia inscripción, ranking y premios.
              </p>
            </div>

            <div className="space-y-5">

              {/* ── BLOQUE 1: QUINIELA DIECISEISAVOS (ACTIVA) ── */}
              {(() => {
                const open = openMatches('R32')
                const filled = open.filter(m => pickComplete(picks[m.id])).length
                const done   = stageComplete('R32', picks)
                const partial = stagePartial('R32', picks)
                return (
                  <div className="rounded-2xl border-2 border-green-400 bg-white shadow-md overflow-hidden">
                    {/* Badge activa */}
                    <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest">🟢 Quiniela activa</span>
                      <span className="text-xs font-semibold text-green-200">Inscripciones abiertas</span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Quiniela Dieciseisavos</h3>
                          <p className="text-sm text-slate-500 mt-1">16 partidos · 28 jun – 3 jul 2026</p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Esta quiniela es <strong className="text-slate-600">independiente</strong>. Solo incluye los 16 partidos de Dieciseisavos de final.
                            Tiene su propio ranking y sus propios premios.
                          </p>
                        </div>
                        <div className="shrink-0 text-center">
                          <div className={`text-3xl font-extrabold leading-none ${done ? 'text-green-600' : partial ? 'text-amber-500' : 'text-slate-800'}`}>
                            {filled}<span className="text-lg text-slate-400">/{open.length}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">pronósticos</p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      {open.length > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                            <div className={`h-2 rounded-full transition-all duration-500 ${done ? 'bg-green-500' : partial ? 'bg-amber-400' : 'bg-slate-300'}`}
                              style={{ width: `${Math.round((filled / open.length) * 100)}%` }} />
                          </div>
                          <p className="text-xs text-slate-400">{Math.round((filled / open.length) * 100)}% completado</p>
                        </div>
                      )}

                      {/* Partido único: R32 */}
                      <div className={`mt-4 rounded-xl border px-4 py-3 flex items-center justify-between ${
                        done ? 'border-green-200 bg-green-50' : partial ? 'border-amber-200 bg-amber-50/60' : 'border-slate-200 bg-slate-50'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{done ? '✅' : partial ? '📝' : '⚽'}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">Dieciseisavos de final</p>
                            <p className="text-xs text-slate-500">16 partidos · 28 jun – 3 jul</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setActiveStage('R32'); setView('llenado') }}
                          className={`text-sm font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 touch-manipulation ${
                            done ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {done ? '✓ Editando' : 'Llenar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ── BLOQUE 2: QUINIELA OCTAVOS A FINAL (PRÓXIMAMENTE) ── */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden opacity-80">
                {/* Badge próxima */}
                <div className="bg-slate-600 text-white px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest">⏳ Próxima quiniela</span>
                  <span className="text-xs font-semibold text-slate-300">Se abre en julio</span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-700 leading-tight">Quiniela Octavos a Final</h3>
                      <p className="text-sm text-slate-500 mt-1">Octavos · Cuartos · Semifinales · Final · 4 – 19 jul</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Se abrirá cuando estén definidos los 16 clasificados de Dieciseisavos.
                        Tendrá <strong className="text-slate-500">nueva inscripción</strong>, nuevo llenado y
                        <strong className="text-slate-500"> ranking separado</strong>. No se mezcla con esta quiniela.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1.5 rounded-full">Por definir</span>
                    </div>
                  </div>

                  {/* Etapas futuras */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(['R16','QF','SF','FINAL'] as const).map(s => (
                      <div key={s} className="rounded-lg border border-slate-200 bg-white/60 px-3 py-2 flex items-center gap-2">
                        <span className="text-base">🔒</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-600">{STAGE_META[s].label}</p>
                          <p className="text-[10px] text-slate-400">{STAGE_META[s].dates} · {STAGE_META[s].matches} partidos</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button disabled
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold bg-slate-200 text-slate-400 cursor-not-allowed">
                    Próximamente — nueva inscripción
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* ── ¿CÓMO PARTICIPAR? ── */}
          <section className="ko-reveal">
            <div className="text-center mb-10">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Proceso</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                ¿Cómo <span className="text-green-600">participar?</span>
              </h2>
              <p className="text-slate-500 mt-2">En 5 pasos simples, completa tu quiniela y compite por el premio.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  num: 1,
                  icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
                  title: 'Regístrate', desc: 'Nombre, cédula y WhatsApp.',
                  color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
                },
                {
                  num: 2,
                  icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>),
                  title: 'Llena tu quiniela', desc: 'Predice los 16 partidos de Dieciseisavos.',
                  color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
                },
                {
                  num: 3,
                  icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>),
                  title: 'Paga y reporta', desc: 'Pago Móvil o Zelle. Envía tu comprobante por WhatsApp.',
                  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',
                },
                {
                  num: 4,
                  icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
                  title: 'Sigue el ranking', desc: 'Mira tu posición en vivo.',
                  color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
                },
                {
                  num: 5,
                  icon: <Trophy className="w-8 h-8" />,
                  title: '¡Gana!', desc: 'El mejor puntaje gana el premio.',
                  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200',
                },
              ].map((step) => (
                <div key={step.num} className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                  <div className={`ko-card-hover relative flex-1 lg:w-full bg-white rounded-2xl p-5 lg:p-6 shadow-sm border ${step.border}`}>
                    <div className={`absolute -top-3 -left-3 lg:left-1/2 lg:-translate-x-1/2 w-7 h-7 ${step.bg} border-2 ${step.border} ${step.color} text-sm font-extrabold rounded-full flex items-center justify-center shadow-sm`}>
                      {step.num}
                    </div>
                    <div className={`${step.color} mb-3 mt-1`}>{step.icon}</div>
                    <div className="font-bold text-slate-800 text-sm mb-1">{step.title}</div>
                    <div className="text-xs text-slate-500 leading-snug">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setView(registered || filledCount > 0 ? 'llenado' : 'registro')}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 text-sm touch-manipulation"
              >
                ⚽ Empezar ahora · 20 USD
              </button>
            </div>
          </section>

          {/* ── TABLA DE PREMIOS ── */}
          <section className="ko-reveal">
            <div className="text-center mb-10">
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Premios</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Tabla de <span className="text-yellow-600">Premios</span>
              </h2>
            </div>
            <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
              {/* Header gradient */}
              <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white p-8 text-center overflow-hidden">
                <div className="relative">
                  <p className="text-green-200 text-sm mb-2">Pozo acumulado · 24 pagos verificados</p>
                  <p className="text-5xl font-extrabold text-white drop-shadow">$480 <span className="text-2xl font-bold text-green-200">USD</span></p>
                  <p className="text-green-300 text-sm mt-1">350.400 Bs <span className="text-xs">(tasa fija 730 Bs/USD)</span></p>
                  <p className="text-green-400 text-xs mt-1">24 pagos verificados × $20 USD = $480 USD</p>
                </div>
              </div>
              {/* Prize rows */}
              <div className="divide-y divide-slate-100">
                {[
                  { medal: '🥇', pos: '1er Lugar',     pct: '65%', usd: '$312 USD', ves: '227.760 Bs', color: 'from-yellow-50 to-amber-50', badge: 'bg-yellow-100 text-yellow-800' },
                  { medal: '🥈', pos: '2do Lugar',     pct: '20%', usd: '$96 USD',  ves: '70.080 Bs',  color: 'from-slate-50 to-slate-50',  badge: 'bg-slate-100 text-slate-600' },
                  { medal: '🏛️', pos: 'Organización', pct: '15%', usd: '$72 USD',  ves: '52.560 Bs',  color: '',                           badge: 'bg-blue-50 text-blue-600' },
                ].map((row) => (
                  <div key={row.pos} className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${row.color} hover:bg-opacity-80 transition-colors`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.medal}</span>
                      <span className="font-bold text-slate-700">{row.pos}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.badge}`}>{row.pct}</span>
                      <div className="text-right">
                        <div className="font-extrabold text-lg text-slate-800">{row.usd}</div>
                        <div className="text-xs text-slate-500">{row.ves}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 p-4">
                Datos demo · El pozo se actualizará según los pagos verificados por el administrador. · Tasa fija: 730 Bs/USD
              </p>
            </div>
          </section>

          {/* ── MÉTODOS DE PAGO ── */}
          <section className="ko-reveal">
            <div className="text-center mb-8">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Pago</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Métodos de <span className="text-blue-700">Pago</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm">Puedes pagar por Pago Móvil Banesco o por Zelle. Elige el que prefieras.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Pago Móvil */}
              <div className="ko-card-hover bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-center mb-5">
                  <div className="text-3xl mb-1">📱</div>
                  <h3 className="font-extrabold text-xl">Pago Móvil</h3>
                  <div className="text-green-200 text-sm mt-1">Pago en bolívares</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 text-center mb-4">
                  <div className="text-green-200 text-xs mb-1">Monto</div>
                  <div className="text-3xl font-extrabold">14.600 <span className="text-lg font-semibold">Bs</span></div>
                  <div className="text-green-200 text-xs mt-1">20 USD · Tasa fija 730 Bs/USD</div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Banco',    value: 'Banesco',     icon: '🏦' },
                    { label: 'Teléfono', value: '04143043337', icon: '📞' },
                    { label: 'Cédula',   value: 'V-4.561.947', icon: '🪪' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="text-green-200 text-xs">{label}</div>
                        <div className="font-bold text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Zelle */}
              <div className="ko-card-hover bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-center mb-5">
                  <div className="text-3xl mb-1">💵</div>
                  <h3 className="font-extrabold text-xl">Zelle</h3>
                  <div className="text-blue-200 text-sm mt-1">Pago en dólares</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 text-center mb-4">
                  <div className="text-blue-200 text-xs mb-1">Monto</div>
                  <div className="text-3xl font-extrabold">20 <span className="text-lg font-semibold">USD</span></div>
                  <div className="text-blue-200 text-xs mt-1">Pago directo en dólares</div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Método', value: 'Zelle',                  icon: '💵' },
                    { label: 'Correo', value: 'kissigloxxi@hotmail.com', icon: '📧' },
                    { label: 'Monto',  value: '20 USD',                  icon: '💲' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="text-blue-200 text-xs">{label}</div>
                        <div className="font-bold text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 text-center">
              📌 Entrada: <strong>20 USD</strong> · Pago Móvil: <strong>14.600 Bs</strong> · Zelle: <strong>20 USD</strong> · Tasa fija: 730 Bs/USD
            </div>
          </section>

          {/* ── SISTEMA DE PUNTUACIÓN ── */}
          <section className="ko-reveal">
            <div className="text-center mb-8">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Puntuación</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Sistema de <span className="text-green-600">Puntuación</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                Predice el marcador de cada partido. Lo más importante es acertar quién clasifica —
                el marcador exacto te da puntos extra.
              </p>
            </div>

            {/* Points cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: '⚽', pts: '2', extra: '',
                  title: 'Clasificado correcto',
                  desc: 'Aciertas qué equipo gana (o quién avanza por penales si hay empate).',
                  bg: 'bg-green-50', border: 'border-green-300', ptsBg: 'bg-green-500', ptsText: 'text-white',
                },
                {
                  icon: '🎯', pts: '4', extra: 'máx',
                  title: 'Marcador exacto',
                  desc: 'Aciertas el marcador exacto Y al clasificado. Suma los 2+2 = 4 puntos.',
                  bg: 'bg-yellow-50', border: 'border-yellow-300', ptsBg: 'bg-yellow-400', ptsText: 'text-slate-900',
                },
                {
                  icon: '❌', pts: '0', extra: '',
                  title: 'Clasificado incorrecto',
                  desc: 'Si fallas quién clasifica, no sumas ningún punto, aunque el marcador sea parecido.',
                  bg: 'bg-slate-50', border: 'border-slate-200', ptsBg: 'bg-slate-300', ptsText: 'text-slate-700',
                },
              ].map((card) => (
                <div key={card.title} className={`${card.bg} border-2 ${card.border} rounded-2xl p-5 text-center hover:shadow-md transition-shadow`}>
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <div className={`inline-flex items-end gap-1 ${card.ptsBg} ${card.ptsText} font-extrabold text-3xl rounded-xl px-5 py-2 mb-3 shadow-sm`}>
                    {card.pts} <span className="text-lg font-semibold">pts</span>
                    {card.extra && <span className="text-xs font-semibold opacity-70 mb-1">({card.extra})</span>}
                  </div>
                  <div className="font-bold text-slate-800 text-sm mb-2">{card.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{card.desc}</div>
                </div>
              ))}
            </div>

            {/* Penalty rule callout */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
              <span className="text-2xl shrink-0">⚖️</span>
              <div>
                <p className="font-bold text-amber-900 text-sm mb-1">¿Y si el partido termina empatado?</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  En eliminatorias puede haber empate en 90 minutos y definición por penales.
                  Si predices empate, deberás indicar también <strong>quién gana por penales</strong>.
                  Lo que cuenta para los puntos es el <strong>clasificado final</strong> (incluyendo penales),
                  no el resultado del tiempo regular.
                </p>
              </div>
            </div>

            {/* Example block — normal match */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
              <div className="bg-slate-800 text-white px-5 py-3 text-sm font-semibold">
                ⚽ Ejemplo A — Resultado real: <span className="text-yellow-300">Argentina 2 – 1 México</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { pred: 'Argentina 2 – 1 México', note: 'Clasificado ✓ + Marcador exacto ✓',      pts: 4, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { pred: 'Argentina 3 – 0 México', note: 'Clasificado ✓, marcador diferente',       pts: 2, cls: 'text-green-600',  bg: '' },
                  { pred: 'México 1 – 0 Argentina', note: 'Clasificado ✗ — falla el ganador',        pts: 0, cls: 'text-slate-400',  bg: '' },
                ].map((row) => (
                  <div key={row.pred} className={`flex items-center justify-between px-5 py-3.5 ${row.bg}`}>
                    <div>
                      <span className="font-mono font-bold text-slate-800 text-sm">{row.pred}</span>
                      <span className="text-xs text-slate-400 ml-3 hidden sm:inline">{row.note}</span>
                    </div>
                    <div className={`font-extrabold text-lg ${row.cls}`}>{row.pts} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example block — draw + penalties */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-amber-700 text-white px-5 py-3 text-sm font-semibold">
                ⚖️ Ejemplo B — Resultado real: <span className="text-yellow-200">Sudáfrica 1 – 1 Canadá · Gana Canadá por penales</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { pred: 'Empate 1–1 · Gana Canadá por penales', note: 'Clasificado ✓ + Marcador exacto ✓', pts: 4, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { pred: 'Empate 0–0 · Gana Canadá por penales', note: 'Clasificado ✓, marcador diferente', pts: 2, cls: 'text-green-600',  bg: '' },
                  { pred: 'Empate 1–1 · Gana Sudáfrica por penales', note: 'Clasificado ✗ — falla quien pasa', pts: 0, cls: 'text-slate-400', bg: '' },
                ].map((row) => (
                  <div key={row.pred} className={`flex items-center justify-between px-5 py-3.5 ${row.bg}`}>
                    <div>
                      <p className="font-mono font-bold text-slate-800 text-sm">{row.pred}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{row.note}</p>
                    </div>
                    <div className={`font-extrabold text-lg shrink-0 ml-3 ${row.cls}`}>{row.pts} pts</div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-slate-50 text-xs text-slate-500 text-center">
                Máximo posible: <strong>4 pts × 32 partidos = 128 puntos</strong>
              </div>
            </div>
          </section>

          {/* ── TODO LO QUE NECESITAS ── */}
          <section className="ko-reveal">
            <div className="text-center mb-10">
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Plataforma</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Todo lo que <span className="text-purple-600">necesitas</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Trophy size={22} className="text-yellow-600" />,  bg: 'bg-yellow-50',  title: 'Ranking en tiempo real',  desc: 'Ve tu posición actualizada después de cada partido jugado.' },
                { icon: <Users size={22} className="text-blue-600" />,     bg: 'bg-blue-50',    title: 'Quinielas comparables',   desc: 'Compara tu estrategia con otros participantes después del cierre.' },
                { icon: <Clock size={22} className="text-green-600" />,    bg: 'bg-green-50',   title: 'Hora Venezuela',           desc: 'Todos los horarios en VET (UTC-4). Sin confusiones de zona horaria.' },
                { icon: <BarChart2 size={22} className="text-purple-600" />, bg: 'bg-purple-50', title: 'Estadísticas completas',  desc: 'Goleadores y tabla de equipos del torneo.' },
                { icon: <Shield size={22} className="text-red-600" />,     bg: 'bg-red-50',     title: 'Transparencia total',      desc: 'Resultados y puntuación verificables por todos los participantes.' },
                { icon: <Star size={22} className="text-amber-600" />,     bg: 'bg-amber-50',   title: 'Soporte WhatsApp',         desc: 'Contacta al administrador directamente para cualquier duda.' },
              ].map((feat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all">
                  <div className={`${feat.bg} rounded-xl p-2.5 shrink-0`}>{feat.icon}</div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{feat.title}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FASE ANTERIOR ── */}
          <section className="ko-reveal">
            <div className="text-center mb-8">
              <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Historial</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Fase <span className="text-slate-600">anterior</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm">Consulta los resultados, ranking y quinielas de la Fase de Grupos ya disputada.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: '⚽', label: 'Resultados Fase de Grupos', desc: 'Todos los marcadores de la fase de grupos.',       href: '/resultados' },
                { emoji: '🏆', label: 'Ranking Fase de Grupos',    desc: 'Posiciones finales de la quiniela anterior.',      href: '/ranking' },
                { emoji: '📋', label: 'Mi quiniela anterior',       desc: 'Revisa tus pronósticos de la fase pasada.',       href: '/mi-quiniela' },
              ].map(({ emoji, label, desc, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="bg-white border-2 border-slate-200 hover:border-green-300 rounded-2xl p-5 flex items-start gap-3 shadow-sm hover:shadow-md transition-all group">
                  <span className="text-2xl mt-0.5">{emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-green-700 transition-colors">{label}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="ko-reveal">
            <div className="text-center mb-10">
              <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Dudas</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Preguntas <span className="text-green-600">Frecuentes</span>
              </h2>
            </div>
            <div className="space-y-2">
              {[
                { q: '¿Cómo funciona la quiniela?',
                  a: 'Predices el marcador de los 32 partidos de la fase eliminatoria. Por cada partido: si aciertas quién clasifica ganas 2 puntos, y si además aciertas el marcador exacto ganas 2 puntos más (total 4 puntos). Gana quien acumule más puntos al final del torneo.' },
                { q: '¿Cuánto cuesta participar?',
                  a: 'La inscripción es de 20 USD. Puedes pagar por Pago Móvil Banesco (14.600 Bs a tasa fija 730 Bs/USD) o por Zelle (20 USD directamente).' },
                { q: '¿Cómo puedo pagar?',
                  a: 'Pago Móvil Banesco: Teléfono 04143043337 · CI V-4.561.947 · Monto 14.600 Bs. Zelle: kissigloxxi@hotmail.com · 20 USD. Después de pagar, reporta la referencia o comprobante por WhatsApp.' },
                { q: '¿Hasta cuándo puedo inscribirme?',
                  a: 'Puedes inscribirte y llenar tu quiniela hasta antes del primer partido de la fase eliminatoria. Una vez inicia la ronda, tu quiniela queda bloqueada.' },
                { q: '¿Cómo se distribuyen los premios?',
                  a: 'El 65% del fondo va al 1er lugar, el 20% al 2do lugar y el 15% restante cubre los gastos de organización.' },
                { q: '¿Qué pasa si hay empate en puntos?',
                  a: 'Se desempata por: 1) Mayor número de predicciones exactas, 2) Mayor efectividad porcentual, 3) Orden de inscripción.' },
                { q: '¿Puedo ver la quiniela de otros participantes?',
                  a: 'Sí, después del cierre de inscripciones el administrador puede habilitar la vista pública de todas las quinielas.' },
                { q: '¿Los horarios están en hora Venezuela?',
                  a: 'Sí, todos los partidos se muestran en hora Venezuela (UTC-4, sin horario de verano).' },
                { q: '¿Puedo modificar mi quiniela después de enviarla?',
                  a: 'Puedes modificar tus pronósticos hasta que comience el primer partido de la ronda correspondiente. Una vez inicia el partido, ese pronóstico queda bloqueado.' },
                { q: '¿Qué pasa si el partido va a penales?',
                  a: "En eliminatorias puede haber empate en tiempo reglamentario y definición por penales. Si predices empate, el formulario te pedirá que elijas también quién gana por penales. Para los puntos, lo que cuenta es el clasificado final (quien avanza, incluyendo penales). El marcador exacto se refiere al resultado en 90 minutos (ej: 1–1), sin contar la prórroga ni los penales." },
                { q: '¿Cómo se calculan exactamente los puntos?',
                  a: '2 puntos si aciertas el equipo que clasifica o gana. +2 puntos adicionales si además el marcador exacto coincide (considerando los goles en 90 minutos). 0 puntos si fallas el clasificado. El máximo por partido es 4 puntos.' },
              ].map((faq, i) => {
                const isOpen = faqOpen === i
                return (
                  <div key={i} className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-green-300 bg-green-50/30' : 'border-slate-200 hover:border-green-200'}`}>
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-50/60 transition-colors touch-manipulation"
                      aria-expanded={isOpen}
                    >
                      <span className={`text-sm leading-snug ${isOpen ? 'text-green-800 font-semibold' : 'text-slate-800'}`}>{faq.q}</span>
                      <span className={`shrink-0 ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDown size={18} className={isOpen ? 'text-green-600' : 'text-slate-400'} />
                      </span>
                    </button>
                    <div className={`ko-faq-body ${isOpen ? 'ko-faq-open' : ''}`}>
                      <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── BOTTOM CTA ── */}
          <section className="ko-reveal relative bg-gradient-to-br from-green-700 via-green-600 to-blue-700 rounded-3xl p-10 text-white text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'url(/assets/hero/football-pattern.svg)', backgroundSize: '120px' }} />
            <div className="relative">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¡Inscripciones abiertas!</h2>
              <p className="text-green-100 mb-8 max-w-md mx-auto">
                Predice los 32 partidos de la fase eliminatoria y compite por el primer lugar.
              </p>
              <button
                onClick={() => setView(registered || filledCount > 0 ? 'llenado' : 'registro')}
                className="ko-btn-cta inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-10 py-4 rounded-2xl text-lg shadow-xl touch-manipulation"
              >
                ⚽ {registered || filledCount > 0 ? 'Llenar mi quiniela' : 'Inscribirme ahora'} · 20 USD
              </button>
              <p className="text-green-200 text-xs mt-4">Pago Móvil Banesco · Zelle · 20 USD / 14.600 Bs · Tasa fija 730 Bs/USD</p>
            </div>
          </section>

        </main>
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
            <p className="text-xs font-semibold text-blue-800 mb-2">⚡ Sistema de puntos — Eliminatorias:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white font-extrabold px-2 py-0.5 rounded-full text-[10px] shrink-0">+2</span>
                <span>Aciertas el equipo clasificado o ganador</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full text-[10px] shrink-0">+2</span>
                <span>Aciertas además el marcador exacto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-300 text-slate-700 font-extrabold px-2 py-0.5 rounded-full text-[10px] shrink-0">+0</span>
                <span>Si fallas el clasificado, no sumas nada</span>
              </div>
            </div>
            <p className="text-[10px] text-blue-500 mt-2 font-medium">⚖️ Si predices empate, deberás elegir también quién gana por penales.</p>
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
    // ── Layout constants ────────────────────────────────────────────────────────
    // SLOT_H drives everything: COL_H = 16 × SLOT_H, slot per R32 card = SLOT_H.
    // Cards live in flex slots — no absolute positioning → zero overlap possible.
    const SLOT_H = 92    // px per R32 slot — 10px gap above+below CARD_H
    const CARD_H = 82    // card height — includes 2-row meta bar
    const CARD_W = 212   // card width — fits "Costa de Marfil" in 1 line at 11px
    const CONN_W = 28    // connector column width
    const HDR_H  = 52    // column header height
    const COL_H  = 16 * SLOT_H   // 1472  (same for every column)

    const ROUNDS = [
      { key:'r32', short:'R32',   label:'Dieciseisavos', dates:'28 jun – 3 jul',
        ids:['r32-73','r32-74','r32-75','r32-76','r32-77','r32-78','r32-79','r32-80',
             'r32-81','r32-82','r32-83','r32-84','r32-85','r32-86','r32-87','r32-88'] },
      { key:'r16', short:'R16',   label:'Octavos',       dates:'4 – 7 jul',
        ids:['r16-89','r16-90','r16-91','r16-92','r16-93','r16-94','r16-95','r16-96'] },
      { key:'qf',  short:'QF',    label:'Cuartos',       dates:'9 – 11 jul',
        ids:['qf-97','qf-98','qf-99','qf-100'] },
      { key:'sf',  short:'SF',    label:'Semifinales',   dates:'14 – 15 jul',
        ids:['sf-101','sf-102'] },
      { key:'f',   short:'FINAL', label:'Final',         dates:'19 jul',
        ids:['final-104'] },
    ]

    // ── Connector SVG paths ──────────────────────────────────────────────────
    // For round ri with N matches, slotH = COL_H/N.
    // Pairs (card 2j, card 2j+1) connect to the next round's card j.
    // Centers: y1=(2j+0.5)*slotH, y2=(2j+1.5)*slotH, yM=(y1+y2)/2
    function connPaths(ri: number): string {
      const N      = ROUNDS[ri].ids.length
      const slotH  = COL_H / N
      const pairs  = N / 2
      const hw     = CONN_W / 2
      return Array.from({ length: pairs }, (_, j) => {
        const y1 = (2 * j + 0.5) * slotH
        const y2 = (2 * j + 1.5) * slotH
        const yM = (y1 + y2) / 2
        return `M0,${y1} H${hw} M0,${y2} H${hw} M${hw},${y1} V${y2} M${hw},${yM} H${CONN_W}`
      }).join(' ')
    }

    function scrollToRound(key: string) {
      setBktRound(key)
      const idx = ROUNDS.findIndex(r => r.key === key)
      bracketScrollRef.current?.scrollTo({ left: idx * (CARD_W + CONN_W), behavior: 'smooth' })
      // Also scroll the page vertically so the first card of this round is in view.
      // Each round's first card center = HDR_H + slotH/2, where slotH = COL_H / N.
      const N = ROUNDS[idx].ids.length
      const slotH = COL_H / N
      const cardCenterInBracket = HDR_H + slotH / 2
      const bracketTop = bracketScrollRef.current?.getBoundingClientRect().top ?? 0
      const targetPageY = window.scrollY + bracketTop + cardCenterInBracket - 160
      window.scrollTo({ top: Math.max(0, targetPageY), behavior: 'smooth' })
    }

    // Compact placeholder labels — never show long group-combo strings
    function shortLabel(name: string | null | undefined, ph: string | null | undefined): string {
      const raw = name ?? ph ?? 'A definir'
      if (raw.startsWith('Bosnia')) return 'Bosnia'
      if (raw.startsWith('Mejor 3.º')) return 'Mejor 3.°'
      if (/^1\.º Grupo (.+)/.test(raw)) return '1° ' + raw.replace(/^1\.º Grupo /, 'Gr. ')
      if (/^2\.º Grupo (.+)/.test(raw)) return '2° ' + raw.replace(/^2\.º Grupo /, 'Gr. ')
      if (raw.startsWith('Gan. #'))  return 'Gan. '  + raw.slice(6)
      if (raw.startsWith('Perd. #')) return 'Perd. ' + raw.slice(7)
      return raw
    }

    // Date formatter: "2026-06-28" → "dom 28 jun"
    function shortDate(dateStr: string): string {
      const [y, mo, d] = dateStr.split('-').map(Number)
      const dt = new Date(y, mo - 1, d)
      const days = ['dom','lun','mar','mié','jue','vie','sáb']
      const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
      return `${days[dt.getDay()]} ${d} ${months[mo - 1]}`
    }

    // ── Inline card renderer (NOT a React component — avoids reconciliation issues) ──
    function renderCard(
      m: KOMatch,
      hasPick: boolean,
      pick: { home: number; away: number } | undefined,
      isOpen: boolean,
      isFinal: boolean,
      cardHeightPx: number,
    ) {
      const homePh    = m.home.name === null
      const awayPh    = m.away.name === null
      const homeLabel = shortLabel(m.home.name, m.home.placeholder)
      const awayLabel = shortLabel(m.away.name, m.away.placeholder)

      const bgCard    = isFinal ? (hasPick ? '#3b1d03' : '#1a1205') : (hasPick ? '#14532d' : '#1e293b')
      const border    = isFinal ? (hasPick ? '#d97706' : '#78350f') : (hasPick ? '#16a34a' : '#2d3f55')
      const bgMeta    = isFinal ? (hasPick ? '#78350f' : '#261a07') : (hasPick ? '#166534' : '#131c2b')
      const clrNum    = isFinal ? '#fbbf24' : (hasPick ? '#4ade80' : '#475569')
      const clrTime   = hasPick ? (isFinal ? '#fcd34d' : '#86efac') : '#374151'
      const clrScore  = isFinal ? '#fbbf24' : '#4ade80'
      const clrReal   = hasPick ? (isFinal ? '#fef3c7' : '#bbf7d0') : '#d1d5db'
      const clrPh     = '#3d4f63'
      const shadow    = isFinal
        ? '0 0 0 1px rgba(251,191,36,0.1), 0 4px 16px rgba(0,0,0,0.55)'
        : hasPick ? '0 0 0 1px rgba(34,197,94,0.08), 0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.28)'

      return (
        <div
          onClick={() => isOpen ? setView('llenado') : undefined}
          style={{
            height: cardHeightPx, width: '100%',
            background: bgCard, border: `1.5px solid ${border}`,
            borderRadius: 8, overflow: 'hidden',
            cursor: isOpen ? 'pointer' : 'default',
            boxShadow: shadow,
            display: 'flex', flexDirection: 'column' as const,
          }}
        >
          {/* Meta bar — 2 rows: number+date / time */}
          <div style={{
            flexShrink: 0,
            padding: '2px 7px 2px', height: 22,
            background: bgMeta,
            borderBottom: '1px solid rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, lineHeight: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 9, color: clrNum, flexShrink: 0 }}>
                {isFinal ? '🏆' : `#${m.fifaMatchNumber}`}
              </span>
              <span style={{ fontSize: 8, color: clrTime, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 }}>
                {isFinal ? 'Final · ' : ''}{shortDate(m.date)}
              </span>
              {isOpen && !hasPick && (
                <span style={{ fontSize: 7, color: '#22c55e', flexShrink: 0 }}>✏️</span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 7.5, color: '#475569', whiteSpace: 'nowrap' as const, lineHeight: 1, paddingTop: 2 }}>
              {m.displayTime}
            </p>
          </div>

          {/* Home team */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 7px',
            opacity: homePh && !hasPick ? 0.5 : 1,
          }}>
            <FlagImg flag={m.home.flag} size={16} />
            <span style={{
              flex: 1, fontSize: 11, lineHeight: 1.3,
              fontWeight: homePh ? 400 : 600,
              fontStyle: homePh ? 'italic' : 'normal',
              color: homePh ? clrPh : clrReal,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {homeLabel}
            </span>
            {hasPick && pick !== undefined && (
              <span style={{ fontSize: 13, fontWeight: 800, color: clrScore, flexShrink: 0, minWidth: 14, textAlign: 'right' as const }}>
                {pick.home}
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, margin: '0 7px', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }} />

          {/* Away team */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 7px',
            opacity: awayPh && !hasPick ? 0.5 : 1,
          }}>
            <FlagImg flag={m.away.flag} size={16} />
            <span style={{
              flex: 1, fontSize: 11, lineHeight: 1.3,
              fontWeight: awayPh ? 400 : 600,
              fontStyle: awayPh ? 'italic' : 'normal',
              color: awayPh ? clrPh : clrReal,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {awayLabel}
            </span>
            {hasPick && pick !== undefined && (
              <span style={{ fontSize: 13, fontWeight: 800, color: clrScore, flexShrink: 0, minWidth: 14, textAlign: 'right' as const }}>
                {pick.away}
              </span>
            )}
          </div>
        </div>
      )
    }

    const TOTAL_W = ROUNDS.length * CARD_W + (ROUNDS.length - 1) * CONN_W
    const m3rd    = KNOCKOUT_MATCHES.find(m => m.id === 'final-103')

    return (
      <div style={{ background: '#0f172a', minHeight: 'calc(100vh - 120px)' }}>

        {/* ── Header ── */}
        <div style={{ padding: '18px 16px 4px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ color: '#f1f5f9', fontSize: 19, fontWeight: 800, margin: 0 }}>
            Cuadro eliminatorio
          </h1>
          <span style={{ color: '#334155', fontSize: 10 }}>Mundial 2026 · desliza →</span>
        </div>

        {/* ── Phase tabs ── */}
        <div style={{ display: 'flex', gap: 5, padding: '8px 16px 14px', overflowX: 'auto', scrollbarWidth: 'none' as const }}>
          {ROUNDS.map(r => {
            const active = bktRound === r.key
            return (
              <button key={r.key} onClick={() => scrollToRound(r.key)} style={{
                padding: '5px 13px', borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                border: `1.5px solid ${active ? '#22c55e' : '#1e293b'}`,
                background: active ? '#22c55e' : '#1e293b',
                color: active ? '#0f172a' : '#475569',
                flexShrink: 0, cursor: 'pointer', transition: 'all .12s', lineHeight: 1,
              }}>
                {r.short}
                {active && <span style={{ marginLeft: 5, fontSize: 8, opacity: 0.75 }}>{r.dates}</span>}
              </button>
            )
          })}
        </div>

        {/* ── Bracket — horizontal scroll ── */}
        <div ref={bracketScrollRef}
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const, paddingBottom: 16 }}
        >
          {/* Inner row: all columns + connectors side by side */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingLeft: 16, paddingRight: 24,
            width: TOTAL_W + 40,
          }}>

            {ROUNDS.map((round, ri) => {
              const N     = round.ids.length          // cards in this column
              const slotH = COL_H / N                 // height per slot (equal division)

              const colEl = (
                <div key={round.key} style={{ width: CARD_W, flexShrink: 0 }}>

                  {/* Column header */}
                  <div style={{
                    height: HDR_H,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    paddingBottom: 10,
                  }}>
                    <p style={{
                      color: bktRound === round.key ? '#22c55e' : '#94a3b8',
                      fontSize: 11, fontWeight: 800, margin: 0, lineHeight: 1,
                      letterSpacing: '0.04em',
                    }}>
                      {round.label.toUpperCase()}
                    </p>
                    <p style={{ color: '#334155', fontSize: 9, marginTop: 2 }}>{round.dates}</p>
                  </div>

                  {/* Cards — FLEX COLUMN, equal slots, zero overlap guaranteed */}
                  {round.key === 'f' ? (
                    // ── Final column: absolute-position Final card at connector center,
                    //    then place 3rd-place card just below it.
                    <div style={{ height: COL_H, position: 'relative' as const }}>
                      <div style={{ position: 'absolute' as const, top: COL_H / 2 - CARD_H / 2, left: 2, right: 2 }}>
                        {(() => {
                          const fm = KNOCKOUT_MATCHES.find(x => x.id === 'final-104')
                          if (!fm) return null
                          const pick = picks[fm.id]
                          return renderCard(fm, !!pick, pick, fm.isOpenForPredictions, true, CARD_H)
                        })()}
                        {m3rd && (() => {
                          const pick3   = picks[m3rd.id]
                          const hasPick = !!pick3
                          return (
                            <div style={{ marginTop: 18 }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                              }}>
                                <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
                                <span style={{
                                  color: '#b45309', fontSize: 8.5, fontWeight: 700,
                                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                                  whiteSpace: 'nowrap' as const,
                                }}>🥉 3.er Puesto · 18 jul · Miami</span>
                                <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
                              </div>
                              {renderCard(m3rd, hasPick, pick3, m3rd.isOpenForPredictions, false, CARD_H)}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    height: COL_H,
                  }}>
                    {round.ids.map(id => {
                      const m = KNOCKOUT_MATCHES.find(x => x.id === id)
                      if (!m) return null
                      const pick    = picks[m.id]
                      const hasPick = !!pick

                      return (
                        <div key={id} style={{
                          height: slotH,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          padding: `0 2px`,
                        }}>
                          {renderCard(m, hasPick, pick, m.isOpenForPredictions, false, CARD_H)}
                        </div>
                      )
                    })}
                  </div>
                  )}

                </div>
              )

              // Connector SVG between this column and the next
              const connEl = ri < ROUNDS.length - 1 ? (
                <div key={`conn-${ri}`} style={{ flexShrink: 0, paddingTop: HDR_H }}>
                  <svg width={CONN_W} height={COL_H} style={{ display: 'block', overflow: 'visible' }}>
                    <path
                      d={connPaths(ri)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.38"
                    />
                  </svg>
                </div>
              ) : null

              return [colEl, connEl]
            })}

          </div>
        </div>

        {/* 3rd place is now integrated inside the Final column above */}

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
                          <FlagImg flag={m.home.flag} size={20} />
                          <span className="flex-1 text-slate-600 text-xs truncate">{homeDisplay}</span>
                          <span className="font-extrabold text-slate-900 shrink-0 text-sm tabular-nums">
                            {pick ? `${pick.home} – ${pick.away}` : '—'}
                          </span>
                          <span className="flex-1 text-slate-600 text-xs truncate text-right">{awayDisplay}</span>
                          <FlagImg flag={m.away.flag} size={20} />
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
    const PHASE_FILTERS: { key: Stage | 'all'; label: string }[] = [
      { key: 'all',   label: 'Acumulado' },
      { key: 'R32',   label: 'Dieciseisavos' },
      { key: 'R16',   label: 'Octavos' },
      { key: 'QF',    label: 'Cuartos' },
      { key: 'SF',    label: 'Semis' },
      { key: 'FINAL', label: 'Final' },
    ]

    const baseRanking = [...KO_DEMO_RANKING]
    koEnrolled.filter(p => p.paymentStatus !== 'rejected').forEach(ep => {
      if (!baseRanking.find(r => r.cedula === ep.cedula)) {
        baseRanking.push({ cedula: ep.cedula, displayName: ep.displayName, ciudad: ep.ciudad, totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: ep.paymentStatus })
      }
    })
    const ranking = baseRanking.map((r, i) => ({ ...r, position: i + 1 }))
    const top3 = ranking.slice(0, 3)
    const podiumOrder = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null]
    const podiumMedals = ['🥈', '🥇', '🥉']
    const podiumHeights = ['h-20', 'h-28', 'h-16']
    const podiumColors  = ['bg-slate-300', 'bg-yellow-400', 'bg-amber-300']
    const myDisplayName = registered ? regForm.nombre.split(' ').slice(0, 2).join(' ') : null

    // ── Pronósticos del día helpers ──────────────────────────────────────────
    const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })

    function shortDateLabel(d: string) {
      if (d === todayStr) return 'Hoy'
      const [y, mo, dy] = d.split('-').map(Number)
      const dt = new Date(`${y}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}T12:00:00-04:00`)
      return dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    const allDates = [...new Set(KNOCKOUT_MATCHES.map(m => m.date))].sort()
    const activeRankDay = allDates.includes(rankDay) ? rankDay : (allDates[0] ?? rankDay)
    const dayMatchesRank = KNOCKOUT_MATCHES
      .filter(m => m.date === activeRankDay)
      .sort((a, b) => a.timeVet.localeCompare(b.timeVet))

    const finishedDay = dayMatchesRank.filter(m => m.status === 'FINISHED').length
    const liveDay     = dayMatchesRank.filter(m => m.status === 'LIVE').length
    const pendingDay  = dayMatchesRank.filter(m => m.status === 'SCHEDULED').length
    const totalPlayed = KNOCKOUT_MATCHES.filter(m => m.status === 'FINISHED').length

    // Demo: each match has 12 predictors
    const DEMO_PRED_COUNT = ranking.length

    return (
      <div className="min-h-screen bg-slate-50 pb-10">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-5">
            <h1 className="font-bold text-2xl">🏆 Ranking Eliminatorias</h1>
            <p className="text-green-200 text-sm">Quiniela Mundial 2026 · Fase eliminatoria</p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 mt-5 space-y-5">

          {/* ── PRONÓSTICOS DEL DÍA ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-5 bg-green-500 rounded-full shrink-0" />
              <h2 className="font-extrabold text-slate-800 text-base">Pronósticos del día</h2>
            </div>

            {/* Date selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {allDates.map(d => (
                <button key={d} onClick={() => setRankDay(d)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all touch-manipulation ${
                    d === activeRankDay
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : d === todayStr
                      ? 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {shortDateLabel(d)}
                </button>
              ))}
            </div>

            {/* Day summary */}
            {dayMatchesRank.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-100 p-3 mt-2 mb-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
                  <span className="text-slate-600"><strong className="text-slate-800">{dayMatchesRank.length}</strong> partido{dayMatchesRank.length !== 1 ? 's' : ''}</span>
                  {finishedDay > 0 && <span className="text-green-700">✅ <strong>{finishedDay}</strong> finalizado{finishedDay !== 1 ? 's' : ''}</span>}
                  {liveDay > 0 && <span className="text-blue-700 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" /> <strong>{liveDay}</strong> en juego</span>}
                  {pendingDay > 0 && <span className="text-slate-400">⏱️ <strong>{pendingDay}</strong> por jugar</span>}
                </div>
                <div className="text-xs text-slate-500">
                  🏆 Líder: <span className="font-semibold text-slate-700">{top3[0] ? formatPublicName(top3[0].displayName) : 'Sin datos'}</span>
                  {' · '}{top3[0]?.totalPoints ?? 0} pts
                </div>
              </div>
            )}

            {/* Match cards */}
            {dayMatchesRank.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-400">
                <p className="text-2xl mb-2">📅</p>
                <p className="text-sm">No hay partidos para esta fecha.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dayMatchesRank.map(m => {
                  const isFinished = m.status === 'FINISHED'
                  const isLive     = m.status === 'LIVE'
                  const myPick     = picks[m.id]
                  const stageLabel = { R32: 'Dieciseisavos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semis', FINAL: 'Final' }[m.stage]
                  const homeName   = m.home.name ?? m.home.placeholder
                  const awayName   = m.away.name ?? m.away.placeholder

                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      {/* Top bar */}
                      <div className={`px-3 py-1.5 flex items-center justify-between text-xs ${
                        isLive ? 'bg-blue-600 text-white' :
                        isFinished ? 'bg-slate-700 text-white' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="font-bold">{stageLabel} · #{m.fifaMatchNumber}</span>
                        <span className="font-semibold">
                          {isLive ? '🔴 En juego' : isFinished ? '✅ Finalizado' : m.displayTime + ' VET'}
                        </span>
                      </div>

                      {/* Teams */}
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Home */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <FlagImg flag={m.home.flag} size={26} />
                              <span className="font-bold text-slate-800 text-sm leading-tight truncate">{homeName}</span>
                            </div>
                          </div>

                          {/* Score / vs */}
                          <div className="shrink-0 text-center w-16">
                            {isFinished || isLive ? (
                              <span className="font-extrabold text-lg text-slate-800">? — ?</span>
                            ) : (
                              <span className="text-xs text-slate-300 font-bold">vs</span>
                            )}
                          </div>

                          {/* Away */}
                          <div className="flex-1 min-w-0 flex flex-col items-end">
                            <div className="flex items-center gap-2 flex-row-reverse">
                              <FlagImg flag={m.away.flag} size={26} />
                              <span className="font-bold text-slate-800 text-sm leading-tight truncate">{awayName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Venue */}
                        <p className="text-xs text-slate-400 mt-1.5 truncate">📍 {m.venue} · {m.city}</p>

                        {/* My pick */}
                        {myPick && (
                          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs text-green-700">
                            Mi pronóstico: <strong>{homeName.split(' ')[0]} {myPick.home} – {myPick.away} {awayName.split(' ')[0]}</strong>
                            {myPick.penaltyWinner && (
                              <span className="ml-2 text-amber-600">· Penales: {myPick.penaltyWinner === 'home' ? homeName.split(' ')[0] : awayName.split(' ')[0]}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action button */}
                      <div className="px-4 pb-3">
                        <button
                          onClick={() => setView('resultados')}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all touch-manipulation ${
                            isFinished
                              ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-900'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isFinished
                            ? `🏆 Ver puntos (${DEMO_PRED_COUNT})`
                            : `👁️ Ver pronósticos (${DEMO_PRED_COUNT})`
                          }
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* ── RANKING GENERAL ── */}
          <div className="flex items-center gap-2 pt-2">
            <span className="w-1 h-5 bg-yellow-400 rounded-full shrink-0" />
            <h2 className="font-extrabold text-slate-800 text-base">Ranking general</h2>
          </div>

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
              <p className="text-sm font-extrabold text-yellow-600 truncate">{top3[0] ? formatPublicName(top3[0].displayName) : '—'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Líder actual</p>
            </div>
          </div>

          {/* Phase filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PHASE_FILTERS.map(f => (
              <button key={f.key} onClick={() => setRankingPhase(f.key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  rankingPhase === f.key ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}>{f.label}</button>
            ))}
          </div>

          {/* Podium */}
          {top3.length >= 2 && (
            <section>
              <div className="flex items-end justify-center gap-3 pt-4">
                {podiumOrder.map((entry, i) => {
                  if (!entry) return <div key={i} className="w-24" />
                  return (
                    <div key={entry.cedula} className="flex flex-col items-center">
                      <div className="text-2xl mb-1">{podiumMedals[i]}</div>
                      <div className="text-center mb-2">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{formatPublicName(entry.displayName)}</p>
                        <p className="text-xs text-slate-500">{entry.totalPoints} pts</p>
                        <p className="text-xs text-green-600">🏆 {entry.correctResults} · 🎯 {entry.exactScores}</p>
                      </div>
                      <div className={`${podiumHeights[i]} w-24 ${podiumColors[i]} rounded-t-xl flex items-center justify-center font-bold text-lg text-white`}>
                        {i === 1 ? 1 : i === 0 ? 2 : 3}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Scoring legend — updated to KO scoring */}
          <div className="bg-white rounded-xl border border-slate-100 p-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            <span>🏆 Clasificado correcto = <strong>2 pts</strong></span>
            <span>🎯 Marcador exacto = <strong>+2 pts</strong></span>
            <span>❌ Fallo = <strong>0 pts</strong></span>
            <span className="text-slate-400">· Máximo 4 pts por partido</span>
          </div>

          {/* Ranking table */}
          <section>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Participante</div>
                <div className="col-span-2 text-center">Pts</div>
                <div className="col-span-2 text-center" title="Clasificados correctos (2 pts c/u)">🏆 Clas.</div>
                <div className="col-span-2 text-center" title="Marcadores exactos (+2 pts c/u)">🎯 Exac.</div>
              </div>

              {ranking.map(entry => {
                const isMe = myDisplayName && entry.displayName === myDisplayName
                return (
                  <div key={entry.cedula}
                    className={`px-3 py-3 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${
                      isMe ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : entry.position <= 3 ? 'bg-yellow-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-1 text-center">
                      <span className="font-bold text-slate-700 text-sm">
                        {entry.position <= 3 ? ['🥇','🥈','🥉'][entry.position - 1] : entry.position}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{formatPublicName(entry.displayName)}</p>
                      {entry.movement > 0
                        ? <span className="text-green-600 text-[10px] font-medium">↑{entry.movement}</span>
                        : entry.movement < 0
                        ? <span className="text-red-500 text-[10px] font-medium">↓{Math.abs(entry.movement)}</span>
                        : null}
                      {isMe && <span className="text-[10px] text-yellow-600 font-bold ml-1">← tú</span>}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-bold text-green-600 text-base">{entry.totalPoints}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold text-slate-700">{entry.correctResults}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-slate-600">{entry.exactScores}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tiebreaker */}
            <div className="mt-3 bg-slate-100 rounded-xl p-3">
              <p className="text-xs text-slate-600 font-semibold mb-1">Criterios de desempate:</p>
              <ol className="text-xs text-slate-500 space-y-0.5 list-decimal list-inside">
                <li>Más puntos totales.</li>
                <li>Más clasificados correctos.</li>
                <li>Más marcadores exactos.</li>
                <li>Registro más temprano.</li>
              </ol>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3">
              {ranking.length} participante{ranking.length !== 1 ? 's' : ''} · Se actualizará con resultados reales al inicio del torneo
            </p>
          </section>

          {/* Link to group stage ranking */}
          <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-white font-bold text-sm">Ranking Fase de Grupos</p>
              <p className="text-slate-400 text-xs">Ver posiciones de la ronda anterior</p>
            </div>
            <a href="/ranking" target="_blank" rel="noreferrer"
              className="shrink-0 bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Ver ranking →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── ESTADÍSTICAS ─────────────────────────────────────────────────────────────

  function renderEstadisticas() {
    const isTeams = statTab === 'teams'

    return (
      <div className="max-w-2xl mx-auto px-3 py-5 pb-28">

        {statLastUpdate && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-3 text-xs text-green-700 font-semibold">
            <span>✓</span>
            <span>Estadísticas actualizadas · {statLastUpdate}</span>
          </div>
        )}

        {/* Card oscura */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl mb-4">

          {/* Header */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-white text-xl font-extrabold tracking-tight">Estadísticas</h1>
                <p className="text-slate-400 text-xs mt-0.5">Quiniela Eliminatorias 2026</p>
              </div>
              <p className="text-slate-500 text-[10px] text-right shrink-0 ml-3 mt-1">
                {statLastUpdate
                  ? <span className="text-green-400 font-semibold">✓ {statLastUpdate}</span>
                  : 'datos demo'}
              </p>
            </div>

            {/* 2 tabs — Goles y Equipos */}
            <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
              {STAT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setStatTab(cat.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all touch-manipulation ${
                    statTab === cat.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── GOLES — foto + nombre + bandera + valor ── */}
          {!isTeams && (
            <div className="divide-y divide-slate-800">
              {/* Col header */}
              <div className="grid px-5 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide"
                style={{ gridTemplateColumns: '28px 44px 1fr 36px' }}>
                <span>#</span>
                <span />
                <span>Jugador</span>
                <span className="text-right">G</span>
              </div>

              {DEMO_GOALS.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="grid items-center px-5 py-3 hover:bg-slate-800/60 transition-colors"
                  style={{ gridTemplateColumns: '28px 44px 1fr 36px' }}
                >
                  {/* Rank */}
                  <span className={`text-sm font-extrabold tabular-nums leading-none ${
                    p.rank === 1 ? 'text-yellow-400' : p.rank <= 3 ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {p.rank}
                  </span>

                  {/* Photo — Wikipedia REST API thumbnail (real verified headshot).
                      onError falls to dark silhouette placeholder — never shows random people. */}
                  {playerPhotos[p.name] ? (
                    <img
                      src={playerPhotos[p.name]}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-600"
                      style={{ objectPosition: 'center top' }}
                      onError={e => {
                        const img = e.target as HTMLImageElement
                        const wrap = img.parentElement
                        if (wrap) {
                          const div = document.createElement('div')
                          div.style.cssText = `width:40px;height:40px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;background:${p.color}22;color:${p.color};border:2px solid #334155`
                          div.textContent = p.initials
                          img.replaceWith(div)
                        }
                      }}
                    />
                  ) : (
                    // Placeholder elegante mientras carga o si no hay foto verificada
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-slate-700 flex-shrink-0"
                      style={{ background: p.color + '18', color: p.color }}
                    >
                      <svg viewBox="0 0 40 40" width="40" height="40" style={{ position: 'absolute' }} aria-hidden>
                        <circle cx="20" cy="15" r="7" fill={p.color} opacity="0.35" />
                        <ellipse cx="20" cy="34" rx="11" ry="7" fill={p.color} opacity="0.25" />
                      </svg>
                      <span style={{ fontSize: 10, fontWeight: 800, position: 'relative', zIndex: 1 }}>
                        {p.initials}
                      </span>
                    </div>
                  )}

                  {/* Name + country */}
                  <div className="pl-2 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{p.name}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                      <span>{p.flag}</span>
                      <span className="truncate">{p.country}</span>
                    </p>
                  </div>

                  {/* Goals */}
                  <span className={`text-right text-lg font-extrabold tabular-nums ${
                    p.rank === 1 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── EQUIPOS — tabla con scroll horizontal en móvil ── */}
          {isTeams && (
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' as const }}>
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

                {DEMO_TEAM_STATS.map(t => (
                  <div
                    key={t.code}
                    className="grid items-center px-4 py-2 border-t border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                    style={{ gridTemplateColumns: '28px 1fr 30px 30px 30px 30px 36px 36px 40px 40px' }}
                  >
                    <span className={`text-xs font-extrabold tabular-nums ${
                      t.rank <= 3 ? 'text-yellow-400' : t.rank <= 8 ? 'text-green-400' : 'text-slate-500'
                    }`}>{t.rank}</span>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm leading-none shrink-0">{t.flag}</span>
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
                    }`}>
                      {t.goalDiff > 0 ? '+' : ''}{t.goalDiff}
                    </span>
                    <span className="text-yellow-400 text-xs text-center font-extrabold tabular-nums">{t.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between">
            <p className="text-[10px] text-slate-500">⚠️ Datos demo · no son estadísticas oficiales</p>
            <button onClick={() => setView('admin')} className="text-[10px] text-slate-400 hover:text-white underline">Admin →</button>
          </div>
        </div>

        <button onClick={() => setView('home')} className="w-full text-slate-400 text-xs py-2 hover:text-slate-600 transition-colors">
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

        {/* Pending events — collapsed technical section */}
        <details className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5 shadow-sm group">
          <summary className="px-4 py-3 flex items-center justify-between cursor-pointer list-none hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-700 text-sm">🔧 Revisión técnica de eventos</h2>
              {pendingEvents.filter(e => e.status === 'pending').length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {pendingEvents.filter(e => e.status === 'pending').length}
                </span>
              )}
            </div>
            <span className="text-slate-400 text-xs">Ver ▾</span>
          </summary>
          <div className="border-t border-slate-100">
            <p className="text-[10px] text-slate-400 px-4 py-2 bg-slate-50/50">
              Eventos con confianza media/baja detectados automáticamente. En producción estos se procesan sin revisión manual salvo que la confianza sea muy baja.
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
                          <span className="text-[10px] text-slate-400">min. {ev.minute} · {ev.source} · <span className={ev.confidence === 'high' ? 'text-green-600' : ev.confidence === 'medium' ? 'text-amber-600' : 'text-red-600'}>{ev.confidence}</span></span>
                        </div>
                      </div>
                      {ev.status !== 'pending' && (
                        <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg shrink-0 ${ev.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {ev.status === 'approved' ? '✓ OK' : '✗ Rechaz.'}
                        </span>
                      )}
                    </div>
                    {ev.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => { setPendingEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'approved' } : e)); setToast(`✅ ${ev.playerName}`) }}
                          className="flex-1 bg-green-600 text-white text-xs font-bold py-1.5 rounded-lg touch-manipulation">✓ Aprobar</button>
                        <button onClick={() => { setPendingEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'rejected' } : e)); setToast(`🗑 ${ev.playerName}`) }}
                          className="flex-1 bg-red-50 border border-red-200 text-red-600 text-xs font-bold py-1.5 rounded-lg touch-manipulation">✗ Rechazar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </details>

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

    // ── helpers ────────────────────────────────────────────────────────────────

    async function handleLookup() {
      const q = lookupQuery.trim()
      if (!q) return
      setLookupLoading(true)

      // Decide whether the query looks like a cédula or a phone number.
      // A query with ≥ 9 digits that starts with 04, +58, 58, or 0 is a phone.
      const digits = q.replace(/\D/g, '')
      const isPhone =
        digits.length >= 9 &&
        (digits.startsWith('04') || digits.startsWith('58') || digits.startsWith('0'))

      const param = isPhone ? `phone=${encodeURIComponent(q)}` : `cedula=${encodeURIComponent(q)}`

      try {
        const res  = await fetch(`/api/admin/ko-prototype/lookup?${param}`)
        const data = await res.json()

        if (!data.found) {
          setLookupLoading(false)
          setRegStep('not-found')
          return
        }

        const found: KOParticipant = data.participant
        const alreadyIn = findEnrolled(found.cedula, koEnrolled)
        setLookupLoading(false)
        if (alreadyIn) { setLookupResult(found); setRegStep('already-enrolled'); return }
        setLookupResult(found)
        setRegStep('found')
      } catch {
        setLookupLoading(false)
        setRegStep('not-found')
      }
    }

    function handleConfirmExisting() {
      if (!lookupResult) return
      const entry: KOParticipant = { ...lookupResult, enrolledInKO: true, registeredAt: new Date().toISOString() }
      const next = [...koEnrolled.filter(p => p.cedula !== entry.cedula), entry]
      setKoEnrolled(next); saveKOEnrolled(next)
      setRegistered(true)
      setRegForm({ nombre: entry.nombre, cedula: entry.cedula, whatsapp: entry.whatsapp, ciudad: entry.ciudad ?? '', email: entry.email ?? '' })
      setToast('✅ ¡Inscripción confirmada! Ahora llena tu quiniela.')
      setRegStep('choose'); setLookupQuery(''); setLookupResult(null)
      setView('llenado')
    }

    function validateNew() {
      const errs: Record<string, string> = {}
      if (!regForm.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
      if (!regForm.cedula.trim()) errs.cedula = 'La cédula es obligatoria'
      else if (!/^\d{6,10}$/.test(regForm.cedula.trim())) errs.cedula = 'Solo números, 6-10 dígitos'
      if (!regForm.whatsapp.trim()) errs.whatsapp = 'El WhatsApp es obligatorio'
      else if (!/^04\d{9}$/.test(regForm.whatsapp.replace(/[\s\-]/g, ''))) errs.whatsapp = 'Formato: 04XXXXXXXXX'
      return errs
    }

    function handleNewSubmit() {
      const errs = validateNew(); setRegErrors(errs)
      if (Object.keys(errs).length > 0) return
      // Check duplicate
      if (findEnrolled(regForm.cedula.trim(), koEnrolled)) {
        setRegErrors({ cedula: 'Esta cédula ya está inscrita en Eliminatorias.' }); return
      }
      const entry: KOParticipant = {
        cedula: regForm.cedula.trim(), nombre: regForm.nombre.trim(),
        displayName: regForm.nombre.trim().split(' ').slice(0, 2).join(' '),
        whatsapp: regForm.whatsapp.trim(), ciudad: regForm.ciudad.trim() || null,
        email: regForm.email.trim() || null, previousRound: null,
        registeredAt: new Date().toISOString(), paymentStatus: 'pending', enrolledInKO: true,
      }
      const next = [...koEnrolled, entry]
      setKoEnrolled(next); saveKOEnrolled(next)
      setRegistered(true)
      setToast('✅ ¡Inscripción exitosa! Ahora llena tu quiniela.')
      setRegStep('choose'); setRegErrors({})
      setView('llenado')
    }

    const field = (id: keyof typeof regForm, label: string, placeholder: string, required: boolean, hint?: string, type = 'text') => (
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} value={regForm[id]} onChange={e => setRegForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${regErrors[id] ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-green-500'}`}
        />
        {hint && !regErrors[id] && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
        {regErrors[id] && <p className="text-[10px] text-red-500 mt-1">⚠ {regErrors[id]}</p>}
      </div>
    )

    // ── Header ─────────────────────────────────────────────────────────────────
    const header = (
      <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
        <button onClick={() => { setRegStep('choose'); setLookupQuery(''); setLookupResult(null); setRegErrors({}); setView('home') }}
          className="text-green-200 text-xs mb-3 flex items-center gap-1 hover:text-white">← Volver</button>
        <h1 className="text-xl font-extrabold mb-0.5">📝 Inscripción</h1>
        <p className="text-green-200 text-sm">Quiniela Eliminatorias 2026 · Mundial 2026</p>
      </div>
    )

    // ── STEP: choose ───────────────────────────────────────────────────────────
    if (regStep === 'choose') return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="space-y-4">
          {/* Option A — already participated */}
          <button onClick={() => setRegStep('lookup')}
            className="w-full bg-white border-2 border-green-300 hover:border-green-500 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-xl p-3 shrink-0 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-base mb-1">Ya participé antes</p>
                <p className="text-sm text-slate-500 leading-relaxed">Jugué en la Fase de Grupos 2026. Quiero continuar con mis datos guardados.</p>
                <p className="text-xs text-green-600 font-semibold mt-2">→ Busca por cédula o WhatsApp</p>
              </div>
            </div>
          </button>

          {/* Option B — new participant */}
          <button onClick={() => { setRegStep('new'); setRegForm({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' }); setRegErrors({}) }}
            className="w-full bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 rounded-xl p-3 shrink-0 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-base mb-1">Soy nuevo participante</p>
                <p className="text-sm text-slate-500 leading-relaxed">Es mi primera vez. Quiero registrarme para participar en Eliminatorias.</p>
                <p className="text-xs text-blue-600 font-semibold mt-2">→ Crear nueva cuenta</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-6">
          🔒 Tu cédula es tu identificador · No se comparte públicamente
        </p>
      </div>
    )

    // ── STEP: lookup ───────────────────────────────────────────────────────────
    if (regStep === 'lookup') return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-extrabold text-slate-800 text-base mb-1">Buscar mis datos</h2>
          <p className="text-sm text-slate-500 mb-4">Ingresa tu cédula o número de WhatsApp tal como te registraste en la Fase de Grupos.</p>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cédula o WhatsApp <span className="text-red-500">*</span></label>
          <input type="text" value={lookupQuery} onChange={e => setLookupQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="Ej: 12345678 o 04141234567"
            className="w-full border-2 border-slate-200 focus:border-green-500 rounded-xl px-4 py-3 text-sm focus:outline-none mb-4"
          />
          <button onClick={handleLookup} disabled={!lookupQuery.trim() || lookupLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all active:scale-95 touch-manipulation">
            {lookupLoading ? '🔍 Buscando…' : 'Buscar mis datos'}
          </button>
        </div>
        <button onClick={() => setRegStep('choose')} className="w-full text-slate-500 text-sm py-2 hover:text-slate-700">← Volver</button>
      </div>
    )

    // ── STEP: found ────────────────────────────────────────────────────────────
    if (regStep === 'found' && lookupResult) return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-extrabold shrink-0">
              {lookupResult.displayName[0]}
            </div>
            <div>
              <p className="text-xs text-green-700 font-semibold">✅ Datos encontrados</p>
              <p className="font-extrabold text-slate-800 text-base">{lookupResult.displayName}</p>
              <p className="text-xs text-green-600">Participó en la Fase de Grupos 2026</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 space-y-2 text-sm mb-4">
            <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Nombre</span> <strong>{lookupResult.nombre}</strong></p>
            <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Cédula</span> <strong>{maskCedula(lookupResult.cedula)}</strong></p>
            <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">WhatsApp</span> <strong>{lookupResult.whatsapp}</strong></p>
            <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Ciudad</span> <strong>{lookupResult.ciudad ?? <span className="text-slate-400 font-normal italic">No registrada</span>}</strong></p>
            <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Email</span> <strong>{lookupResult.email ?? <span className="text-slate-400 font-normal italic">No registrado</span>}</strong></p>
          </div>
          <p className="text-[10px] text-green-700 bg-green-100 rounded-lg px-3 py-1 mb-3 text-center font-mono">
            📡 Fuente: base de datos real · Fase de Grupos 2026
          </p>
          <p className="text-xs text-slate-600 mb-4 text-center">Ya tenemos tus datos de la fase anterior. Confirma para inscribirte en <strong>Quiniela Eliminatorias 2026</strong>.</p>
          <button onClick={handleConfirmExisting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl transition-all active:scale-95 touch-manipulation mb-2">
            ✅ Confirmar inscripción a Eliminatorias
          </button>
          <button onClick={() => { setRegStep('new'); setRegForm({ nombre: lookupResult!.nombre, cedula: lookupResult!.cedula, whatsapp: lookupResult!.whatsapp, ciudad: lookupResult!.ciudad ?? '', email: lookupResult!.email ?? '' }); setRegErrors({}) }}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all hover:bg-slate-50 mb-2">
            ✏️ Editar datos antes de confirmar
          </button>
          <button onClick={() => { setRegStep('choose'); setLookupQuery(''); setLookupResult(null) }}
            className="w-full text-slate-400 text-sm py-2 hover:text-slate-600">Cancelar</button>
        </div>
      </div>
    )

    // ── STEP: already-enrolled ─────────────────────────────────────────────────
    if (regStep === 'already-enrolled' && lookupResult) return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm mb-4 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="font-extrabold text-slate-800 text-lg mb-1">¡Ya estás inscrito!</h2>
          <p className="text-slate-600 text-sm mb-1">{lookupResult.displayName}</p>
          <p className="text-blue-600 text-sm mb-5">Ya estás inscrito en <strong>Quiniela Eliminatorias 2026</strong>. No puedes inscribirte dos veces.</p>
          <div className="space-y-2">
            <button onClick={() => { setRegistered(true); setRegForm({ nombre: lookupResult!.nombre, cedula: lookupResult!.cedula, whatsapp: lookupResult!.whatsapp, ciudad: lookupResult!.ciudad ?? '', email: lookupResult!.email ?? '' }); setRegStep('choose'); setView('mi-quiniela') }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all">
              📋 Ver mi quiniela
            </button>
            <button onClick={() => { setRegistered(true); setRegStep('choose'); setView('llenado') }}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50">
              ⚽ Continuar llenando
            </button>
            <button onClick={() => { setRegStep('choose'); setView('ranking') }}
              className="w-full text-blue-600 text-sm py-2 hover:text-blue-700 font-semibold">
              🏆 Ver ranking
            </button>
          </div>
        </div>
      </div>
    )

    // ── STEP: not-found ────────────────────────────────────────────────────────
    if (regStep === 'not-found') return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm mb-4 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="font-extrabold text-slate-800 text-lg mb-2">No encontramos datos previos</h2>
          <p className="text-slate-600 text-sm mb-1">No encontramos ningún participante con la cédula o WhatsApp:</p>
          <p className="font-mono font-bold text-slate-800 mb-4 bg-white border rounded-lg px-3 py-1.5 inline-block">{lookupQuery}</p>
          <p className="text-xs text-slate-500 mb-5">Puede que nunca hayas participado antes, o que hayas usado un número diferente.</p>
          <div className="space-y-2">
            <button onClick={() => { setRegStep('new'); setRegForm({ nombre: '', cedula: lookupQuery.length <= 10 ? lookupQuery : '', whatsapp: lookupQuery.startsWith('04') ? lookupQuery : '', ciudad: '', email: '' }); setRegErrors({}) }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all">
              ✨ Registrarme como nuevo participante
            </button>
            <button onClick={() => { setRegStep('lookup'); setLookupQuery('') }}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50">
              🔄 Buscar con otro dato
            </button>
          </div>
        </div>
      </div>
    )

    // ── STEP: new ──────────────────────────────────────────────────────────────
    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-10">
        {header}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-xs text-blue-700">
          <strong>Tu cédula es tu identificador.</strong> La usarás para acceder a tu quiniela. No necesitas recordar ningún código adicional.
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 mb-4">
          {field('nombre',   'Nombre completo',     'Ej: Carlos Eduardo Acosta',    true)}
          {field('cedula',   'Cédula de identidad', 'Ej: 12345678',                 true,  'Solo números, sin V- ni E-')}
          {field('whatsapp', 'WhatsApp',             'Ej: 04141234567',              true,  'Número venezolano: 04XXXXXXXXX', 'tel')}
          {field('ciudad',   'Ciudad',               'Ej: Caracas',                  false)}
          {field('email',    'Email',                'Ej: correo@ejemplo.com',       false, undefined, 'email')}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-xs text-slate-500 space-y-1">
          <p>🔒 Tu cédula no se mostrará completa en el ranking público.</p>
          <p>🚫 Una cédula puede inscribirse <strong>una sola vez</strong> en esta quiniela.</p>
        </div>
        <button onClick={handleNewSubmit}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg transition-all active:scale-95 touch-manipulation mb-3">
          ✅ Inscribirme en la quiniela
        </button>
        <button onClick={() => setRegStep('choose')} className="w-full text-slate-500 text-sm py-2 hover:text-slate-700">← Volver</button>
        <p className="text-[10px] text-slate-400 text-center mt-2">Vista previa interna · Datos de prueba</p>
      </div>
    )
  }

  // ── RESULTADOS ───────────────────────────────────────────────────────────────

  function renderResultados() {
    const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Caracas' })

    function shortDateLabel(d: string) {
      if (d === todayStr) return 'Hoy'
      const [y, mo, dy] = d.split('-').map(Number)
      const dt = new Date(`${y}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}T12:00:00-04:00`)
      return dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
    }

    // Filter matches by selected phase
    const filteredByPhase = resultPhaseFilter === 'all'
      ? KNOCKOUT_MATCHES
      : KNOCKOUT_MATCHES.filter(m => m.stage === resultPhaseFilter)

    // Available dates come ONLY from matches in the current phase — no stale dates from other phases
    const availableDates = [...new Set(filteredByPhase.map(m => m.date))].sort()

    // If the current resultDay has no matches in this phase, auto-pick the first valid date
    const activeDate = availableDates.includes(resultDay) ? resultDay : (availableDates[0] ?? resultDay)

    // Matches for the active date + phase, ordered by time
    const dayMatches = filteredByPhase
      .filter(m => m.date === activeDate)
      .sort((a, b) => a.timeVet.localeCompare(b.timeVet))

    const finishedCount = KNOCKOUT_MATCHES.filter(m => m.status === 'FINISHED').length
    const inPlayCount   = KNOCKOUT_MATCHES.filter(m => m.status === 'LIVE').length
    const totalCount    = KNOCKOUT_MATCHES.length

    const PHASE_TABS: { key: Stage | 'all'; label: string }[] = [
      { key: 'all',   label: 'Todos' },
      { key: 'R32',   label: 'Dieciseisavos' },
      { key: 'R16',   label: 'Octavos' },
      { key: 'QF',    label: 'Cuartos' },
      { key: 'SF',    label: 'Semis' },
      { key: 'FINAL', label: 'Final' },
    ]

    function handlePhaseChange(key: Stage | 'all') {
      setResultPhaseFilter(key)
      // Recalculate available dates for the new phase and jump to first valid date
      const newMatches = key === 'all' ? KNOCKOUT_MATCHES : KNOCKOUT_MATCHES.filter(m => m.stage === key)
      const newDates = [...new Set(newMatches.map(m => m.date))].sort()
      if (newDates.length > 0 && !newDates.includes(resultDay)) {
        setResultDay(newDates[0])
      }
    }

    // Mock demo picks for display (my predictions)
    const myPicks = picks

    function vetTime(timeVet: string) {
      const [h, m] = timeVet.split(':').map(Number)
      const ampm = h < 12 ? 'a. m.' : 'p. m.'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${h12}:${String(m).padStart(2,'0')} ${ampm} VET`
    }

    const activePhaseLabel = PHASE_TABS.find(t => t.key === resultPhaseFilter)?.label ?? 'Todos'

    return (
      <div className="min-h-screen bg-slate-50 pb-10">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-5">
            <h1 className="font-bold text-2xl">⚽ Resultados Eliminatorias</h1>
            <p className="text-green-200 text-sm">
              {finishedCount} de {totalCount} partidos jugados
              {inPlayCount > 0 && <> · <span className="text-blue-200 font-semibold">{inPlayCount} en juego ahora</span></>}
            </p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 mt-4 space-y-3">

          {/* Phase filter tabs */}
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1.5 px-0.5">
              1. Elige la fase
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PHASE_TABS.map(t => (
                <button key={t.key} onClick={() => handlePhaseChange(t.key)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    resultPhaseFilter === t.key
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Date tabs — only dates for the selected phase */}
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1.5 px-0.5">
              2. Elige el día · <span className="normal-case font-normal text-slate-400">Días con partidos de {activePhaseLabel}</span>
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableDates.map(d => (
                <button key={d} onClick={() => setResultDay(d)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    d === activeDate
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : d === todayStr
                      ? 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}>{shortDateLabel(d)}</button>
              ))}
            </div>
          </div>

          {/* Day summary */}
          {dayMatches.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-3">
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                <span className="text-slate-600">
                  <span className="font-bold text-slate-800">{dayMatches.length}</span> partido{dayMatches.length !== 1 ? 's' : ''}
                </span>
                {dayMatches.filter(m => m.status === 'FINISHED').length > 0 && (
                  <span className="text-green-700">✅ <span className="font-bold">{dayMatches.filter(m => m.status === 'FINISHED').length}</span> finalizado{dayMatches.filter(m => m.status === 'FINISHED').length !== 1 ? 's' : ''}</span>
                )}
                {dayMatches.filter(m => m.status === 'LIVE').length > 0 && (
                  <span className="text-blue-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-bold">{dayMatches.filter(m => m.status === 'LIVE').length}</span> en juego
                  </span>
                )}
                {dayMatches.filter(m => m.status === 'SCHEDULED').length > 0 && (
                  <span className="text-slate-400">🕐 <span className="font-bold">{dayMatches.filter(m => m.status === 'SCHEDULED').length}</span> por jugar</span>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
            <span>🎯 <strong>+3</strong> marcador exacto</span>
            <span>✅ <strong>+1</strong> resultado correcto</span>
            <span>❌ <strong>0</strong> incorrecto</span>
            <span className="text-slate-400">· Puntos pendientes hasta que se cargue el resultado final</span>
          </div>

          {/* Match cards */}
          {dayMatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-slate-400">No hay partidos para esta fecha{resultPhaseFilter !== 'all' ? ' en esta fase' : ''}.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dayMatches.map(m => {
                const isExpanded = resultMatchExpanded === m.id
                const myPick = myPicks[m.id]
                const isFinished = m.status === 'FINISHED'
                const isLive     = m.status === 'LIVE'

                // Demo predictions for this match
                const demoPreds = KO_DEMO_RANKING.slice(0, 6).map((r, i) => ({
                  name: r.displayName,
                  home: Math.floor(Math.random() * 4),
                  away: Math.floor(Math.random() * 3),
                }))

                return (
                  <div key={m.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                    isFinished ? 'border-green-100' : isLive ? 'border-blue-200' : 'border-slate-100'
                  }`}>
                    <div className="p-4">
                      {/* Match header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-400">{m.stageLabel} · #{m.fifaMatchNumber}</span>
                        {isFinished && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Finalizado</span>}
                        {isLive && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> En juego</span>}
                        {!isFinished && !isLive && <span className="text-xs text-slate-400">{vetTime(m.timeVet)}</span>}
                      </div>

                      {/* Teams */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <FlagImg flag={m.home.flag} size={26} />
                          <span className="font-semibold text-slate-800 text-sm truncate">{m.home.name ?? m.home.placeholder}</span>
                        </div>

                        {isFinished ? (
                          <div className="shrink-0 text-center">
                            <div className="flex items-center gap-2 bg-slate-800 text-white rounded-lg px-3 py-1.5">
                              <span className="text-lg font-bold">—</span>
                              <span className="text-slate-400 text-sm">—</span>
                              <span className="text-lg font-bold">—</span>
                            </div>
                          </div>
                        ) : (
                          <div className="shrink-0 text-center px-2">
                            <div className="text-slate-500 font-bold text-sm">vs</div>
                            <div className="text-xs text-slate-400">{vetTime(m.timeVet)}</div>
                          </div>
                        )}

                        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
                          <span className="font-semibold text-slate-800 text-sm truncate text-right">{m.away.name ?? m.away.placeholder}</span>
                          <FlagImg flag={m.away.flag} size={26} />
                        </div>
                      </div>

                      {/* My prediction */}
                      {myPick && (
                        <div className="mt-2 bg-blue-50 rounded-lg px-3 py-1.5 text-xs text-blue-700 flex items-center gap-2">
                          <span>📋 Mi pronóstico:</span>
                          <span className="font-bold tabular-nums">{myPick.home} – {myPick.away}</span>
                        </div>
                      )}

                      {/* Venue */}
                      <div className="mt-2 text-[10px] text-slate-400 text-center">{m.venue} · {m.city}</div>

                      {/* Toggle */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button onClick={() => setResultMatchExpanded(isExpanded ? null : m.id)}
                          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-1.5 rounded-lg transition-colors ${
                            isFinished ? 'text-green-700 hover:bg-green-50' : 'text-blue-700 hover:bg-blue-50'
                          }`}>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isExpanded ? 'Ocultar' : isFinished ? `🏆 Ver puntos (${demoPreds.length})` : `👁 Ver pronósticos (${demoPreds.length})`}
                        </button>
                      </div>
                    </div>

                    {/* Expanded predictions */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 px-4 pb-4">
                        <div className="space-y-1.5 mt-3 max-h-72 overflow-y-auto pr-1">
                          {demoPreds.map((p, i) => (
                            <div key={i} className="rounded-xl px-3 py-2 flex items-center justify-between gap-2 bg-white border border-slate-100">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-slate-400 text-xs font-mono w-5 text-right shrink-0">{i + 1}</span>
                                <p className="font-semibold text-slate-800 text-sm truncate">{p.name}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="bg-slate-700 text-white text-sm font-bold rounded-lg px-2.5 py-1 tabular-nums">
                                  {p.home}–{p.away}
                                </div>
                                {isFinished && (
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">— pts</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {!isFinished && (
                          <p className="text-xs text-slate-400 text-center mt-2">
                            Puntos pendientes hasta que se cargue el resultado final.
                          </p>
                        )}
                        <p className="text-[10px] text-slate-300 text-center mt-1">Demo · Los pronósticos reales se cargarán del backend</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
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
        {view === 'resultados'    && renderResultados()}
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
