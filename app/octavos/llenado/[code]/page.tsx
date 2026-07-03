'use client'

import { use, useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KNOCKOUT_MATCHES, KOTeam } from '@/lib/prototype/knockout-data'

// ── Bracket structure ────────────────────────────────────────────────────────

const R16_SOURCES: Record<string, { home: string; away: string }> = {
  'r16-89': { home: 'r32-74', away: 'r32-77' },
  'r16-90': { home: 'r32-73', away: 'r32-75' },
  'r16-91': { home: 'r32-76', away: 'r32-78' },
  'r16-92': { home: 'r32-79', away: 'r32-80' },
  'r16-93': { home: 'r32-83', away: 'r32-84' },
  'r16-94': { home: 'r32-81', away: 'r32-82' },
  'r16-95': { home: 'r32-86', away: 'r32-88' },
  'r16-96': { home: 'r32-85', away: 'r32-87' },
}
const QF_SOURCES: Record<string, { home: string; away: string }> = {
  'qf-97':  { home: 'r16-89', away: 'r16-90' },
  'qf-98':  { home: 'r16-93', away: 'r16-94' },
  'qf-99':  { home: 'r16-91', away: 'r16-92' },
  'qf-100': { home: 'r16-95', away: 'r16-96' },
}
const SF_SOURCES: Record<string, { home: string; away: string }> = {
  'sf-101': { home: 'qf-97',  away: 'qf-98'  },
  'sf-102': { home: 'qf-99',  away: 'qf-100' },
}

const R16_IDS   = ['r16-89','r16-90','r16-91','r16-92','r16-93','r16-94','r16-95','r16-96']
const QF_IDS    = ['qf-97','qf-98','qf-99','qf-100']
const SF_IDS    = ['sf-101','sf-102']
const FINAL_IDS = ['final-103','final-104']
const ALL_IDS   = [...R16_IDS, ...QF_IDS, ...SF_IDS, ...FINAL_IDS]

// ── Types ────────────────────────────────────────────────────────────────────

type Pick = { homeGoals: number; awayGoals: number; penaltyWinner: 'home' | 'away' | null }
type Teams = { home: KOTeam; away: KOTeam }
type DBResult = { homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null; status: string }
type Tab = 'r16' | 'qf' | 'sf' | 'final'

// ── Team resolution helpers ──────────────────────────────────────────────────

const MATCH_MAP = new Map(KNOCKOUT_MATCHES.map(m => [m.id, m]))

function ph(label: string): KOTeam {
  return { name: null, code: null, flag: null, placeholder: label }
}

function r32Winner(matchId: string, results: Record<string, DBResult>): KOTeam {
  const m = MATCH_MAP.get(matchId)!
  const r = results[matchId]
  if (!r || r.status !== 'FINISHED' || r.homeGoals == null || r.awayGoals == null)
    return ph(`Gan. #${m.fifaMatchNumber}`)
  if (r.homeGoals > r.awayGoals) return m.home
  if (r.awayGoals > r.homeGoals) return m.away
  if (r.penaltyWinner === 'home') return m.home
  if (r.penaltyWinner === 'away') return m.away
  return ph(`Gan. #${m.fifaMatchNumber}`)
}

function pickWinner(pick: Pick | undefined, home: KOTeam, away: KOTeam): KOTeam {
  if (!pick) return ph('?')
  if (pick.homeGoals > pick.awayGoals) return home
  if (pick.awayGoals > pick.homeGoals) return away
  if (pick.penaltyWinner === 'home') return home
  if (pick.penaltyWinner === 'away') return away
  return ph('?')
}
function pickLoser(pick: Pick | undefined, home: KOTeam, away: KOTeam): KOTeam {
  if (!pick) return ph('?')
  if (pick.homeGoals > pick.awayGoals) return away
  if (pick.awayGoals > pick.homeGoals) return home
  if (pick.penaltyWinner === 'home') return away
  if (pick.penaltyWinner === 'away') return home
  return ph('?')
}
function sameTeam(a: KOTeam, b: KOTeam) {
  return a.code === b.code && a.name === b.name && a.placeholder === b.placeholder
}

