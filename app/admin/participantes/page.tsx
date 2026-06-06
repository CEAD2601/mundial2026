'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Participant {
  id: string
  fullName: string
  nationalId: string
  phone: string
  email: string | null
  city: string | null
  participationCode: string
  isComplete: boolean
  createdAt: string
  payment: {
    id: string
    paymentStatus: string
    paymentReference: string | null
    senderBank: string | null
    amountUsd: number
    amountVes: number | null
  } | null
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Sin pago',
  IN_REVIEW: 'En revisión',
  VERIFIED: 'Verificado',
  REJECTED: 'Rechazado',
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function ParticipantesPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadParticipants = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/participants?limit=200')
    if (res.ok) setParticipants((await res.json()).participants ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadParticipants() }, [loadParticipants])

  const setPaymentStatus = async (paymentId: string, status: string) => {
    setUpdating(paymentId)
    await fetch('/api/admin/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, status }),
    })
    await loadParticipants()
    setUpdating(null)
  }

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch =
      p.fullName.toLowerCase().includes(q) ||
      p.nationalId.includes(q) ||
      p.phone.includes(q) ||
      p.participationCode.toLowerCase().includes(q) ||
      (p.city ?? '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || (p.payment?.paymentStatus ?? 'PENDING') === statusFilter
    return matchSearch && matchStatus
  })

  const exportCsv = () => {
    const h = 'Nombre,Cédula,WhatsApp,Código,Ciudad,Quiniela,Pago,Referencia,Banco,Monto USD,Monto Bs'
    const rows = filtered.map(p => [
      `"${p.fullName}"`,
      p.nationalId,
      p.phone,
      p.participationCode,
      p.city ?? '',
      p.isComplete ? 'Completa' : 'Incompleta',
      STATUS_LABELS[p.payment?.paymentStatus ?? 'PENDING'],
      p.payment?.paymentReference ?? '',
      p.payment?.senderBank ?? '',
      p.payment?.amountUsd ?? 20,
      p.payment?.amountVes ?? '',
    ].join(','))
    const blob = new Blob([[h, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'participantes.csv'; a.click()
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Participantes</h1>
          <p className="text-sm text-slate-500">{participants.length} registrados · {filtered.length} visibles</p>
        </div>
        <button onClick={exportCsv} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl">
          📥 Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-5 p-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Nombre, cédula, WhatsApp, código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-40 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los pagos</option>
            <option value="PENDING">Sin pago</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="VERIFIED">Verificado</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Participante</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Código</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Quiniela</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Pago</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Monto</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const payStatus = p.payment?.paymentStatus ?? 'PENDING'
                  const payId = p.payment?.id ?? ''
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                      {/* Participant info */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{p.fullName}</div>
                        <div className="text-xs text-slate-400">{p.nationalId}</div>
                        <div className="text-xs text-slate-400">{p.phone}</div>
                        {p.city && <div className="text-xs text-slate-300">{p.city}</div>}
                      </td>
                      {/* Code */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{p.participationCode}</span>
                      </td>
                      {/* Quiniela status */}
                      <td className="px-4 py-3">
                        {p.isComplete
                          ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ Completa</span>
                          : <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">Incompleta</span>}
                      </td>
                      {/* Payment status */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[payStatus]}`}>
                          {STATUS_LABELS[payStatus]}
                        </span>
                        {p.payment?.paymentReference && (
                          <div className="text-xs text-slate-400 font-mono mt-1">{p.payment.paymentReference}</div>
                        )}
                      </td>
                      {/* Expected amount */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <div>20 USD</div>
                        <div className="text-slate-400">14.600 Bs</div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {payStatus !== 'VERIFIED' && payId && (
                            <button
                              onClick={() => setPaymentStatus(payId, 'VERIFIED')}
                              disabled={updating === payId}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg disabled:opacity-50 font-semibold"
                            >
                              ✓ Verificar
                            </button>
                          )}
                          {payStatus === 'VERIFIED' && payId && (
                            <button
                              onClick={() => setPaymentStatus(payId, 'IN_REVIEW')}
                              disabled={updating === payId}
                              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                            >
                              {'↩'} Revertir
                            </button>
                          )}
                          {payStatus !== 'IN_REVIEW' && payStatus !== 'VERIFIED' && payId && (
                            <button
                              onClick={() => setPaymentStatus(payId, 'IN_REVIEW')}
                              disabled={updating === payId}
                              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                            >
                              {'⏳'} En revisi{'ó'}n
                            </button>
                          )}
                          {payStatus !== 'REJECTED' && payId && (
                            <button
                              onClick={() => setPaymentStatus(payId, 'REJECTED')}
                              disabled={updating === payId}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg"
                            >
                              ✗ Rechazar
                            </button>
                          )}
                          <Link
                            href={`/mi-quiniela/${p.participationCode}`}
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline px-2.5 py-1"
                          >
                            Ver quiniela →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No se encontraron participantes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

