'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PagoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [settings, setSettings] = useState<{ paymentPhone: string; paymentNationalId: string; paymentBank: string; entryPriceUsd: number } | null>(null)
  const [existingPayment, setExistingPayment] = useState<{ paymentStatus: string; paymentReference: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    senderBank: '',
    paymentReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    loadData()
  }, [code])

  const loadData = async () => {
    const [rateRes, settingsRes, paymentRes] = await Promise.all([
      fetch('/api/exchange-rate'),
      fetch('/api/settings'),
      fetch(`/api/payments?code=${code}`),
    ])
    if (rateRes.ok) {
      const data = await rateRes.json()
      setExchangeRate(data.rate ?? 0)
    }
    if (settingsRes.ok) {
      const data = await settingsRes.json()
      setSettings(data.settings)
    }
    if (paymentRes.ok) {
      const data = await paymentRes.json()
      if (data.payment) setExistingPayment(data.payment)
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const entryPrice = settings?.entryPriceUsd ?? 20
  const amountVes = exchangeRate > 0 ? entryPrice * exchangeRate : 0

  const phone = settings?.paymentPhone ?? '04143043337'
  const ci = settings?.paymentNationalId ?? '4561947'
  const bank = settings?.paymentBank ?? 'Banesco'

  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero reportar mi pago para la Quiniela Mundial 2026.\n\nCódigo: ${code}\nMonto: $${entryPrice} USD\n(Bs. ${amountVes.toFixed(2)})`
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participationCode: code,
          senderBank: form.senderBank,
          paymentReference: form.paymentReference,
          paymentDate: form.paymentDate,
          amountVes,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/comprobante/${code}`), 1500)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Error al registrar el pago')
      }
    } catch {
      setError('Error de conexión')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚽</div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const alreadyPaid = existingPayment?.paymentStatus === 'VERIFIED' || existingPayment?.paymentStatus === 'IN_REVIEW'

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-xs text-green-200 mb-0.5">Quiniela Mundial 2026</p>
          <h1 className="font-bold text-lg">Instrucciones de Pago</h1>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {[1, 2, 3].map((n) => (
              <span key={n} className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">✓</span>
            ))}
            <div className="flex-1 h-0.5 bg-green-300" />
            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">4</span>
            <span className="font-medium text-green-700">Pago</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">5</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">
        {alreadyPaid && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            Ya registraste un pago ({existingPayment?.paymentStatus === 'VERIFIED' ? 'verificado' : 'en revisión'}).
            <Link href={`/comprobante/${code}`} className="ml-2 underline font-medium">Ver comprobante →</Link>
          </div>
        )}

        {/* Amount */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-5 text-center shadow-lg">
          <p className="text-green-200 text-sm mb-1">Monto a pagar</p>
          <p className="text-4xl font-bold">${entryPrice} <span className="text-lg font-normal">USD</span></p>
          {amountVes > 0 && (
            <p className="text-green-200 text-sm mt-1">≈ Bs. {amountVes.toFixed(2)} <span className="text-xs">(tasa {exchangeRate.toFixed(2)})</span></p>
          )}
        </div>

        {/* Payment details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">📱 Datos para pago móvil</h2>
          <div className="space-y-3">
            {[
              { label: 'Banco', value: bank },
              { label: 'Teléfono', value: phone },
              { label: 'Cédula', value: `V-${ci}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="font-bold text-slate-800">{value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(value, label)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    copied === label ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {copied === label ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/58${phone.replace(/^0/, '')}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-xl">📲</span> Contactar por WhatsApp
          </a>
        </div>

        {/* Report payment form */}
        {!alreadyPaid && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-700 mb-4">📋 Reportar mi pago</h2>
            {success ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-600 font-bold">¡Pago reportado!</p>
                <p className="text-slate-500 text-sm">Redirigiendo al comprobante...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Banco emisor</label>
                  <input
                    type="text"
                    value={form.senderBank}
                    onChange={(e) => setForm({ ...form, senderBank: e.target.value })}
                    placeholder="Ej: Mercantil, BDV, BOD..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Referencia del pago</label>
                  <input
                    type="text"
                    value={form.paymentReference}
                    onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
                    placeholder="Número de referencia"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha del pago</label>
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {submitting ? 'Enviando...' : 'Reportar pago'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
