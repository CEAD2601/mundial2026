'use client'

import { useState, useEffect, useCallback } from 'react'

interface Payment {
  id: string
  paymentStatus: string
  senderBank: string | null
  paymentReference: string | null
  paymentDate: string | null
  amountUsd: number
  amountVes: number | null
  exchangeRate: number | null
  adminNotes: string | null
  verifiedAt: string | null
  participant: {
    id: string
    fullName: string
    nationalId: string
    participationCode: string
    phone: string
  }
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

interface ActionModal {
  type: 'verify' | 'reject' | 'review' | 'revert' | 'edit_ref'
  payment: Payment
  notes: string
  reference?: string
  bank?: string
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [modal, setModal] = useState<ActionModal | null>(null)

  const loadPayments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/payments?${params}`)
    if (res.ok) setPayments((await res.json()).payments ?? [])
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => { loadPayments() }, [loadPayments])

  const updateStatus = async (
    paymentId: string,
    status: string,
    opts?: { adminNotes?: string; paymentReference?: string; senderBank?: string }
  ) => {
    setUpdating(paymentId)
    const res = await fetch('/api/admin/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, status, ...opts }),
    })
    const data = await res.json()
    if (!res.ok) alert(data.error ?? 'Error al actualizar')
    await loadPayments()
    setUpdating(null)
    setModal(null)
  }

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'

  const fmtVes = (n: number | null) =>
    n ? n.toLocaleString('es-VE', { maximumFractionDigits: 0 }) + ' Bs' : '—'

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Pagos</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-5 p-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, WhatsApp, referencia, código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Sin pago</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="VERIFIED">Verificado</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {(['PENDING','IN_REVIEW','VERIFIED','REJECTED'] as const).map((s) => {
          const count = payments.filter(p => p.paymentStatus === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              className={`rounded-xl p-3 text-center border-2 transition-all ${
                statusFilter === s ? 'border-green-500 shadow-md' : 'border-transparent'
              } ${STATUS_COLORS[s].replace('text-','bg-').split(' ')[0].replace('bg-','bg-').includes('slate') ? 'bg-slate-50' : ''}`}
            >
              <div className={`text-xl font-extrabold ${STATUS_COLORS[s].split(' ')[1]}`}>{count}</div>
              <div className="text-xs text-slate-500 mt-0.5">{STATUS_LABELS[s]}</div>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Cargando...</div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No hay pagos con estos filtros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Participante</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Banco / Ref.</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Monto</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    {/* Participant info */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{p.participant.fullName}</div>
                      <div className="text-xs text-slate-400">{p.participant.nationalId}</div>
                      <div className="text-xs text-slate-400">{p.participant.phone}</div>
                      <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                        {p.participant.participationCode}
                      </span>
                    </td>
                    {/* Bank & reference */}
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{p.senderBank ?? '—'}</div>
                      <div className="font-mono text-xs text-slate-500">{p.paymentReference ?? '—'}</div>
                      {p.adminNotes && (
                        <div className="text-xs text-amber-600 italic mt-1">{p.adminNotes}</div>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      <div>{fmtDate(p.paymentDate)}</div>
                      {p.verifiedAt && (
                        <div className="text-green-500 mt-0.5">✓ {fmtDate(p.verifiedAt)}</div>
                      )}
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">${p.amountUsd} USD</div>
                      <div className="text-xs text-slate-400">{fmtVes(p.amountVes)}</div>
                      {p.exchangeRate && (
                        <div className="text-xs text-slate-300">{p.exchangeRate} Bs/USD</div>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[p.paymentStatus]}`}>
                        {STATUS_LABELS[p.paymentStatus]}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 min-w-[130px]">
                        {p.paymentStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => setModal({ type: 'verify', payment: p, notes: p.adminNotes ?? '' })}
                            disabled={updating === p.id}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg disabled:opacity-50 font-semibold text-left"
                          >
                            ✓ Verificar pago
                          </button>
                        )}
                        {p.paymentStatus === 'VERIFIED' && (
                          <button
                            onClick={() => setModal({ type: 'revert', payment: p, notes: '' })}
                            disabled={updating === p.id}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            ↩ Revertir
                          </button>
                        )}
                        {p.paymentStatus !== 'IN_REVIEW' && p.paymentStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => updateStatus(p.id, 'IN_REVIEW')}
                            disabled={updating === p.id}
                            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            ⏳ En revisión
                          </button>
                        )}
                        {p.paymentStatus !== 'REJECTED' && (
                          <button
                            onClick={() => setModal({ type: 'reject', payment: p, notes: p.adminNotes ?? '' })}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg"
                          >
                            ✗ Rechazar
                          </button>
                        )}
                        <button
                          onClick={() => setModal({ type: 'edit_ref', payment: p, notes: p.adminNotes ?? '', reference: p.paymentReference ?? '', bank: p.senderBank ?? '' })}
                          className="text-xs text-blue-600 hover:underline px-2.5 py-1 text-left"
                        >
                          ✏️ Editar datos
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ACTION MODALS ─────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">

            {/* VERIFY */}
            {modal.type === 'verify' && (
              <>
                <h3 className="font-bold text-lg text-slate-800 mb-1">✓ Verificar pago</h3>
                <p className="text-sm text-slate-500 mb-4">
                  <strong>{modal.payment.participant.fullName}</strong><br />
                  {modal.payment.paymentReference ? `Ref: ${modal.payment.paymentReference}` : 'Sin referencia registrada'}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 mb-4">
                  Al verificar, este participante aparecerá en el ranking público y se registrará la fecha y hora de verificación.
                </div>
                <textarea
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                  rows={2}
                  placeholder="Nota interna (opcional)..."
                />
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm hover:bg-slate-50">Cancelar</button>
                  <button
                    onClick={() => updateStatus(modal.payment.id, 'VERIFIED', { adminNotes: modal.notes || undefined })}
                    disabled={updating === modal.payment.id}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating === modal.payment.id ? 'Verificando...' : 'Confirmar verificación'}
                  </button>
                </div>
              </>
            )}

            {/* REJECT */}
            {modal.type === 'reject' && (
              <>
                <h3 className="font-bold text-lg text-slate-800 mb-3">✗ Rechazar pago</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Motivo del rechazo para <strong>{modal.payment.participant.fullName}</strong>:
                </p>
                <textarea
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                  rows={3}
                  placeholder="Motivo del rechazo (opcional)..."
                />
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm hover:bg-slate-50">Cancelar</button>
                  <button
                    onClick={() => updateStatus(modal.payment.id, 'REJECTED', { adminNotes: modal.notes || undefined })}
                    disabled={updating === modal.payment.id}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </>
            )}

            {/* REVERT */}
            {modal.type === 'revert' && (
              <>
                <h3 className="font-bold text-lg text-slate-800 mb-3">{'↩'} Revertir verificaci{'ó'}n</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Esto cambiará el estado de <strong>{modal.payment.participant.fullName}</strong> de Verificado a En revisión. El participante dejará de aparecer en el ranking público.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm hover:bg-slate-50">Cancelar</button>
                  <button
                    onClick={() => updateStatus(modal.payment.id, 'IN_REVIEW', { adminNotes: 'Verificación revertida por admin' })}
                    disabled={updating === modal.payment.id}
                    className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50"
                  >
                    Revertir
                  </button>
                </div>
              </>
            )}

            {/* EDIT REFERENCE */}
            {modal.type === 'edit_ref' && (
              <>
                <h3 className="font-bold text-lg text-slate-800 mb-3">{'✏️'} Editar datos de pago</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Para <strong>{modal.payment.participant.fullName}</strong>. Puedes agregar datos enviados por WhatsApp.
                </p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Banco emisor</label>
                    <input
                      type="text"
                      value={modal.bank ?? ''}
                      onChange={(e) => setModal({ ...modal, bank: e.target.value })}
                      placeholder="Ej: Banesco, Mercantil..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Número de referencia</label>
                    <input
                      type="text"
                      value={modal.reference ?? ''}
                      onChange={(e) => setModal({ ...modal, reference: e.target.value })}
                      placeholder="Número de referencia del pago"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Nota interna (opcional)</label>
                    <input
                      type="text"
                      value={modal.notes}
                      onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                      placeholder="Ej: Enviado por WhatsApp"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm hover:bg-slate-50">Cancelar</button>
                  <button
                    onClick={() => updateStatus(modal.payment.id, modal.payment.paymentStatus, {
                      adminNotes: modal.notes || undefined,
                      paymentReference: modal.reference || undefined,
                      senderBank: modal.bank || undefined,
                    })}
                    disabled={updating === modal.payment.id}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

