'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPagoMovilWhatsAppUrl, getZelleWhatsAppUrl } from '@/lib/whatsapp'

type PaymentMethodType = 'PAGO_MOVIL' | 'ZELLE'

interface PaymentData {
  payment: {
    paymentStatus: string
    paymentReference: string | null
    paymentMethod: string | null
  } | null
  fixedRate: number
  entryUsd: number
  amountVes: number
  zelleEmail: string
  participant?: {
    fullName: string
    nationalId: string
    phone: string
    participationCode: string
  }
}

interface Settings {
  paymentPhone: string
  paymentNationalId: string
  paymentBank: string
  zelleEmail: string
  entryPriceUsd: number
  fixedExchangeRate: number
}

export default function PagoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  const [data, setData] = useState<PaymentData | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<PaymentMethodType>('PAGO_MOVIL')

  // Pago Móvil form
  const [pmForm, setPmForm] = useState({
    senderBank: '',
    paymentReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
  })

  // Zelle form
  const [zelleForm, setZelleForm] = useState({
    senderName: '',
    senderContact: '',
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

  const entryUsd    = settings?.entryPriceUsd      ?? data?.entryUsd   ?? 20
  const fixedRate   = settings?.fixedExchangeRate   ?? data?.fixedRate  ?? 730
  const amountVes   = Math.round(entryUsd * fixedRate)
  const phone       = settings?.paymentPhone        ?? '04143043337'
  const ci          = settings?.paymentNationalId   ?? '4561947'
  const bank        = settings?.paymentBank         ?? 'Banesco'
  const zelleEmail  = settings?.zelleEmail          ?? data?.zelleEmail ?? 'kissigloxxi@hotmail.com'
  const participant = data?.participant

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2500)
  }

  // ── Copy text templates ───────────────────────────────────────────────────
  const pmCopyAll =
    `Pago Móvil ${bank}\n` +
    `Teléfono: ${phone}\n` +
    `CI: ${ci}\n` +
    `Monto: ${amountVes.toLocaleString('es-VE')} Bs\n` +
    `Equivalente: ${entryUsd} USD\n` +
    `Tasa fija: ${fixedRate} Bs/USD\n` +
    `Concepto: QUINIELA 2026 - ${code}`

  const zelleCopyAll =
    `Zelle: ${zelleEmail}\n` +
    `Monto: ${entryUsd} USD\n` +
    `Concepto: QUINIELA 2026 - ${code}`

  // ── WhatsApp URLs ─────────────────────────────────────────────────────────
  const pmWhatsAppUrl = getPagoMovilWhatsAppUrl({
    adminPhone: phone,
    name: participant?.fullName ?? '[Tu nombre]',
    nationalId: participant?.nationalId ?? '[Tu cédula]',
    phone: participant?.phone ?? '[Tu WhatsApp]',
    participationCode: code,
    amountVes,
    amountUsd: entryUsd,
    fixedExchangeRate: fixedRate,
    senderBank: pmForm.senderBank || undefined,
    paymentReference: pmForm.paymentReference || undefined,
    paymentDate: pmForm.paymentDate || undefined,
  })

  const zelleWhatsAppUrl = getZelleWhatsAppUrl({
    adminPhone: phone,
    name: participant?.fullName ?? '[Tu nombre]',
    nationalId: participant?.nationalId ?? '[Tu cédula]',
    phone: participant?.phone ?? '[Tu WhatsApp]',
    participationCode: code,
    amountUsd: entryUsd,
    zelleEmail,
    senderName: zelleForm.senderName || undefined,
    senderContact: zelleForm.senderContact || undefined,
    paymentReference: zelleForm.paymentReference || undefined,
    paymentDate: zelleForm.paymentDate || undefined,
  })

  const activeWhatsAppUrl = method === 'PAGO_MOVIL' ? pmWhatsAppUrl : zelleWhatsAppUrl

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const body = method === 'PAGO_MOVIL'
        ? { participationCode: code, paymentMethod: 'PAGO_MOVIL', ...pmForm }
        : { participationCode: code, paymentMethod: 'ZELLE', ...zelleForm }

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/comprobante/${code}`), 1800)
      } else {
        const d = await res.json()
        setError(d.error ?? 'Error al registrar el pago')
      }
    } catch {
      setError('Error de conexión')
    }
    setSubmitting(false)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">{'⚽'}</div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const existingPayment = data?.payment
  const alreadyPaid =
    existingPayment?.paymentStatus === 'VERIFIED' ||
    existingPayment?.paymentStatus === 'IN_REVIEW'

  const prevMethod = existingPayment?.paymentMethod === 'ZELLE' ? 'Zelle' : 'Pago Móvil'

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
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
              <span key={n} className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">{'✓'}</span>
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
            Ya registraste un pago por <strong>{prevMethod}</strong> ({existingPayment?.paymentStatus === 'VERIFIED' ? 'verificado' : 'en revisión'}).
            <Link href={`/comprobante/${code}`} className="ml-2 underline font-medium">Ver comprobante →</Link>
          </div>
        )}

        {/* Price card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-5 shadow-lg">
          <p className="text-green-200 text-sm mb-3 text-center font-medium">Monto de inscripción</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-green-200 text-xs mb-1">Pago Móvil</div>
              <div className="font-extrabold text-2xl">{amountVes.toLocaleString('es-VE')} Bs</div>
              <div className="text-green-200 text-xs mt-1">Tasa fija: {fixedRate} Bs/USD</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-green-200 text-xs mb-1">Zelle</div>
              <div className="font-extrabold text-2xl">{entryUsd} USD</div>
              <div className="text-green-200 text-xs mt-1">Pago en dólares</div>
            </div>
          </div>
        </div>

        {/* Method selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-1">Selecciona tu método de pago</h2>
          <p className="text-slate-500 text-sm mb-4">
            Puedes pagar por Pago Móvil Banesco o por Zelle. Selecciona el método que prefieras
            y luego reporta tu pago para que sea verificado.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('PAGO_MOVIL')}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                method === 'PAGO_MOVIL'
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-1">{'📱'}</div>
              <div className={`font-bold text-sm ${method === 'PAGO_MOVIL' ? 'text-green-700' : 'text-slate-700'}`}>
                Pago Móvil
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{amountVes.toLocaleString('es-VE')} Bs</div>
              {method === 'PAGO_MOVIL' && (
                <div className="mt-2 text-xs font-bold text-green-600">{'✓'} Seleccionado</div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMethod('ZELLE')}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                method === 'ZELLE'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-1">{'💵'}</div>
              <div className={`font-bold text-sm ${method === 'ZELLE' ? 'text-blue-700' : 'text-slate-700'}`}>
                Zelle
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{entryUsd} USD</div>
              {method === 'ZELLE' && (
                <div className="mt-2 text-xs font-bold text-blue-600">{'✓'} Seleccionado</div>
              )}
            </button>
          </div>
        </div>

        {/* ── Pago Móvil details ─────────────────────────────────────────── */}
        {method === 'PAGO_MOVIL' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-700 mb-4">{'📱'} Datos para Pago Móvil</h2>
            <p className="text-slate-500 text-sm mb-4">
              Realiza el Pago Móvil con estos datos y luego reporta la referencia para verificar
              tu participación.
            </p>
            <div className="space-y-2">
              {[
                { label: 'Banco',    value: bank },
                { label: 'Teléfono', value: phone },
                { label: 'Cédula',   value: `V-${ci}` },
                { label: 'Monto',    value: `${amountVes.toLocaleString('es-VE')} Bs` },
                { label: 'Equivalente', value: `${entryUsd} USD` },
                { label: 'Tasa fija',   value: `${fixedRate} Bs/USD` },
                { label: 'Concepto',    value: `QUINIELA 2026 - ${code}` },
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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copyToClipboard(pmCopyAll, 'pm-all')}
                className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 text-sm ${
                  copied === 'pm-all'
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {'📋'} {copied === 'pm-all' ? '¡Copiado!' : 'Copiar datos'}
              </button>
              <button
                onClick={() => copyToClipboard(`${amountVes.toLocaleString('es-VE')}`, 'pm-monto')}
                className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 text-sm ${
                  copied === 'pm-monto'
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {'💰'} {copied === 'pm-monto' ? '¡Copiado!' : 'Copiar monto'}
              </button>
            </div>

            <a
              href={pmWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-[#25D366] hover:bg-[#1fb856] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md text-base"
            >
              <span className="text-xl leading-none">{'📲'}</span>
              Enviar comprobante por WhatsApp
            </a>
          </div>
        )}

        {/* ── Zelle details ─────────────────────────────────────────────── */}
        {method === 'ZELLE' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-700 mb-4">{'💵'} Datos para Zelle</h2>
            <p className="text-slate-500 text-sm mb-4">
              También puedes pagar por Zelle si prefieres hacerlo en dólares.
            </p>
            <div className="space-y-2">
              {[
                { label: 'Método',   value: 'Zelle' },
                { label: 'Correo Zelle', value: zelleEmail },
                { label: 'Monto',        value: `${entryUsd} USD` },
                { label: 'Concepto',     value: `QUINIELA 2026 - ${code}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-bold text-slate-800">{value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(value, label)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      copied === label ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {copied === label ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copyToClipboard(zelleEmail, 'zelle-email')}
                className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 text-sm ${
                  copied === 'zelle-email'
                    ? 'bg-blue-100 border-blue-400 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {'📧'} {copied === 'zelle-email' ? '¡Copiado!' : 'Copiar correo'}
              </button>
              <button
                onClick={() => copyToClipboard(zelleCopyAll, 'zelle-all')}
                className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 text-sm ${
                  copied === 'zelle-all'
                    ? 'bg-blue-100 border-blue-400 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {'📋'} {copied === 'zelle-all' ? '¡Copiado!' : 'Copiar datos'}
              </button>
            </div>

            <a
              href={zelleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-[#25D366] hover:bg-[#1fb856] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md text-base"
            >
              <span className="text-xl leading-none">{'📲'}</span>
              Enviar comprobante por WhatsApp
            </a>
          </div>
        )}

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>{'ℹ️'}</strong> Tu pago será revisado por el administrador antes de que aparezcas
          oficialmente en el ranking. El proceso puede tomar hasta 24 horas.
        </div>

        {/* ── Report payment form ────────────────────────────────────────── */}
        {!alreadyPaid && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-700 mb-4">{'📋'} Reportar mi pago</h2>

            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">{'✅'}</div>
                <p className="text-green-600 font-bold text-lg">¡Pago reportado!</p>
                <p className="text-slate-500 text-sm mb-5">
                  Tu pago fue reportado correctamente y está en revisión. Cuando sea verificado
                  por el administrador, aparecerás oficialmente en el ranking.
                </p>
                <a
                  href={activeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  {'📲'} Enviar comprobante por WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>
                )}

                {/* Method indicator */}
                <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                  method === 'PAGO_MOVIL' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  <span>{method === 'PAGO_MOVIL' ? '📱' : '💵'}</span>
                  <span>Reportando pago por <strong>{method === 'PAGO_MOVIL' ? 'Pago Móvil' : 'Zelle'}</strong></span>
                  <button
                    type="button"
                    onClick={() => setMethod(method === 'PAGO_MOVIL' ? 'ZELLE' : 'PAGO_MOVIL')}
                    className="ml-auto text-xs underline opacity-70 hover:opacity-100"
                  >
                    Cambiar
                  </button>
                </div>

                {/* ── Pago Móvil form fields ─────────── */}
                {method === 'PAGO_MOVIL' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Banco emisor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pmForm.senderBank}
                        onChange={(e) => setPmForm({ ...pmForm, senderBank: e.target.value })}
                        placeholder="Ej: Mercantil, BDV, BOD..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Número de referencia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pmForm.paymentReference}
                        onChange={(e) => setPmForm({ ...pmForm, paymentReference: e.target.value })}
                        placeholder="Número de referencia del pago"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fecha del pago <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={pmForm.paymentDate}
                        onChange={(e) => setPmForm({ ...pmForm, paymentDate: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </>
                )}

                {/* ── Zelle form fields ─────────────────── */}
                {method === 'ZELLE' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nombre del titular que envió el Zelle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={zelleForm.senderName}
                        onChange={(e) => setZelleForm({ ...zelleForm, senderName: e.target.value })}
                        placeholder="Tu nombre completo"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Correo o teléfono desde donde enviaste el Zelle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={zelleForm.senderContact}
                        onChange={(e) => setZelleForm({ ...zelleForm, senderContact: e.target.value })}
                        placeholder="tu@correo.com o +1 555 123 4567"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Referencia o confirmación del pago <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={zelleForm.paymentReference}
                        onChange={(e) => setZelleForm({ ...zelleForm, paymentReference: e.target.value })}
                        placeholder="Número de confirmación Zelle"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fecha del pago <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={zelleForm.paymentDate}
                        onChange={(e) => setZelleForm({ ...zelleForm, paymentDate: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
                      {'💵'} Monto esperado: <strong>{entryUsd} USD</strong>
                      <br />
                      Enviar Zelle a: <strong>{zelleEmail}</strong>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full font-bold py-3.5 rounded-xl transition-colors text-white disabled:opacity-60 ${
                    method === 'PAGO_MOVIL'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Enviando...' : 'Reportar pago'}
                </button>

                <div className="border-t border-slate-100 pt-4">
                  <a
                    href={activeWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1fb856] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="text-xl">{'📲'}</span> Enviar comprobante por WhatsApp
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
