'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RankingEntry {
  position: number
  previousPosition: number | null
  movement: number
  participantId: string
  participationCode: string
  fullName: string
  displayName: string
  city: string | null
  totalPoints: number
  exactScores: number
  correctResults: number
  wrongPredictions: number
  pendingPredictions: number
  playedMatches: number
  effectivenessPercent: number
  totalGoalDiffError: number
  paymentStatus: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  IN_REVIEW: 'bg-orange-100 text-orange-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Sin pago',
  IN_REVIEW: 'En revisión',
  VERIFIED: 'Verificado',
  REJECTED: 'Rechazado',
}

export default function RankingAdminPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [filterVerified, setFilterVerified] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { loadRanking() }, [])

  const loadRanking = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ranking?admin=true')
      if (res.ok) {
        const data = await res.json()
        setRanking(data.ranking ?? [])
      }
    } catch {
      // silently fail — table will show empty state
    }
    setLoading(false)
  }

  const recalculate = async () => {
    setRecalculating(true)
    await fetch('/api/ranking', { method: 'POST' })
    await loadRanking()
    setRecalculating(false)
  }

  const filtered = ranking.filter((r) => {
    if (filterVerified && r.paymentStatus !== 'VERIFIED') return false
    if (search) {
      const q = search.toLowerCase()
      return (
        (r.fullName ?? '').toLowerCase().includes(q) ||
        (r.participationCode ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const exportCsv = () => {
    const header = 'Pos,Nombre,Código,Pago,Pts,Exactos,Acertados,Fallos,Pendientes,Partidos,Efectividad%'
    const rows = filtered.map((r) => [
      r.position,
      `"${r.fullName}"`,
      r.participationCode,
      r.paymentStatus,
      r.totalPoints,
      r.exactScores,
      r.correctResults,
      r.wrongPredictions,
      r.pendingPredictions,
      r.playedMatches,
      (r.effectivenessPercent ?? 0).toFixed(1),
    ].join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'ranking.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const posChange = (movement: number, prev: number | null) => {
    if (prev === null) return null
    if (movement > 0) return { label: `↑${movement}`, cls: 'text-green-600' }
    if (movement < 0) return { label: `↓${Math.abs(movement)}`, cls: 'text-red-500' }
    return { label: '—', cls: 'text-slate-300' }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Ranking</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportCsv}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📥 Exportar CSV
          </button>
          <button
            onClick={recalculate}
            disabled={recalculating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {recalculating ? '⏳ Recalculando...' : '🔄 Recalcular ranking'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-4 p-4">
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Buscar participante o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={(e) => setFilterVerified(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            Solo pagos verificados
          </label>
          <span className="text-xs text-slate-400">{filtered.length} participantes</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>No hay datos de ranking aún.</p>
            <button onClick={recalculate} className="mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
              Recalcular ranking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium w-12">Pos</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Participante</th>
                  <th className="text-left px-3 py-3 text-slate-500 font-medium">Pago</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">Pts</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">🎯 Exactos</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">✅ Acert.</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">❌ Fallos</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">Efectividad</th>
                  <th className="text-center px-3 py-3 text-slate-500 font-medium">Δ</th>
                  <th className="text-left px-3 py-3 text-slate-500 font-medium">Ver</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const change = posChange(r.movement, r.previousPosition)
                  return (
                    <tr key={r.participantId} className={`border-b border-slate-50 hover:bg-slate-50 ${i === 0 ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-3 py-3 text-center">
                        <span className={`font-extrabold text-lg ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : r.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{r.fullName}</div>
                        <div className="text-xs text-slate-400 font-mono">{r.participationCode}</div>
                        {r.city && <div className="text-xs text-slate-300">{r.city}</div>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.paymentStatus] ?? STATUS_COLORS.PENDING}`}>
                          {STATUS_LABELS[r.paymentStatus] ?? 'Sin pago'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-extrabold text-green-700 text-base">{r.totalPoints}</td>
                      <td className="px-3 py-3 text-center text-yellow-600 font-semibold">{r.exactScores}</td>
                      <td className="px-3 py-3 text-center text-green-600">{r.correctResults}</td>
                      <td className="px-3 py-3 text-center text-red-500">{r.wrongPredictions}</td>
                      <td className="px-3 py-3 text-center text-slate-600">{(r.effectivenessPercent ?? 0).toFixed(1)}%</td>
                      <td className="px-3 py-3 text-center text-xs font-semibold">
                        {change
                          ? <span className={change.cls}>{change.label}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/mi-quiniela/${r.participationCode}`}
                          target="_blank"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
