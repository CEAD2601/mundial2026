'use client'

import { useState } from 'react'

type R32Status = {
  complete: boolean
  finished: number
  total:    number
  missing:  { id: string; label: string }[]
}

export default function PhaseTransitionPanel({ r32Status, activePhase }: {
  r32Status:   R32Status
  activePhase: string
}) {
  const [loading, setLoading]   = useState(false)
  const [result,  setResult]    = useState<string | null>(null)
  const [isError, setIsError]   = useState(false)

  const alreadyOpen = activePhase === 'knockout_round_16_to_final'

  async function handleTransition() {
    if (!confirm('¿Cerrar Dieciseisavos y abrir Octavos a Final? Esta acción guardará el ranking histórico de R32.')) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/ko/phase-transition', { method: 'POST' })
      const json = await res.json()
      setIsError(!json.success)
      setResult(json.message)
      if (json.success) setTimeout(() => window.location.reload(), 1500)
    } catch {
      setIsError(true)
      setResult('Error de red. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (alreadyOpen) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔵</span>
          <div>
            <p className="font-bold text-blue-800">Octavos a Final está activa</p>
            <p className="text-blue-600 text-xs mt-0.5">Las inscripciones de R32 están cerradas. El ranking histórico de Dieciseisavos quedó guardado.</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <a href="/admin/eliminatorias/octavos"
            className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Gestionar Octavos a Final →
          </a>
          <a href="/admin/eliminatorias/historial-r32"
            className="text-xs font-bold bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            Ver ranking histórico R32
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-4 border text-sm ${
      r32Status.complete
        ? 'bg-emerald-50 border-emerald-300'
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">{r32Status.complete ? '✅' : '⏳'}</span>
        <div>
          <p className="font-bold text-slate-800">
            {r32Status.complete
              ? 'Todos los partidos de R32 están finalizados'
              : `R32 en curso — ${r32Status.finished}/${r32Status.total} partidos finalizados`}
          </p>
          {!r32Status.complete && r32Status.missing.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {r32Status.missing.map(m => (
                <li key={m.id} className="text-amber-700 text-xs">• {m.label}</li>
              ))}
            </ul>
          )}
          {r32Status.complete && (
            <p className="text-emerald-700 text-xs mt-0.5">
              Puedes cerrar Dieciseisavos y abrir Octavos a Final.
            </p>
          )}
        </div>
      </div>

      {r32Status.complete && (
        <button
          onClick={handleTransition}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Procesando…' : '🚀 Cerrar Dieciseisavos · Abrir Octavos a Final'}
        </button>
      )}

      {result && (
        <p className={`mt-2 text-xs font-semibold px-3 py-2 rounded-lg ${
          isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {result}
        </p>
      )}
    </div>
  )
}
