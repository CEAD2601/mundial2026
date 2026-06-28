'use client'

import { useState, useEffect } from 'react'
import type { KOMatch } from '@/lib/prototype/knockout-data'

type MatchWithResult = KOMatch & {
  result: { homeGoals: number | null; awayGoals: number | null; penaltyWinner: string | null; status: string } | null
}

type Form = { homeGoals: string; awayGoals: string; penaltyWinner: 'home' | 'away' | '' }

export default function AdminKOResultadosPage() {
  const [matches, setMatches]   = useState<MatchWithResult[]>([])
  const [loading, setLoading]   = useState(true)
  const [forms, setForms]       = useState<Record<string, Form>>({})
  const [saving, setSaving]     = useState<string | null>(null)
  const [locking, setLocking]   = useState<string | null>(null)
  const [msg, setMsg]           = useState<Record<string, string>>({})
  const [stage, setStage]       = useState('R32')

  useEffect(() => {
    fetch('/api/admin/ko/results')
      .then(r => r.json())
      .then(d => { setMatches(d.matches ?? []); setLoading(false) })
  }, [])

  const stageMatches = matches.filter(m => m.stage === stage)

  const getForm = (id: string): Form => forms[id] ?? { homeGoals: '', awayGoals: '', penaltyWinner: '' }

  const setField = (id: string, field: keyof Form, value: string) => {
    setForms(prev => ({ ...prev, [id]: { ...getForm(id), [field]: value } }))
  }

  const saveResult = async (match: MatchWithResult) => {
    const f = getForm(match.id)
    const homeGoals = parseInt(f.homeGoals)
    const awayGoals = parseInt(f.awayGoals)

    if (isNaN(homeGoals) || isNaN(awayGoals)) { setMsg(m => ({ ...m, [match.id]: 'Ingresa los goles' })); return }
    if (homeGoals === awayGoals && !f.penaltyWinner) { setMsg(m => ({ ...m, [match.id]: 'Empate: selecciona ganador por penales' })); return }

    setSaving(match.id)
    setMsg(m => ({ ...m, [match.id]: '' }))
    const res = await fetch('/api/admin/ko/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: match.id, homeGoals, awayGoals,
        penaltyWinner: homeGoals === awayGoals ? f.penaltyWinner || null : null,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setMsg(m => ({ ...m, [match.id]: `✅ Resultado guardado · ${data.updated} picks actualizados` }))
      // Actualizar lista
      setMatches(prev => prev.map(m2 => m2.id === match.id
        ? { ...m2, result: { homeGoals, awayGoals, penaltyWinner: homeGoals === awayGoals ? f.penaltyWinner || null : null, status: 'FINISHED' } }
        : m2
      ))
    } else {
      setMsg(m => ({ ...m, [match.id]: data.error ?? 'Error' }))
    }
    setSaving(null)
  }

  const toggleLock = async (match: MatchWithResult) => {
    const isLocked = match.result?.status === 'LOCKED'
    setLocking(match.id)
    await fetch('/api/admin/ko/results', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: match.id, lock: !isLocked }),
    })
    setMatches(prev => prev.map(m2 => m2.id === match.id
      ? { ...m2, result: { ...(m2.result ?? { homeGoals: null, awayGoals: null, penaltyWinner: null }), status: isLocked ? 'SCHEDULED' : 'LOCKED' } }
      : m2
    ))
    setLocking(null)
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Cargando...</div>

  const stages = [...new Set(matches.map(m => m.stage))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-800">Resultados — Eliminatorias</h1>
        <a href="/admin/eliminatorias" className="text-sm text-slate-400 hover:underline">← Dashboard</a>
      </div>

      {/* Stage selector */}
      <div className="flex gap-2 overflow-x-auto">
        {stages.map(s => (
          <button key={s} onClick={() => setStage(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${stage === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {stageMatches.map(match => {
          const f      = getForm(match.id)
          const r      = match.result
          const isDone = r?.status === 'FINISHED'
          const isLocked = r?.status === 'LOCKED'
          const h = f.homeGoals !== '' ? parseInt(f.homeGoals) : NaN
          const a = f.awayGoals !== '' ? parseInt(f.awayGoals) : NaN
          const isDraw = !isNaN(h) && !isNaN(a) && h === a

          return (
            <div key={match.id} className={`bg-white rounded-2xl border shadow-sm px-4 py-4 space-y-3 ${isDone ? 'border-green-200' : isLocked ? 'border-amber-200' : 'border-slate-100'}`}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">{match.date} · {match.displayTime} VET</div>
                <div className="flex items-center gap-2">
                  {isDone && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Terminado</span>}
                  {isLocked && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">🔒 Bloqueado</span>}
                  {!isDone && (
                    <button onClick={() => toggleLock(match)} disabled={locking === match.id}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${isLocked ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {locking === match.id ? '...' : isLocked ? 'Desbloquear picks' : 'Bloquear picks'}
                    </button>
                  )}
                </div>
              </div>

              {/* Equipos */}
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{match.home.flag ?? '🏳️'} {match.home.name ?? match.home.placeholder}</span>
                <span className="text-slate-300">vs</span>
                <span>{match.away.flag ?? '🏳️'} {match.away.name ?? match.away.placeholder}</span>
              </div>

              {/* Resultado actual */}
              {isDone && r && (
                <div className="bg-green-50 rounded-xl px-3 py-2 text-sm">
                  <span className="font-bold">{r.homeGoals} – {r.awayGoals}</span>
                  {r.penaltyWinner && <span className="ml-2 text-green-600">· Penales: {r.penaltyWinner === 'home' ? match.home.name ?? 'Local' : match.away.name ?? 'Visitante'}</span>}
                </div>
              )}

              {/* Formulario ingreso resultado */}
              {!isDone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">{match.home.name ?? 'Local'}</label>
                      <input type="number" min={0} max={20} placeholder="0"
                        value={f.homeGoals}
                        onChange={e => setField(match.id, 'homeGoals', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                    <div className="text-slate-300 font-bold text-xl pt-5">–</div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">{match.away.name ?? 'Visitante'}</label>
                      <input type="number" min={0} max={20} placeholder="0"
                        value={f.awayGoals}
                        onChange={e => setField(match.id, 'awayGoals', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                  </div>

                  {isDraw && (
                    <div>
                      <p className="text-xs text-amber-700 font-semibold mb-1">⭐ Empate — ¿Quién avanza por penales?</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setField(match.id, 'penaltyWinner', 'home')}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${f.penaltyWinner === 'home' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {match.home.flag ?? '🏠'} {match.home.name ?? 'Local'}
                        </button>
                        <button type="button" onClick={() => setField(match.id, 'penaltyWinner', 'away')}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${f.penaltyWinner === 'away' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {match.away.flag ?? '✈️'} {match.away.name ?? 'Visitante'}
                        </button>
                      </div>
                    </div>
                  )}

                  {msg[match.id] && (
                    <div className={`text-xs px-3 py-2 rounded-lg ${msg[match.id].startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {msg[match.id]}
                    </div>
                  )}

                  <button onClick={() => saveResult(match)} disabled={saving === match.id}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {saving === match.id ? 'Guardando y calculando...' : '⚽ Guardar resultado'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
