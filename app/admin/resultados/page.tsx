'use client'

import { useState, useEffect } from 'react'

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
}

interface Match {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  status: string
  team1Goals: number | null
  team2Goals: number | null
  result: string | null
  team1: Team
  team2: Team
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function ResultadosAdminPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')
  const [scores, setScores] = useState<Record<string, { g1: string; g2: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [recalculating, setRecalculating] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const res = await fetch('/api/results')
    if (res.ok) {
      const data = await res.json()
      setMatches(data.matches ?? [])
      const initScores: Record<string, { g1: string; g2: string }> = {}
      for (const m of data.matches ?? []) {
        initScores[m.id] = {
          g1: m.team1Goals !== null ? String(m.team1Goals) : '',
          g2: m.team2Goals !== null ? String(m.team2Goals) : '',
        }
      }
      setScores(initScores)
    }
    setLoading(false)
  }

  const saveResult = async (matchId: string) => {
    const s = scores[matchId]
    if (s.g1 === '' || s.g2 === '') return
    setSaving(matchId)
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId,
        team1Goals: parseInt(s.g1),
        team2Goals: parseInt(s.g2),
      }),
    })
    if (res.ok) {
      await loadMatches()
    }
    setSaving(null)
  }

  const recalculate = async () => {
    setRecalculating(true)
    await fetch('/api/ranking', { method: 'POST' })
    setRecalculating(false)
    alert('Ranking recalculado correctamente')
  }

  const groupMatches = matches.filter((m) => m.group === activeGroup)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Resultados</h1>
        <button
          onClick={recalculate}
          disabled={recalculating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {recalculating ? 'Recalculando...' : '🔄 Recalcular ranking'}
        </button>
      </div>

      {/* Group tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeGroup === g ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {groupMatches.map((match) => {
            const s = scores[match.id] ?? { g1: '', g2: '' }
            const isFinished = match.status === 'FINISHED'
            return (
              <div key={match.id} className={`bg-white rounded-xl border p-4 shadow-sm ${isFinished ? 'border-green-200' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Partido #{match.matchNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isFinished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isFinished ? 'Finalizado' : 'Programado'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xl">{match.team1.flagEmoji}</span>
                    <span className="font-semibold text-slate-800 text-sm">{match.team1.displayName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={s.g1}
                      onChange={(e) => setScores({ ...scores, [match.id]: { ...s, g1: e.target.value } })}
                      className="w-12 text-center border border-slate-300 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-slate-400 font-bold">—</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={s.g2}
                      onChange={(e) => setScores({ ...scores, [match.id]: { ...s, g2: e.target.value } })}
                      className="w-12 text-center border border-slate-300 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => saveResult(match.id)}
                      disabled={saving === match.id || s.g1 === '' || s.g2 === ''}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ml-1"
                    >
                      {saving === match.id ? '...' : 'Guardar'}
                    </button>
                  </div>
                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <span className="font-semibold text-slate-800 text-sm text-right">{match.team2.displayName}</span>
                    <span className="text-xl">{match.team2.flagEmoji}</span>
                  </div>
                </div>
                {isFinished && match.result && (
                  <div className="mt-2 text-center text-xs text-green-600 font-medium">
                    Resultado: {match.result === 'G1' ? `Gana ${match.team1.shortName}` : match.result === 'G2' ? `Gana ${match.team2.shortName}` : 'Empate'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
