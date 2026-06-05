'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Prediction {
  id: string
  predictedTeam1Goals: number
  predictedTeam2Goals: number
  predictedResult: string
  points: number
  isExactScore: boolean | null
  isCorrectResult: boolean | null
  match: {
    matchNumber: number
    group: string
    kickoffUtc: string
    status: string
    team1Goals: number | null
    team2Goals: number | null
    result: string | null
    team1: { displayName: string; flagEmoji: string; shortName: string }
    team2: { displayName: string; flagEmoji: string; shortName: string }
  }
}

interface ParticipantDetail {
  id: string
  fullName: string
  participationCode: string
  isComplete: boolean
  submittedAt: string | null
  payment: { paymentStatus: string } | null
  predictions: Prediction[]
}

interface ParticipantSummary {
  id: string
  fullName: string
  nationalId: string
  participationCode: string
  isComplete: boolean
  submittedAt: string | null
  createdAt: string
  payment: { paymentStatus: string } | null
  _count: { predictions: number }
}

const STATUS_LABELS: Record<string, string> = { PENDING: 'Pendiente', IN_REVIEW: 'En revisión', VERIFIED: 'Verificado', REJECTED: 'Rechazado' }
const STATUS_COLORS: Record<string, string> = { PENDING: 'bg-slate-100 text-slate-600', IN_REVIEW: 'bg-orange-100 text-orange-700', VERIFIED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' }

export default function QuinielasAdminPage() {
  const [participants, setParticipants] = useState<ParticipantSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ParticipantDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { loadParticipants() }, [])

  const loadParticipants = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/participants?includeCount=true')
    if (res.ok) {
      const data = await res.json()
      setParticipants(data.participants ?? [])
    }
    setLoading(false)
  }

  const loadDetail = async (id: string) => {
    setDetailLoading(true)
    const res = await fetch(`/api/admin/participants/${id}/predictions`)
    if (res.ok) {
      const data = await res.json()
      setSelected(data.participant)
    }
    setDetailLoading(false)
  }

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch = p.fullName.toLowerCase().includes(q) || p.nationalId.includes(q) || p.participationCode.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || (p.payment?.paymentStatus ?? 'PENDING') === statusFilter
    return matchesSearch && matchesStatus
  })

  const predStatus = (pred: Prediction) => {
    if (pred.match.status !== 'FINISHED') return { label: 'Pendiente', cls: 'bg-slate-100 text-slate-500' }
    if (pred.isExactScore) return { label: 'Exacto ★', cls: 'bg-yellow-100 text-yellow-700' }
    if (pred.isCorrectResult) return { label: 'Acertado', cls: 'bg-green-100 text-green-700' }
    return { label: 'Falló', cls: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Quinielas</h1>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-4 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="font-bold text-slate-800">{selected.fullName}</h2>
                <p className="text-xs text-slate-500">{selected.participationCode} · {selected.predictions.length} predicciones</p>
              </div>
              <div className="flex gap-2 items-center">
                <Link href={`/mi-quiniela/${selected.participationCode}`} target="_blank" className="text-xs text-blue-600 hover:underline">Ver público →</Link>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
              </div>
            </div>
            {detailLoading ? (
              <div className="p-10 text-center text-slate-400">Cargando...</div>
            ) : (
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 text-slate-500">#</th>
                      <th className="text-left px-3 py-2 text-slate-500">Partido</th>
                      <th className="text-center px-3 py-2 text-slate-500">Predicción</th>
                      <th className="text-center px-3 py-2 text-slate-500">Real</th>
                      <th className="text-center px-3 py-2 text-slate-500">Pts</th>
                      <th className="text-center px-3 py-2 text-slate-500">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.predictions
                      .sort((a, b) => a.match.matchNumber - b.match.matchNumber)
                      .map((pred) => {
                        const st = predStatus(pred)
                        return (
                          <tr key={pred.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-400">{pred.match.matchNumber}</td>
                            <td className="px-3 py-2">
                              <span>{pred.match.team1.flagEmoji} {pred.match.team1.shortName}</span>
                              <span className="text-slate-300 mx-1">vs</span>
                              <span>{pred.match.team2.shortName} {pred.match.team2.flagEmoji}</span>
                            </td>
                            <td className="px-3 py-2 text-center font-mono font-bold">{pred.predictedTeam1Goals}–{pred.predictedTeam2Goals}</td>
                            <td className="px-3 py-2 text-center font-mono text-slate-600">
                              {pred.match.status === 'FINISHED' ? `${pred.match.team1Goals}–${pred.match.team2Goals}` : '—'}
                            </td>
                            <td className="px-3 py-2 text-center font-bold text-green-600">{pred.match.status === 'FINISHED' ? pred.points : '—'}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${st.cls}`}>{st.label}</span>
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
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-4 p-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los pagos</option>
            <option value="PENDING">Sin pago</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="VERIFIED">Verificado</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Participante</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Código</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-medium">Predicciones</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-medium">Quiniela</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Pago</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Enviada</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.fullName}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{p.participationCode}</span></td>
                    <td className="px-4 py-3 text-center text-slate-600">{p._count?.predictions ?? 0} / 72</td>
                    <td className="px-4 py-3 text-center">
                      {p.isComplete
                        ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ Completa</span>
                        : <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">Incompleta</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[p.payment?.paymentStatus ?? 'PENDING']}`}>
                        {STATUS_LABELS[p.payment?.paymentStatus ?? 'PENDING']}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('es-VE') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => loadDetail(p.id)}
                        className="text-xs text-blue-600 hover:underline mr-2"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
