'use client'

import { useState, useEffect, useCallback } from 'react'

type KOParticipant = {
  id: string
  fullName: string
  nationalId: string
  phone: string
  participationCode: string
  isComplete: boolean
  createdAt: string
  phase: string
  picks: Array<{ matchId: string }>
  payment: { paymentStatus: string; paymentMethod: string | null; paymentReference: string | null } | null
  ranking: { totalPoints: number; currentPosition: number } | null
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-500',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}
const STATUS_LABEL: Record<string, string> = { PENDING: 'Sin pago', IN_REVIEW: 'En revisión', VERIFIED: '✅ Verificado', REJECTED: '❌ Rechazado' }

export default function AdminKOParticipantesPage() {
  const [participants, setParticipants] = useState<KOParticipant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/ko/participants?${params}`)
    if (res.ok) setParticipants((await res.json()).participants ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { load() }, [load])

  const verified  = participants.filter(p => p.payment?.paymentStatus === 'VERIFIED').length
  const inReview  = participants.filter(p => p.payment?.paymentStatus === 'IN_REVIEW').length
  const completed = participants.filter(p => p.isComplete).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-800">Participantes — Eliminatorias</h1>
        <a href="/admin/eliminatorias" className="text-sm text-slate-400 hover:underline">← Dashboard</a>
      </div>

      <div className="flex gap-4 text-sm text-slate-600">
        <span>Total: <strong>{participants.length}</strong></span>
        <span>Verificados: <strong className="text-green-700">{verified}</strong></span>
        <span>En revisión: <strong className="text-amber-700">{inReview}</strong></span>
        <span>Quinielas confirmadas: <strong className="text-blue-700">{completed}</strong></span>
      </div>

      <input type="text" placeholder="Buscar por nombre, cédula, código..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />

      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {participants.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">{p.fullName}</div>
                  <div className="text-xs text-slate-400">CI: {p.nationalId} · {p.phone}</div>
                  <div className="text-xs font-mono text-slate-500">{p.participationCode}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[p.payment?.paymentStatus ?? 'PENDING']}`}>
                    {STATUS_LABEL[p.payment?.paymentStatus ?? 'PENDING']}
                  </span>
                  {p.ranking && (
                    <div className="text-xs text-slate-500 mt-1">🏆 {p.ranking.totalPoints} pts · Pos. {p.ranking.currentPosition}</div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-slate-500">
                <span>{p.picks.length} picks</span>
                <span>{p.isComplete ? '🔒 Confirmada' : '✏️ Abierta'}</span>
                <span>{new Date(p.createdAt).toLocaleDateString('es-VE')}</span>
              </div>
            </div>
          ))}
          {participants.length === 0 && (
            <div className="text-center py-8 text-slate-400">Sin participantes.</div>
          )}
        </div>
      )}
    </div>
  )
}
