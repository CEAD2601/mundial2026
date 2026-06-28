'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, Lock, Save, ArrowRight } from 'lucide-react'
import type { KOMatch } from '@/lib/prototype/knockout-data'

type Pick = { matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: 'home' | 'away' | null }
type Result = { homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null; status: string }

type ParticipantData = {
  participant: {
    fullName: string
    participationCode: string
    nationalId: string
    phone: string
    isComplete: boolean
    submittedAt: string | null
    payment: { paymentStatus: string } | null
    ranking: { totalPoints: number; playedMatches: number; currentPosition: number } | null
  }
  picks: Array<{ matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null; points: number | null }>
  results: Record<string, Result>
  matches: KOMatch[]
}

const STAGES = ['R32', 'R16', 'QF', 'SF', 'FINAL'] as const
const STAGE_LABELS: Record<string, string> = {
  R32: 'Dieciseisavos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semifinales', FINAL: 'Final',
}

function maskId(n: string) {
  if (!n || n.length <= 4) return 'V-••••'
  return 'V-' + n.slice(0, 2) + '••••' + n.slice(-2)
}
function maskPhone(p: string) {
  if (!p || p.length < 7) return p
  return p.slice(0, 4) + '••••' + p.slice(-3)
}

function GoalStepper({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-xl flex items-center justify-center disabled:opacity-30 transition-colors touch-manipulation select-none">
        −
      </button>
      <span className="w-8 text-center font-extrabold text-2xl tabular-nums select-none">{value}</span>
      <button type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={disabled}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-xl flex items-center justify-center disabled:opacity-30 transition-colors touch-manipulation select-none">
        +
      </button>
    </div>
  )
}

