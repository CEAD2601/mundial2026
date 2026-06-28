'use client'

import { useState, useEffect, useCallback } from 'react'

type KOPayment = {
  id: string
  paymentStatus: string
  paymentMethod: string | null
  senderBank: string | null
  senderName: string | null
  senderEmail: string | null
  paymentReference: string | null
  paymentDate: string | null
  amountUsd: number
  amountVes: number | null
  adminNotes: string | null
  participant: { fullName: string; nationalId: string; participationCode: string; phone: string }
}

const STATUS_LABEL: Record<string, string> = { PENDING: 'Sin pago', IN_REVIEW: 'En revisión', VERIFIED: 'Verificado', REJECTED: 'Rechazado' }
const STATUS_COLOR: Record<string, string> = { PENDING: 'bg-slate-100 text-slate-600', IN_REVIEW: 'bg-amber-100 text-amber-700', VERIFIED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' }

export default function AdminKOPagosPage() {
  const [payments, setPayments] = useState<KOPayment[]>([])
  const [filter, setFilter]     = useState('IN_REVIEW')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [notes, setNotes]       = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('secret', 'CEAD2601')
    if (filter) params.set('status', filter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/ko/payments?${params}`)
    if (res.ok) setPayments((await res.json()).payments ?? [])
    setLoading(false)
  }, [filter, search])

  useEffect(() => { load() }, [load])

  const update = async (paymentId: string, status: string) => {
    setUpdating(paymentId)
    const res = await fetch('/api/admin/ko/payments?secret=CEAD2601', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, status, adminNotes: notes[paymentId] ?? undefined }),
    })
    if (res.ok) await load()
    setUpdating(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-800">Pagos — Eliminatorias</h1>
        <a href="/admin/eliminatorias" className="text-sm text-slate-400 hover:underline">← Dashboard</a>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['', 'PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {s ? STATUS_LABEL[s] : 'Todos'}
          </button>
        ))}
      </div>

      <input type="text" placeholder="Buscar por nombre, cédula, referencia..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />

      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-slate-400">Sin pagos en este filtro.</div>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">{p.participant.fullName}</div>
                  <div className="text-xs text-slate-400">CI: {p.participant.nationalId} · Tel: {p.participant.phone}</div>
                  <div className="text-xs font-mono text-slate-500">{p.participant.participationCode}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[p.paymentStatus]}`}>
                  {STATUS_LABEL[p.paymentStatus]}
                </span>
              </div>

              {/* Detalles pago */}
              {p.paymentMethod && (
                <div className="bg-slate-50 rounded-xl px-3 py-2 text-xs space-y-1">
                  <div><span className="text-slate-500">Método:</span> <strong>{p.paymentMethod === 'PAGO_MOVIL' ? 'Pago Móvil' : 'Zelle'}</strong></div>
                  {p.paymentMethod === 'PAGO_MOVIL' && p.senderBank && <div><span className="text-slate-500">Banco:</span> <strong>{p.senderBank}</strong></div>}
                  {p.paymentMethod === 'ZELLE' && p.senderName && <div><span className="text-slate-500">Remitente:</span> <strong>{p.senderName}</strong> ({p.senderEmail})</div>}
                  {p.paymentReference && <div><span className="text-slate-500">Referencia:</span> <strong>{p.paymentReference}</strong></div>}
                  {p.paymentDate && <div><span className="text-slate-500">Fecha:</span> {new Date(p.paymentDate).toLocaleDateString('es-VE')}</div>}
                  <div><span className="text-slate-500">Monto:</span> <strong>${p.amountUsd} USD {p.amountVes ? `· Bs. ${p.amountVes.toLocaleString('es-VE')}` : ''}</strong></div>
                </div>
              )}

              {/* Notas */}
              <textarea
                placeholder="Notas admin (opcional)"
                value={notes[p.id] ?? p.adminNotes ?? ''}
                onChange={e => setNotes(n => ({ ...n, [p.id]: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none h-14 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {/* Acciones */}
              <div className="flex gap-2">
                {p.paymentStatus !== 'VERIFIED' && (
                  <button onClick={() => update(p.id, 'VERIFIED')} disabled={updating === p.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {updating === p.id ? '...' : '✅ Verificar'}
                  </button>
                )}
                {p.paymentStatus !== 'REJECTED' && (
                  <button onClick={() => update(p.id, 'REJECTED')} disabled={updating === p.id}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {updating === p.id ? '...' : '❌ Rechazar'}
                  </button>
                )}
                {p.paymentStatus === 'VERIFIED' && (
                  <button onClick={() => update(p.id, 'PENDING')} disabled={updating === p.id}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                    Revertir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