function computeTeams(picks: Record<string, Pick>, results: Record<string, DBResult>): Record<string, Teams> {
  const t: Record<string, Teams> = {}

  for (const id of R16_IDS) {
    const s = R16_SOURCES[id]
    t[id] = { home: r32Winner(s.home, results), away: r32Winner(s.away, results) }
  }
  for (const id of QF_IDS) {
    const s = QF_SOURCES[id]
    t[id] = {
      home: pickWinner(picks[s.home], t[s.home].home, t[s.home].away),
      away: pickWinner(picks[s.away], t[s.away].home, t[s.away].away),
    }
  }
  for (const id of SF_IDS) {
    const s = SF_SOURCES[id]
    t[id] = {
      home: pickWinner(picks[s.home], t[s.home].home, t[s.home].away),
      away: pickWinner(picks[s.away], t[s.away].home, t[s.away].away),
    }
  }
  t['final-104'] = {
    home: pickWinner(picks['sf-101'], t['sf-101'].home, t['sf-101'].away),
    away: pickWinner(picks['sf-102'], t['sf-102'].home, t['sf-102'].away),
  }
  t['final-103'] = {
    home: pickLoser(picks['sf-101'], t['sf-101'].home, t['sf-101'].away),
    away: pickLoser(picks['sf-102'], t['sf-102'].home, t['sf-102'].away),
  }
  return t
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OctavosLlenadoCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [fullName,   setFullName]   = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [picks,      setPicks]      = useState<Record<string, Pick>>({})
  const [results,    setResults]    = useState<Record<string, DBResult>>({})
  const [tab,        setTab]        = useState<Tab>('r16')
  const [saving,     setSaving]     = useState(false)
  const [saveMsg,    setSaveMsg]    = useState('')
  const [cascadeMsg, setCascadeMsg] = useState('')
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    fetch(`/api/ko/picks?code=${code}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); setLoading(false); return }
        if (d.participant.phase !== 'knockout_round_16_to_final') {
          router.replace(`/eliminatorias/mi-quiniela/${code}`)
          return
        }
        setFullName(d.participant.fullName)
        setIsComplete(d.participant.isComplete)
        setResults(d.results ?? {})
        const pm: Record<string, Pick> = {}
        for (const p of (d.picks ?? [])) {
          if (ALL_IDS.includes(p.matchId)) {
            pm[p.matchId] = { homeGoals: p.homeGoals, awayGoals: p.awayGoals, penaltyWinner: p.penaltyWinner ?? null }
          }
        }
        setPicks(pm)
        setLoading(false)
      })
      .catch(() => { setError('Error de conexión'); setLoading(false) })
  }, [code, router])

  const teams = useMemo(() => computeTeams(picks, results), [picks, results])

  const filledCount = useMemo(() =>
    ALL_IDS.filter(id => {
      const p = picks[id]
      if (!p) return false
      if (p.homeGoals === p.awayGoals && !p.penaltyWinner) return false
      return true
    }).length
  , [picks])

  const r16Done = R16_IDS.every(id => {
    const p = picks[id]; return p && !(p.homeGoals === p.awayGoals && !p.penaltyWinner)
  })
  const qfDone = QF_IDS.every(id => {
    const p = picks[id]; return p && !(p.homeGoals === p.awayGoals && !p.penaltyWinner)
  })
  const sfDone = SF_IDS.every(id => {
    const p = picks[id]; return p && !(p.homeGoals === p.awayGoals && !p.penaltyWinner)
  })

  function changePick(matchId: string, field: 'homeGoals' | 'awayGoals', val: number) {
    setPicks(prev => {
      const oldTeams = computeTeams(prev, results)
      const cur = prev[matchId] ?? { homeGoals: 0, awayGoals: 0, penaltyWinner: null }
      const updated = { ...prev, [matchId]: { ...cur, [field]: val, penaltyWinner: cur.penaltyWinner } }
      const newTeams = computeTeams(updated, results)

      // Cascade: clear downstream picks where teams changed
      const cleared: string[] = []
      for (const id of [...QF_IDS, ...SF_IDS, ...FINAL_IDS]) {
        const o = oldTeams[id]; const n = newTeams[id]
        if (o && n && (!sameTeam(o.home, n.home) || !sameTeam(o.away, n.away))) {
          if (updated[id]) { delete updated[id]; cleared.push(id) }
        }
      }
      if (cleared.length > 0) {
        setCascadeMsg(`Cambiaste un clasificado anterior. Se actualizaron ${cleared.length} pronóstico(s) en rondas siguientes.`)
        setTimeout(() => setCascadeMsg(''), 4000)
      }
      return updated
    })
  }

  function setPenalty(matchId: string, pw: 'home' | 'away' | null) {
    setPicks(prev => {
      const cur = prev[matchId] ?? { homeGoals: 0, awayGoals: 0, penaltyWinner: null }
      const updated = { ...prev, [matchId]: { ...cur, penaltyWinner: pw } }
      const oldTeams = computeTeams(prev, results)
      const newTeams = computeTeams(updated, results)
      for (const id of [...QF_IDS, ...SF_IDS, ...FINAL_IDS]) {
        const o = oldTeams[id]; const n = newTeams[id]
        if (o && n && (!sameTeam(o.home, n.home) || !sameTeam(o.away, n.away))) {
          if (updated[id]) delete updated[id]
        }
      }
      return updated
    })
  }

  async function handleSave(confirm = false) {
    if (saving) return
    setSaving(true)
    setSaveMsg('')
    try {
      const picksArr = ALL_IDS
        .filter(id => picks[id])
        .map(id => ({
          matchId:       id,
          homeGoals:     picks[id].homeGoals,
          awayGoals:     picks[id].awayGoals,
          penaltyWinner: picks[id].penaltyWinner ?? null,
        }))

      if (picksArr.length === 0) { setSaving(false); return }

      const res = await fetch('/api/ko/picks', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationCode: code, picks: picksArr, confirm }),
      })
      const data = await res.json()
      if (!res.ok) { setSaveMsg(data.error ?? 'Error al guardar'); setSaving(false); return }
      if (confirm) {
        setIsComplete(true)
        setSaveMsg('¡Quiniela confirmada! ✅')
        router.push(`/eliminatorias/pago/${code}`)
      } else {
        setSaveMsg('Guardado ✓')
        setTimeout(() => setSaveMsg(''), 2000)
      }
    } catch {
      setSaveMsg('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading / Error states ──────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-950 flex items-center justify-center">
      <div className="text-center text-white space-y-3">
        <div className="animate-spin w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full mx-auto" />
        <p className="text-blue-200 text-sm">Cargando tu quiniela…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="font-bold text-slate-800">{error}</h2>
        <Link href="/octavos/llenado" className="block bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
          Buscar mi quiniela
        </Link>
      </div>
    </div>
  )

  const pct = Math.round((filledCount / 16) * 100)

  // ── Render ──────────────────────────────────────────────────────────────────

  const TAB_DEFS: { id: Tab; label: string; ids: string[]; done: boolean; locked: boolean }[] = [
    { id: 'r16',   label: 'Octavos',     ids: R16_IDS,   done: r16Done, locked: false },
    { id: 'qf',    label: 'Cuartos',     ids: QF_IDS,    done: qfDone,  locked: !r16Done },
    { id: 'sf',    label: 'Semis',       ids: SF_IDS,    done: sfDone,  locked: !qfDone },
    { id: 'final', label: 'Final',       ids: FINAL_IDS, done: filledCount === 16, locked: !sfDone },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-blue-950 pb-36">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-800 to-indigo-800 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <p className="text-xs text-blue-300 truncate">Octavos a Final</p>
              <p className="font-bold text-white text-sm truncate max-w-[180px]">{fullName}</p>
              <p className="text-[10px] text-blue-400 font-mono">{code}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-blue-300">Progreso</p>
              <p className={`font-extrabold text-2xl ${filledCount === 16 ? 'text-yellow-300' : 'text-white'}`}>
                {filledCount}<span className="text-blue-400 text-base">/16</span>
              </p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 pb-2 flex gap-1">
          {TAB_DEFS.map(t => (
            <button
              key={t.id}
              onClick={() => !t.locked && setTab(t.id)}
              disabled={t.locked}
              className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-colors ${
                tab === t.id
                  ? 'bg-white text-blue-800'
                  : t.locked
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : t.done
                      ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40'
                      : 'bg-white/15 text-blue-200 hover:bg-white/25'
              }`}
            >
              {t.done && !t.locked ? '✓ ' : ''}{t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Cascade notice */}
      {cascadeMsg && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="bg-amber-400/20 border border-amber-400/40 rounded-xl px-4 py-2 text-amber-200 text-xs">
            ⚠️ {cascadeMsg}
          </div>
        </div>
      )}

      {/* ── Match cards ── */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {TAB_DEFS.find(t => t.id === tab)!.ids.map(matchId => (
          <MatchCard
            key={matchId}
            matchId={matchId}
            matchTeams={teams[matchId]}
            pick={picks[matchId]}
            locked={isComplete}
            onChange={(f, v) => changePick(matchId, f, v)}
            onPenalty={pw => setPenalty(matchId, pw)}
          />
        ))}
      </div>

      {/* ── Bottom action bar ── */}
      {!isComplete && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-blue-950 via-blue-950/95 to-transparent pt-6 pb-4 px-4">
          <div className="max-w-lg mx-auto space-y-2">
            {saveMsg && (
              <p className={`text-center text-sm font-semibold ${saveMsg.includes('Error') ? 'text-red-300' : 'text-green-300'}`}>
                {saveMsg}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
              >
                {saving ? '…' : '💾 Guardar'}
              </button>
              {filledCount === 16 ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3.5 rounded-2xl transition-colors text-sm"
                >
                  🏆 Confirmar quiniela →
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-white/10 text-white/40 font-bold py-3.5 rounded-2xl text-sm cursor-not-allowed"
                >
                  {16 - filledCount} faltan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-4 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-green-500 rounded-2xl px-4 py-3 text-white text-center">
              <p className="font-bold">¡Quiniela confirmada! ✅</p>
              <Link href={`/eliminatorias/pago/${code}`} className="text-green-100 text-sm underline">
                Ver estado de pago →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirming && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center px-4 pb-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="font-extrabold text-slate-800 text-lg">¿Confirmar quiniela?</h3>
              <p className="text-slate-500 text-sm mt-1">
                Una vez confirmada no podrás cambiar tus pronósticos. Tienes {filledCount}/16 partidos llenos.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setConfirming(false); handleSave(true) }}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Sí, confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ── MatchCard component ──────────────────────────────────────────────────────

function TeamDisplay({ team, side }: { team: KOTeam; side: 'home' | 'away' }) {
  const isReal = !!team.name
  return (
    <div className={`flex flex-col items-center gap-1 flex-1 ${side === 'away' ? '' : ''}`}>
      <span className="text-3xl leading-none">{team.flag ?? '🏳️'}</span>
      <span className={`text-xs font-bold text-center leading-tight ${isReal ? 'text-white' : 'text-blue-300'}`}>
        {team.name ?? team.placeholder}
      </span>
    </div>
  )
}

function Stepper({
  value, onChange, disabled,
}: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center transition-colors"
      >−</button>
      <span className="w-8 text-center text-2xl font-extrabold text-white">{value}</span>
      <button
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={disabled}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center transition-colors"
      >+</button>
    </div>
  )
}

function MatchCard({
  matchId, matchTeams, pick, locked, onChange, onPenalty,
}: {
  matchId:    string
  matchTeams: Teams
  pick:       Pick | undefined
  locked:     boolean
  onChange:   (field: 'homeGoals' | 'awayGoals', val: number) => void
  onPenalty:  (pw: 'home' | 'away' | null) => void
}) {
  const m = MATCH_MAP.get(matchId)
  const isDraw  = pick && pick.homeGoals === pick.awayGoals
  const hasPen  = isDraw && pick.penaltyWinner != null
  const needPen = isDraw && !pick.penaltyWinner
  const isValid = pick && !needPen

  const borderColor = isValid
    ? hasPen ? 'border-amber-400' : 'border-green-400'
    : pick ? 'border-red-400' : 'border-white/10'

  const homeIsReal = !!matchTeams.home.name
  const awayIsReal = !!matchTeams.away.name
  const bothReal   = homeIsReal && awayIsReal

  return (
    <div className={`bg-white/10 rounded-2xl border-2 ${borderColor} p-4 transition-colors`}>
      {/* Match meta */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-blue-300 font-mono">
          {m ? `#${m.fifaMatchNumber} · ${m.stageLabel}` : matchId}
        </span>
        {isValid && (
          <span className="text-[10px] text-green-300 font-bold">✓ Listo</span>
        )}
        {needPen && (
          <span className="text-[10px] text-red-300 font-bold">⚠ Falta penales</span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-2">
        <TeamDisplay team={matchTeams.home} side="home" />
        <div className="flex flex-col items-center gap-2">
          <Stepper value={pick?.homeGoals ?? 0} onChange={v => onChange('homeGoals', v)} disabled={locked || !bothReal} />
          <div className="text-blue-400 text-xs font-bold">vs</div>
          <Stepper value={pick?.awayGoals ?? 0} onChange={v => onChange('awayGoals', v)} disabled={locked || !bothReal} />
        </div>
        <TeamDisplay team={matchTeams.away} side="away" />
      </div>

      {/* Penalty selector */}
      {isDraw && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="text-xs text-amber-300 text-center mb-2 font-semibold">
            Empate — ¿Quién avanza por penales?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPenalty(pick?.penaltyWinner === 'home' ? null : 'home')}
              disabled={locked}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                pick?.penaltyWinner === 'home'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {matchTeams.home.flag ?? '🏳️'} {matchTeams.home.name ?? matchTeams.home.placeholder}
            </button>
            <button
              onClick={() => onPenalty(pick?.penaltyWinner === 'away' ? null : 'away')}
              disabled={locked}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                pick?.penaltyWinner === 'away'
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {matchTeams.away.flag ?? '🏳️'} {matchTeams.away.name ?? matchTeams.away.placeholder}
            </button>
          </div>
        </div>
      )}

      {/* Placeholder warning */}
      {!bothReal && (
        <p className="mt-2 text-center text-[10px] text-blue-400">
          Completa rondas anteriores para habilitar este partido
        </p>
      )}
    </div>
  )
}
