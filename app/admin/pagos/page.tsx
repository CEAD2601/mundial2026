'use client'

import { useState, useEffect } from 'react'

interface Payment {
  id: string
  paymentStatus: string
  senderBank: string | null
  paymentReference: string | null
  paymentDate: string | null
  amountUsd: number
  amountVes: number | null
  adminNotes: string | null
  participant: {
    fullName: string
    nationalId: string
    participationCode: string
    phone: string
  }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_REVIEW: 'En revisión',
  VERIFIED: 'Verificado',
  REJECTED: 'Rechazado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  IN_REVIEW: 'bg-orange-100 text-orange-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [notesModal, setNotesModal] = useState<{ paymentId: string; notes: string } | null>(null)

  useEffect(() => {
    loadPayments()
  }, [search, statusFilter])

  const loadPayments = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/payments?${params}`)
    if (res.ok) {
      const data = await res.json()
      setPayments(data.payments ?? [])
    }
    setLoading(false)
  }

  const updateStatus = async (paymentId: string, status: string, adminNotes?: string) => {
    setUpdating(paymentId)
    const res = await fetch('/api/admin/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, status, adminNotes }),
    })
    if (res.ok) {
      await loadPayments()
    }
    setUpdating(null)
    setNotesModal(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Pagos</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, referencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
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
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Banco</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Referencia</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Monto</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{p.participant.fullName}</div>
                      <div className="text-xs text-slate-400">{p.participant.nationalId} · {p.participant.participationCode}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.senderBank ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{p.paymentReference ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('es-VE') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">${p.amountUsd}</div>
                      {p.amountVes && <div className="text-xs text-slate-400">Bs. {p.amountVes.toFixed(2)}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[p.paymentStatus]}`}>
                        {STATUS_LABELS[p.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.paymentStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => updateStatus(p.id, 'VERIFIED')}
                            disabled={updating === p.id}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            ✓ Verificar
                          </button>
                        )}
                        {p.paymentStatus !== 'REJECTED' && (
                          <button
                            onClick={() => setNotesModal({ paymentId: p.id, notes: p.adminNotes ?? '' })}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                          >
                            ✗ Rechazar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No hay pagos con estos filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-lg text-slate-800 mb-3">Rechazar pago</h3>
            <p className="text-sm text-slate-500 mb-3">Ingresa el motivo del rechazo (opcional):</p>
            <textarea
              value={notesModal.notes}
              onChange={(e) => setNotesModal({ ...notesModal, notes: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
              placeholder="Motivo del rechazo..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setNotesModal(null)}
                className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => updateStatus(notesModal.paymentId, 'REJECTED', notesModal.notes)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
