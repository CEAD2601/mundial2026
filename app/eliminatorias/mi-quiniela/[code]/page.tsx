'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { KOMatch } from '@/lib/prototype/knockout-data'

type Pick = { matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: 'home' | 'away' | null }
type Result = { homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null; status: string }

type ParticipantData = {
  participant: {
    fullName: string; participationCode: string; isComplete: boolean; submittedAt: string | null
    payment: { paymentStatus: string } | null
    ranking: { totalPoints: number; playedMatches: number; currentPosition: number } | null
  }
  picks: Array<{ matchId: string; homeGoals: number; awayGoals: number; penaltyWinner: string | null; points: number | null }>
  results: Record<string, Result>
  matches: KOMatch[]
}

const STAGES = ['R32', 'R16', 'QF', 'SF', 'FINAL'] as const
const STAGE_LABELS: Record<string, string> = {
  R32: 'Dieciseisavos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semifinales', FINAL: 'Final'
}

function GoalStepper({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={disabled || value <= 0}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-lg flex items-center justify-center disabled:opacity-30 transition-colors">−</button>
      <span className="w-8 text-center font-extrabold text-xl tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(20, value + 1))} disabled={disabled}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-lg flex items-center justify-center disabled:opacity-30 transition-colors">+</button>
    </div>
  )
}