function MatchCard({
  match, pick, touched, onScoreChange, onPenalty, locked, result, savedPts,
}: {
  match: KOMatch
  pick: Pick | undefined
  touched: boolean
  onScoreChange: (matchId: string, field: 'homeGoals' | 'awayGoals', val: number) => void
  onPenalty: (matchId: string, w: 'home' | 'away') => void
  locked: boolean
  result: Result | undefined
  savedPts: number | null | undefined
}) {
  const hasPick   = touched && pick !== undefined
  const isDraw    = hasPick && pick.homeGoals === pick.awayGoals
  const isComplete = hasPick && (pick.homeGoals !== pick.awayGoals || !!pick.penaltyWinner)
  const finished  = result?.status === 'FINISHED'

  const homeName = match.home.name ?? match.home.placeholder ?? 'Por definir'
  const awayName = match.away.name ?? match.away.placeholder ?? 'Por definir'

  const dateObj = new Date(match.date + 'T12:00:00')
  const dateStr = dateObj.toLocaleDateString('es-VE', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Caracas',
  })

  return (
    <article
      id={`match-${match.id}`}
      className={`bg-white rounded-2xl border-2 p-4 transition-all duration-200 ${
        finished       ? 'border-slate-200' :
        isComplete     ? 'border-green-300 shadow-sm' :
        isDraw         ? 'border-amber-300 shadow-sm' :
        hasPick        ? 'border-green-200 shadow-sm' :
        locked         ? 'border-slate-100 bg-slate-50/60' :
                         'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
          #{match.fifaMatchNumber}
        </span>
        <div className="text-right min-w-0">
          <p className="text-xs text-slate-600 font-semibold">{dateStr} · {match.displayTime} VET</p>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-start gap-2">
        {/* Home */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start gap-1">
            <span className="text-3xl leading-none">{match.home.flag ?? '🏳️'}</span>
            <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-2">{homeName}</p>
          </div>
          <div className="mt-3">
            {locked || finished ? (
              finished && result ? (
                <span className="text-2xl font-extrabold text-slate-800">{result.homeGoals}</span>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <Lock size={13} />
                  <span className="text-xs">Por definir</span>
                </div>
              )
            ) : (
              <GoalStepper
                value={pick?.homeGoals ?? 0}
                onChange={v => onScoreChange(match.id, 'homeGoals', v)}
                disabled={locked}
              />
            )}
          </div>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center shrink-0 gap-1 px-1 pt-6">
          <span className="text-xs font-bold text-slate-300">vs</span>
          {hasPick && !finished && (
            <span className={`text-sm font-extrabold ${
              pick.homeGoals > pick.awayGoals ? 'text-green-600' :
              pick.awayGoals > pick.homeGoals ? 'text-blue-600' :
              'text-amber-600'
            }`}>
              {pick.homeGoals}–{pick.awayGoals}
            </span>
          )}
          {finished && result && (
            <div className="text-center">
              <span className="text-lg font-extrabold text-slate-700">–</span>
              {savedPts !== null && savedPts !== undefined && (
                <div className={`text-xs font-bold mt-0.5 ${savedPts >= 4 ? 'text-green-600' : savedPts >= 2 ? 'text-blue-600' : 'text-red-500'}`}>
                  {savedPts} pts
                </div>
              )}
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <div className="flex flex-col items-end gap-1">
            <span className="text-3xl leading-none">{match.away.flag ?? '🏳️'}</span>
            <p className="text-xs font-bold text-slate-700 leading-tight text-right line-clamp-2">{awayName}</p>
          </div>
          <div className="mt-3 flex justify-end">
            {locked || finished ? (
              finished && result ? (
                <span className="text-2xl font-extrabold text-slate-800">{result.awayGoals}</span>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-xs">Por definir</span>
                  <Lock size={13} />
                </div>
              )
            ) : (
              <GoalStepper
                value={pick?.awayGoals ?? 0}
                onChange={v => onScoreChange(match.id, 'awayGoals', v)}
                disabled={locked}
              />
            )}
          </div>
        </div>
      </div>

      {/* Penalty picker */}
      {hasPick && isDraw && !locked && !finished && (
        <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-800 mb-2.5 flex items-center gap-1.5">
            ⚖️ Empate — ¿Quién gana por penales?
            <span className="font-normal text-amber-600">(obligatorio)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPenalty(match.id, 'home')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all touch-manipulation ${
                pick.penaltyWinner === 'home'
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
              }`}>
              {match.home.flag ?? '🏠'} {homeName.length > 14 ? homeName.split(' ')[0] : homeName}
            </button>
            <button
              onClick={() => onPenalty(match.id, 'away')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all touch-manipulation ${
                pick.penaltyWinner === 'away'
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
              }`}>
              {match.away.flag ?? '✈️'} {awayName.length > 14 ? awayName.split(' ')[0] : awayName}
            </button>
          </div>
          {!pick.penaltyWinner && (
            <p className="text-[10px] text-amber-600 mt-2 text-center">
              ⚠️ Debes elegir un ganador por penales para que tu pronóstico sea válido.
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-2 ${
        isComplete ? 'border-green-100' : isDraw ? 'border-amber-100' : 'border-slate-100'
      }`}>
        <p className="text-xs text-slate-400 min-w-0 truncate">
          📍 {match.venue} · {match.city}
        </p>
        {finished && (
          <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            🏁 Terminado
          </span>
        )}
        {!finished && isComplete && (
          <span className="text-xs font-bold text-green-600 flex items-center gap-1 shrink-0">
            <CheckCircle size={11} /> Listo
          </span>
        )}
        {!finished && isDraw && !pick?.penaltyWinner && (
          <span className="text-xs font-bold text-amber-600 shrink-0">⚠️ Falta penales</span>
        )}
        {!finished && locked && (
          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
            <Lock size={11} /> Bloqueado
          </span>
        )}
        {!finished && !locked && !hasPick && (
          <span className="text-xs text-slate-400 shrink-0">Pendiente</span>
        )}
      </div>
    </article>
  )
}

