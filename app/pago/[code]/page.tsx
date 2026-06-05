'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPaymentProofWhatsAppUrl } from '@/lib/whatsapp'

interface PaymentData {
  payment: { paymentStatus: string; paymentReference: string | null } | null
  fixedRate: number
  entryUsd: number
  amountVes: number
  participant?: {
    fullName: string
    nationalId: string
    phone: string
    participationCode: string
  }
}

export default function PagoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [data, setData] = useState<PaymentData | null>(null)
  const [settings, setSettings] = useState<{
    paymentPhone: string
    paymentNationalId: string
    paymentBank: string
    entryPriceUsd: number
    fixedExchangeRate: number
  } | null>(null)
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

  useEffect(() => { loadData() }, [code])  // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    const [paymentRes, settingsRes] = await Promise.all([
      fetch(`/api/payments?code=${code}`),
      fetch('/api/settings'),
    ])
    if (paymentRes.ok) setData(await paymentRes.json())
    if (settingsRes.ok) {
      const s = await settingsRes.json()
      setSettings(s.settings)
    }
    setLoading(false)
  }

  const entryUsd = settings?.entryPriceUsd ?? data?.entryUsd ?? 20
  const fixedRate = settings?.fixedExchangeRate ?? data?.fixedRate ?? 730
  const amountVes = Math.round(entryUsd * fixedRate)
  const phone = settings?.paymentPhone ?? '04143043337'
  const ci = settings?.paymentNationalId ?? '4561947'
  const bank = settings?.paymentBank ?? 'Banesco'
  const participant = data?.participant

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const allPaymentData = `Pago Móvil ${bank}
Teléfono: ${phone}
CI: ${ci}
Monto: ${amountVes.toLocaleString('es-VE')} Bs
Equivalente: ${entryUsd} USD
Tasa fija: ${fixedRate} Bs/USD
Concepto: QUINIELA 2026 - ${code}`

  // WhatsApp URL for sending payment proof — uses form data if filled, placeholders if not
  const proofWhatsAppUrl = getPaymentProofWhatsAppUrl({
    adminPhone: phone,
    name: participant?.fullName ?? '[Tu nombre]',
    nationalId: participant?.nationalId ?? '[Tu cédula]',
    phone: participant?.phone ?? '[Tu WhatsApp]',
    participationCode: code,
    amountVes,
    amountUsd: entryUsd,
    fixedExchangeRate: fixedRate,
    senderBank: form.senderBank || undefined,
    paymentReference: form.paymentReference || undefined,
    paymentDate: form.paymentDate || undefined,
  })

  // Legacy: simple contact WhatsApp (kept for the contact button)
  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero reportar mi pago para la Quiniela Mundial 2026.\n\nCódigo: ${code}\nMonto: ${amountVes.toLocaleString('es-VE')} Bs (${entryUsd} USD)\nTasa fija: ${fixedRate} Bs/USD`
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
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/comprobante/${code}`), 1500)
      } else {
        const d = await res.json()
        setError(d.error ?? 'Error al registrar el pago')
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

  const existingPayment = data?.payment
  const alreadyPaid =
    existingPayment?.paymentStatus === 'VERIFIED' ||
    existingPayment?.paymentStatus === 'IN_REVIEW'

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

        {/* Amount card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-5 shadow-lg">
          <p className="text-green-200 text-sm mb-2 text-center">Monto a pagar</p>
          <div className="text-center mb-3">
            <span className="text-5xl font-extrabold">{amountVes.toLocaleString('es-VE')}</span>
            <span className="text-xl font-semibold ml-2">Bs</span>
          </div>
          <div className="bg-white/15 rounded-xl p-3 grid grid-cols-2 gap-3 text-center text-sm">
            <div>
              <div className="text-green-200 text-xs">Equivalente en USD</div>
              <div className="font-bold text-lg">${entryUsd} USD</div>
            </div>
            <div>
              <div className="text-green-200 text-xs">Tasa fija</div>
              <div className="font-bold text-lg">{fixedRate} Bs/USD</div>
            </div>
          </div>
          <p className="text-green-200 text-xs text-center mt-3">
            La entrada cuesta {entryUsd} USD × {fixedRate} Bs/USD = {amountVes.toLocaleString('es-VE')} Bs
          </p>
        </div>

        {/* Payment details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">📱 Datos para Pago Móvil</h2>
          <div className="space-y-2">
            {[
              { label: 'Banco', value: bank },
              { label: 'Teléfono', value: phone },
              { label: 'Cédula', value: `V-${ci}` },
              { label: 'Monto', value: `${amountVes.toLocaleString('es-VE')} Bs` },
              { label: 'Concepto', value: `QUINIELA 2026 - ${code}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
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
                  {copied === label ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            ))}
          </div>

          {/* Copy all button */}
          <button
            onClick={() => copyToClipboard(allPaymentData, 'todos')}
            className={`mt-4 w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 ${
              copied === 'todos'
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            📋 {copied === 'todos' ? '¡Datos copiados!' : 'Copiar todos los datos'}
          </button>

          {/* Send proof via WhatsApp — primary action */}
          <a
            href={proofWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full bg-[#25D366] hover:bg-[#1fb856] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md text-base"
          >
            <span className="text-2xl leading-none">📲</span>
            Enviar comprobante por WhatsApp
          </a>
          <p className="text-center text-xs text-slate-400 mt-2">
            También puedes enviar tu comprobante directamente por WhatsApp para acelerar la verificación.
          </p>
        </div>

        {/* Note about manual verification */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>ℹ️</strong> Tu pago será revisado por el administrador antes de que aparezcas oficialmente en el ranking.
          El proceso puede tomar hasta 24 horas.
        </div>

        {/* Report payment form */}
        {!alreadyPaid && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-700 mb-4">📋 Reportar mi pago</h2>
            {success ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-600 font-bold text-lg">¡Pago reportado!</p>
                <p className="text-slate-500 text-sm mb-4">Redirigiendo al comprobante...</p>
                <a
                  href={proofWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  📲 Enviar comprobante por WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>
                )}
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

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <a
                    href={proofWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1fb856] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="text-xl">📲</span> Enviar comprobante por WhatsApp
                  </a>
                  <p className="text-center text-xs text-slate-400 mt-2">
                    También puedes enviar tu comprobante directamente por WhatsApp para acelerar la verificación.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