export default function KOPicksPage() {
  const { code } = useParams<{ code: string }>()
  const router   = useRouter()

  const [data, setData]       = useState<ParticipantData | null>(null)
  const [picks, setPicks]     = useState<Record<string, Pick>>({})
  const [saving, setSaving]   = useState(false)
  const [confirming, setConf] = useState(false)
  const [msg, setMsg]         = useState('')
  const [stage, setStage]     = useState<string>('R32')

  const load = useCallback(async () => {
    const res = await fetch(`/api/ko/picks?code=${code}`)
    if (!res.ok) { setMsg('No se encontró la quiniela.'); return }
    const json: ParticipantData = await res.json()
    setData(json)
    // Inicializar picks desde DB
    const initial: Record<string, Pick> = {}
    for (const p of json.picks) {
      initial[p.matchId] = { matchId: p.matchId, homeGoals: p.homeGoals, awayGoals: p.awayGoals, penaltyWinner: p.penaltyWinner as 'home' | 'away' | null }
    }
    setPicks(initial)
  }, [code])

  useEffect(() => { load() }, [load])

  const isLocked = (matchId: string) => {
    const r = data?.results[matchId]
    return r && r.status !== 'SCHEDULED'
  }

  const setPick = (matchId: string, field: keyof Pick, value: number | string | null) => {
    setPicks(prev => {
      const existing = prev[matchId] ?? { matchId, homeGoals: 0, awayGoals: 0, penaltyWinner: null }
      const updated  = { ...existing, [field]: value }
      // Si ya no es empate, limpiar penaltyWinner
      if (field === 'homeGoals' || field === 'awayGoals') {
        const h = field === 'homeGoals' ? (value as number) : existing.homeGoals
        const a = field === 'awayGoals' ? (value as number) : existing.awayGoals
        if (h !== a) updated.penaltyWinner = null
      }
      return { ...prev, [matchId]: updated }
    })
  }

  const savePicks = async (confirm = false) => {
    if (!data) return
    const toSave = Object.values(picks)
    if (toSave.length === 0) { setMsg('No hay cambios para guardar.'); return }

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
        setMsg('¡Quiniela confirmada! Ya no puedes modificar tus picks.')
        await load()
      } else {
        setMsg('Picks guardados correctamente.')
      }
    } catch { setMsg('Error de conexión') }
    finally { setSaving(false); setConf(false) }
  }

  if (!data) return <div className="text-center py-12 text-slate-400">{msg || 'Cargando...'}</div>

  const { participant } = data
  const isVerified  = participant.payment?.paymentStatus === 'VERIFIED'
  const isComplete  = participant.isComplete
  const stageMatches = data.matches.filter(m => m.stage === stage)

  // Contar picks completos en stage actual
  const openMatches = stageMatches.filter(m => m.isOpenForPredictions && !isLocked(m.id))
  const filledOpen  = openMatches.filter(m => picks[m.id]).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl text-white px-4 py-5">
        <p className="text-green-200 text-xs font-mono mb-0.5">{code}</p>
        <h1 className="text-lg font-extrabold">{participant.fullName}</h1>
        <div className="flex gap-4 mt-2 text-sm">
          {participant.ranking && (
            <>
              <span>🏆 {participant.ranking.totalPoints} pts</span>
              <span>📊 Pos. {participant.ranking.currentPosition}</span>
              <span>⚽ {participant.ranking.playedMatches} partidos</span>
            </>
          )}
          {!participant.ranking && <span className="text-green-300 text-xs">Sin puntos aún</span>}
        </div>
        {/* Estado pago */}
        <div className="mt-2">
          {isVerified
            ? <span className="text-xs bg-green-500/30 text-green-100 px-2 py-0.5 rounded-full">✅ Pago verificado</span>
            : <span className="text-xs bg-yellow-500/30 text-yellow-100 px-2 py-0.5 rounded-full">⏳ Pago pendiente · <a href={`/eliminatorias/pago/${code}`} className="underline">Reportar pago</a></span>
          }
          {isComplete && <span className="ml-2 text-xs bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full">🔒 Quiniela confirmada</span>}
        </div>
      </div>

      {/* Stage selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {STAGES.map(s => {
          const has = data.matches.some(m => m.stage === s)
          if (!has) return null
          return (
            <button key={s} onClick={() => setStage(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                stage === s ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {STAGE_LABELS[s]}
            </button>
          )
        })}
      </div>

      {/* Avance picks */}
      {openMatches.length > 0 && !isComplete && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm text-blue-700">
          {filledOpen}/{openMatches.length} partidos completados en {STAGE_LABELS[stage]}
          <div className="mt-1 h-1.5 bg-blue-100 rounded-full">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${openMatches.length ? (filledOpen/openMatches.length)*100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Partidos */}
      <div className="space-y-3">
        {stageMatches.map(match => {
          const locked  = isLocked(match.id)
          const result  = data.results[match.id]
          const pick    = picks[match.id]
          const isDraw  = pick && pick.homeGoals === pick.awayGoals
          const finished = result?.status === 'FINISHED'
          const pts = data.picks.find(p => p.matchId === match.id)?.points

          return (
            <div key={match.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${locked ? 'opacity-90' : ''}`}>
              {/* Match header */}
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <div className="text-xs text-slate-400">{match.date} · {match.displayTime} VET</div>
                {locked
                  ? <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{finished ? '🏁 Terminado' : '🔒 Bloqueado'}</span>
                  : <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✏️ Abierto</span>
                }
              </div>

              {/* Equipos y picks */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3">
                  {/* Local */}
                  <div className="flex-1 text-center">
                    <div className="text-2xl">{match.home.flag ?? '🏳️'}</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5 leading-tight">
                      {match.home.name ?? match.home.placeholder}
                    </div>
                  </div>

                  {/* Marcador / Pick */}
                  <div className="flex flex-col items-center gap-1">
                    {finished && result ? (
                      <div className="text-center">
                        <div className="font-extrabold text-2xl text-slate-800">
                          {result.homeGoals} – {result.awayGoals}
                        </div>
                        {result.penaltyWinner && (
                          <div className="text-xs text-slate-500">
                            Penales: {result.penaltyWinner === 'home' ? (match.home.name ?? 'Local') : (match.away.name ?? 'Visitante')}
                          </div>
                        )}
                        {pts !== undefined && pts !== null && (
                          <div className={`text-xs font-bold mt-0.5 ${pts >= 4 ? 'text-green-600' : pts >= 2 ? 'text-blue-600' : 'text-red-500'}`}>
                            {pts} pts
                          </div>
                        )}
                      </div>
                    ) : locked ? (
                      <div className="text-center text-slate-400">
                        <div className="font-bold text-lg">
                          {pick ? `${pick.homeGoals} – ${pick.awayGoals}` : '? – ?'}
                        </div>
                        {pick?.penaltyWinner && <div className="text-xs">Pen: {pick.penaltyWinner === 'home' ? '🏠' : '✈️'}</div>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <GoalStepper
                          value={pick?.homeGoals ?? 0}
                          onChange={v => setPick(match.id, 'homeGoals', v)}
                          disabled={!!locked || isComplete}
                        />
                        <span className="text-slate-300 font-bold">–</span>
                        <GoalStepper
                          value={pick?.awayGoals ?? 0}
                          onChange={v => setPick(match.id, 'awayGoals', v)}
                          disabled={!!locked || isComplete}
                        />
                      </div>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="flex-1 text-center">
                    <div className="text-2xl">{match.away.flag ?? '🏳️'}</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5 leading-tight">
                      {match.away.name ?? match.away.placeholder}
                    </div>
                  </div>
                </div>

                {/* Penales — solo si es empate y partido abierto */}
                {isDraw && !locked && !isComplete && !finished && (
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <p className="text-xs text-center text-slate-500 mb-2">⭐ Empate — ¿Quién avanza por penales?</p>
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => setPick(match.id, 'penaltyWinner', 'home')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                          pick?.penaltyWinner === 'home' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                        {match.home.flag ?? '🏠'} {match.home.code ?? 'Local'}
                      </button>
                      <button type="button"
                        onClick={() => setPick(match.id, 'penaltyWinner', 'away')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                          pick?.penaltyWinner === 'away' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                        {match.away.flag ?? '✈️'} {match.away.code ?? 'Visitante'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Venue */}
              <div className="px-4 pb-2 text-xs text-slate-300 text-center">{match.venue} · {match.city}</div>
            </div>
          )
        })}
      </div>

      {/* Acciones */}
      {!isComplete && openMatches.length > 0 && (
        <div className="space-y-2 pb-6">
          {msg && <div className={`rounded-xl px-4 py-3 text-sm text-center ${msg.includes('confirmada') ? 'bg-green-50 text-green-700' : msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{msg}</div>}
          <button onClick={() => savePicks(false)} disabled={saving || confirming}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Guardando...' : '💾 Guardar picks'}
          </button>
          <button onClick={() => savePicks(true)} disabled={saving || confirming || filledOpen < openMatches.length}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50">
            {confirming ? 'Confirmando...' : `✅ Confirmar quiniela (${filledOpen}/${openMatches.length})`}
          </button>
          <p className="text-center text-xs text-slate-400">Al confirmar, no podrás modificar tus picks.</p>
        </div>
      )}

      {isComplete && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center text-green-700 text-sm pb-6">
          🔒 Quiniela confirmada el {new Date(participant.submittedAt!).toLocaleDateString('es-VE')}
        </div>
      )}

      {msg && isComplete && (
        <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-3 text-sm text-center">{msg}</div>
      )}

      <div className="text-center pb-4">
        <a href="/eliminatorias/ranking" className="text-sm text-green-600 hover:underline">Ver ranking →</a>
      </div>
    </div>
  )
}