export default function KOPicksPage() {
  const { code } = useParams<{ code: string }>()
  const router   = useRouter()

  const [data, setData]       = useState<ParticipantData | null>(null)
  const [picks, setPicks]     = useState<Record<string, Pick>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [saving, setSaving]   = useState(false)
  const [confirming, setConf] = useState(false)
  const [msg, setMsg]         = useState('')
  const [stage, setStage]     = useState<string>('R32')
  const matchListRef          = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/ko/picks?code=${code}`)
    if (!res.ok) { setMsg('No se encontró la quiniela.'); return }
    const json: ParticipantData = await res.json()
    setData(json)
    // Pre-cargar picks existentes en DB y marcarlos como touched
    const initial: Record<string, Pick> = {}
    const initialTouched = new Set<string>()
    for (const p of json.picks) {
      initial[p.matchId] = {
        matchId: p.matchId,
        homeGoals: p.homeGoals,
        awayGoals: p.awayGoals,
        penaltyWinner: p.penaltyWinner as 'home' | 'away' | null,
      }
      initialTouched.add(p.matchId)
    }
    setPicks(initial)
    setTouched(initialTouched)
  }, [code])

  useEffect(() => { load() }, [load])

  const isMatchLocked = (matchId: string) => {
    const r = data?.results[matchId]
    return r && r.status !== 'SCHEDULED'
  }

  // Bloqueo por tiempo: el partido no acepta picks si ya comenzó
  // Usa la hora VET (UTC-4) del match: match.date + 'T' + match.timeVet + ':00-04:00'
  const isMatchTimePassed = (match: KOMatch) => {
    const matchStart = new Date(`${match.date}T${match.timeVet}:00-04:00`)
    return Date.now() >= matchStart.getTime()
  }

  const handleScoreChange = (matchId: string, field: 'homeGoals' | 'awayGoals', val: number) => {
    setTouched(prev => new Set([...prev, matchId]))
    setPicks(prev => {
      const existing = prev[matchId] ?? { matchId, homeGoals: 0, awayGoals: 0, penaltyWinner: null }
      const updated  = { ...existing, [field]: val }
      const h = field === 'homeGoals' ? val : existing.homeGoals
      const a = field === 'awayGoals' ? val : existing.awayGoals
      if (h !== a) updated.penaltyWinner = null
      return { ...prev, [matchId]: updated }
    })
  }

  const handlePenalty = (matchId: string, w: 'home' | 'away') => {
    setTouched(prev => new Set([...prev, matchId]))
    setPicks(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] ?? { matchId, homeGoals: 0, awayGoals: 0, penaltyWinner: null }), penaltyWinner: w },
    }))
  }

  const isValidPick = (pick: Pick | undefined) => {
    if (!pick) return false
    if (pick.homeGoals === pick.awayGoals && !pick.penaltyWinner) return false
    return true
  }

  const savePicks = async (confirm = false) => {
    if (!data) return
    // Solo guardar picks "touched"
    const toSave = Object.values(picks).filter(p => touched.has(p.matchId))
    if (toSave.length === 0 && !confirm) { setMsg('No hay cambios para guardar.'); return }

    confirm ? setConf(true) : setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/ko/picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationCode: code, picks: toSave, confirm }),
      })
      const json = await res.json()
      if (!res.ok) { setMsg(json.error ?? 'Error al guardar'); return }
      if (confirm) {
        await load()
        setMsg('¡Quiniela confirmada!')
      } else {
        setMsg('✅ Picks guardados.')
      }
    } catch { setMsg('Error de conexión') }
    finally { setSaving(false); setConf(false) }
  }

  const goToFirstPending = () => {
    if (!data) return
    const pending = stageMatches.find(m => !touched.has(m.id) || !isValidPick(picks[m.id]))
    if (pending) {
      document.getElementById(`match-${pending.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!data) return (
    <div className="text-center py-12 text-slate-400">
      {msg ? <p className="text-red-500">{msg}</p> : 'Cargando…'}
    </div>
  )

  const { participant } = data
  const isVerified  = participant.payment?.paymentStatus === 'VERIFIED'
  const isComplete  = participant.isComplete
  const stageMatches = data.matches.filter(m => m.stage === stage)
  const openMatches  = stageMatches.filter(m => !isMatchLocked(m.id) && !isMatchTimePassed(m))

  // filledCount: solo partidos touched con pick válido
  const filledCount  = stageMatches.filter(m => touched.has(m.id) && isValidPick(picks[m.id])).length
  const totalCount   = stageMatches.length
  const pct          = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0
  const allDone      = filledCount >= totalCount
  const pendingCount = totalCount - filledCount

  // Para confirmar: necesita todos los openMatches con pick válido y touched
  const canConfirm   = openMatches.every(m => touched.has(m.id) && isValidPick(picks[m.id]))

  return (
    <div className="pb-28">
      {/* Sticky header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <p className="text-xs text-green-200">Quiniela de</p>
              <p className="font-bold text-sm truncate max-w-[180px]">{participant.fullName}</p>
              <p className="text-[10px] text-green-300">{maskId(participant.nationalId)} · {maskPhone(participant.phone)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-green-200">Marcadores</p>
              <p className="font-bold text-lg text-yellow-300">{filledCount}/{totalCount}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-green-100 mt-1 text-right">{pct}% completado</p>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-hide">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
            <a href="/eliminatorias/registro" className="text-slate-400 shrink-0 hover:text-green-600 transition-colors">Registro</a>
            <div className="flex-1 h-px bg-slate-200 min-w-3" />
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isComplete ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white'}`}>
              {isComplete ? '✓' : '2'}
            </span>
            <span className={`font-semibold shrink-0 ${isComplete ? 'text-green-700' : 'text-green-700'}`}>Pronósticos</span>
            <div className="flex-1 h-px bg-slate-200 min-w-3" />
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isComplete ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-400'}`}>
              {isComplete ? '✓' : '3'}
            </span>
            <span className={`shrink-0 ${isComplete ? 'text-green-700 font-semibold' : 'text-slate-400'}`}>Confirmar</span>
            <div className="flex-1 h-px bg-slate-200 min-w-3" />
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-400'}`}>
              {isVerified ? '✓' : '4'}
            </span>
            <span className={`shrink-0 ${isVerified ? 'text-green-700 font-semibold' : 'text-slate-400'}`}>Pagar</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Scoring hint */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
          <p className="text-[10px] font-bold text-blue-800 mb-1.5 uppercase tracking-wide">Sistema de puntos</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-blue-700">
            <span><span className="font-extrabold text-green-700">🏆 +2</span> Clasificado correcto</span>
            <span><span className="font-extrabold text-yellow-700">🎯 +2</span> Marcador exacto</span>
            <span><span className="font-extrabold text-amber-600">⭐ +1</span> Bonus penales</span>
            <span><span className="font-extrabold text-slate-500">❌ 0</span> Fallo</span>
          </div>
          <p className="text-[10px] text-blue-400 mt-1">El marcador no incluye penales · Máx. 5 pts por partido</p>
        </div>

        {/* Stage tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {(STAGES as readonly string[]).map(s => {
            const hasMatches = data.matches.some(m => m.stage === s)
            if (!hasMatches) return null
            const sMatches = data.matches.filter(m => m.stage === s)
            const sFilled  = sMatches.filter(m => touched.has(m.id) && isValidPick(picks[m.id])).length
            const sDone    = sFilled >= sMatches.length && sMatches.length > 0
            const sPartial = sFilled > 0 && !sDone
            const active   = s === stage
            return (
              <button key={s} onClick={() => setStage(s)}
                className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation ${
                  active   ? 'bg-green-600 text-white shadow-sm' :
                  sDone    ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                  sPartial ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' :
                             'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}>
                {STAGE_LABELS[s] ?? s}
                {sDone && !active && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full text-white text-[8px] flex items-center justify-center">✓</span>
                )}
                {sPartial && !active && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                )}
              </button>
            )
          })}
        </div>

        {/* Stage heading */}
        <div ref={matchListRef} className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-slate-800 text-base">{STAGE_LABELS[stage] ?? stage}</h2>
            {isComplete && <p className="text-xs text-green-600 font-semibold">🔒 Quiniela confirmada</p>}
          </div>
          <span className={`text-sm font-extrabold ${allDone ? 'text-green-600' : 'text-amber-600'}`}>
            {filledCount}/{totalCount}
          </span>
        </div>

        {/* Match list */}
        <div className="space-y-3">
          {stageMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              pick={picks[match.id]}
              touched={touched.has(match.id)}
              onScoreChange={handleScoreChange}
              onPenalty={handlePenalty}
              locked={!!isMatchLocked(match.id) || isComplete || isMatchTimePassed(match)}
              result={data.results[match.id]}
              savedPts={data.picks.find(p => p.matchId === match.id)?.points}
            />
          ))}
        </div>

        {/* Completion block */}
        {!isComplete && stageMatches.length > 0 && (
          <div className="mt-6">
            {allDone ? (
              <div className="bg-green-600 rounded-2xl p-5 shadow-lg">
                <p className="text-white font-bold text-sm mb-1">✅ ¡Dieciseisavos completados!</p>
                <p className="text-green-200 text-xs mb-3">Todos los pronósticos están listos.</p>
                <button onClick={() => savePicks(true)} disabled={confirming || !canConfirm}
                  className="w-full bg-white text-green-700 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 text-base hover:bg-green-50 shadow transition-all active:scale-95 touch-manipulation disabled:opacity-50">
                  {confirming ? 'Confirmando…' : 'Confirmar quiniela definitivamente'} <ArrowRight size={20} />
                </button>
                {!canConfirm && (
                  <p className="text-green-300 text-xs mt-2 text-center">Falta seleccionar ganador en algunos empates.</p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📝</span>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">
                      {pendingCount === 1 ? 'Te falta 1 partido.' : `Te faltan ${pendingCount} partidos.`}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">Ingresa el marcador de cada partido.</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{filledCount}/{totalCount}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isComplete && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center text-green-700 text-sm">
            🔒 Quiniela confirmada el {new Date(participant.submittedAt!).toLocaleDateString('es-VE')}
          </div>
        )}

        {msg && (
          <div className={`mt-3 rounded-xl px-4 py-3 text-sm text-center ${
            msg.includes('confirmada') || msg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
            msg.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>{msg}</div>
        )}

        {/* Pago CTA */}
        {!isVerified && isComplete && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-yellow-800 mb-1">⚠️ Pago pendiente</p>
            <p className="text-xs text-yellow-700 mb-3">Tu participación queda validada cuando el admin confirme el pago.</p>
            <a href={`/eliminatorias/pago/${code}`}
              className="block w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-3 rounded-xl text-sm transition-all active:scale-95">
              💳 Ir a reportar pago →
            </a>
          </div>
        )}

        <div className="text-center mt-4 pb-2">
          <a href="/eliminatorias/ranking" className="text-sm text-green-600 hover:underline">Ver ranking →</a>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      {!isComplete && openMatches.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-30">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {allDone ? (
              <div className="flex gap-2">
                <button onClick={() => savePicks(false)} disabled={saving}
                  className="shrink-0 border border-green-600 text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 flex items-center gap-1.5 text-sm transition-all touch-manipulation disabled:opacity-50">
                  <Save size={14} /> Guardar
                </button>
                <button onClick={() => savePicks(true)} disabled={confirming || !canConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition-all touch-manipulation disabled:opacity-50">
                  {confirming ? 'Confirmando…' : 'Confirmar quiniela'} <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => savePicks(false)} disabled={saving}
                  className="shrink-0 border border-slate-300 text-slate-600 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 text-sm transition-all touch-manipulation disabled:opacity-50">
                  <Save size={14} /> {saving ? 'Guardando…' : 'Guardar'}
                </button>
                <button onClick={goToFirstPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all touch-manipulation">
                  🔍 Ir al pendiente
                  <span className="bg-amber-700/70 text-xs px-2 py-0.5 rounded-full font-extrabold">{pendingCount}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
