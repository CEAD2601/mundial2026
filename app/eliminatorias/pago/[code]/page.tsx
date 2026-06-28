'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { KO_PAYMENT_PHONE, KO_PAYMENT_CI, KO_PAYMENT_BANK, KO_ZELLE_EMAIL } from '@/lib/ko/utils'

type PaymentInfo = {
  payment: { paymentStatus: string; paymentMethod?: string } | null
  entryUsd: number
  fixedRate: number
  amountVes: number
  participant: { fullName: string; participationCode: string }
}

export default function KOPagoPage() {
  const { code }  = useParams<{ code: string }>()
  const router    = useRouter()

  const [info, setInfo]       = useState<PaymentInfo | null>(null)
  const [method, setMethod]   = useState<'PAGO_MOVIL' | 'ZELLE'>('PAGO_MOVIL')
  const [form, setForm]       = useState({ senderBank: '', senderName: '', senderContact: '', paymentReference: '', paymentDate: '' })
  const [submitting, setSub]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch(`/api/ko/payments?code=${code}`)
      .then(r => r.json())
      .then(setInfo)
  }, [code])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSub(true)
    try {
      const body = method === 'PAGO_MOVIL'
        ? { participationCode: code, paymentMethod: 'PAGO_MOVIL', senderBank: form.senderBank, paymentReference: form.paymentReference, paymentDate: form.paymentDate }
        : { participationCode: code, paymentMethod: 'ZELLE', senderName: form.senderName, senderContact: form.senderContact, paymentReference: form.paymentReference, paymentDate: form.paymentDate }

      const res = await fetch('/api/ko/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al reportar pago'); return }
      setSuccess(true)
    } catch { setError('Error de conexión') }
    finally { setSub(false) }
  }

  if (!info) return <div className="text-center py-12 text-slate-400">Cargando...</div>

  if (info.payment?.paymentStatus === 'VERIFIED') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-5xl">✅</div>
        <h1 className="text-xl font-extrabold text-green-700">¡Pago verificado!</h1>
        <p className="text-slate-600">Hola {info.participant.fullName}, tu inscripción está confirmada.</p>
        <button onClick={() => router.push(`/eliminatorias/mi-quiniela/${code}`)}
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl w-full">
          Llenar mi quiniela →
        </button>
      </div>
    )
  }

  if (success || info.payment?.paymentStatus === 'IN_REVIEW') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-5xl">⏳</div>
        <h1 className="text-xl font-extrabold text-amber-700">Pago en revisión</h1>
        <p className="text-slate-600 text-sm">Verificaremos tu pago a la brevedad. Guarda tu código:</p>
        <div className="bg-slate-100 rounded-xl px-4 py-3 font-mono font-bold text-xl text-slate-800">{code}</div>
        <button onClick={() => router.push(`/eliminatorias/mi-quiniela/${code}`)}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl w-full text-sm">
          Ver mi quiniela →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-3xl mb-1">💳</div>
        <h1 className="text-xl font-extrabold text-slate-800">Pago — Dieciseisavos</h1>
        <p className="text-sm text-slate-500">Hola {info.participant.fullName}</p>
        <div className="inline-block bg-slate-100 rounded-lg px-3 py-1 mt-1 font-mono text-sm text-slate-600">{code}</div>
      </div>

      {/* Selector de método */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200">
        <button onClick={() => setMethod('PAGO_MOVIL')}
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${method === 'PAGO_MOVIL' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
          Pago Móvil
        </button>
        <button onClick={() => setMethod('ZELLE')}
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${method === 'ZELLE' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
          Zelle
        </button>
      </div>

      {/* Datos del destinatario */}
      {method === 'PAGO_MOVIL' ? (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 space-y-1 text-sm">
          <p className="font-bold text-green-800 mb-1">Datos Pago Móvil Banesco</p>
          <p><span className="text-green-600">Teléfono:</span> <strong>{KO_PAYMENT_PHONE}</strong></p>
          <p><span className="text-green-600">Cédula:</span> <strong>{KO_PAYMENT_CI}</strong></p>
          <p><span className="text-green-600">Banco:</span> <strong>{KO_PAYMENT_BANK}</strong></p>
          <p><span className="text-green-600">Monto:</span> <strong>Bs. {info.amountVes.toLocaleString('es-VE')}</strong></p>
          <p className="text-xs text-green-500">(Tasa fija: {info.fixedRate} Bs/USD)</p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1 text-sm">
          <p className="font-bold text-blue-800 mb-1">Datos Zelle</p>
          <p><span className="text-blue-600">Email:</span> <strong>{KO_ZELLE_EMAIL}</strong></p>
          <p><span className="text-blue-600">Monto:</span> <strong>${info.entryUsd} USD</strong></p>
        </div>
      )}

      {/* Formulario de reporte */}
      <form onSubmit={submit} className="space-y-3">
        {method === 'PAGO_MOVIL' ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Banco origen</label>
            <input type="text" placeholder="Ej: Mercantil, BDV, Provincial..."
              value={form.senderBank} onChange={e => setForm(f => ({ ...f, senderBank: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del remitente</label>
              <input type="text" placeholder="Nombre en Zelle"
                value={form.senderName} onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email / Teléfono Zelle</label>
              <input type="text" placeholder="email@ejemplo.com"
                value={form.senderContact} onChange={e => setForm(f => ({ ...f, senderContact: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Número de referencia / confirmación</label>
          <input type="text" placeholder="Referencia del pago"
            value={form.paymentReference} onChange={e => setForm(f => ({ ...f, paymentReference: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha del pago</label>
          <input type="date"
            value={form.paymentDate} onChange={e => setForm(f => ({ ...f, paymentDate: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

        <button type="submit" disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl text-base shadow-lg transition-all disabled:opacity-50">
          {submitting ? 'Enviando...' : 'Reportar pago →'}
        </button>
      </form>
    </div>
  )
}
