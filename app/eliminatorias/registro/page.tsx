'use client'

/**
 * Inscripción pública — flujo multi-paso.
 * already-enrolled: detecta estado real (picks + pago) y muestra CTA correcto.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type RegStep = 'choose' | 'lookup' | 'found' | 'already-enrolled' | 'not-found' | 'new'

type FoundData = {
  fullName: string
  nationalId: string
  phone: string
  email?: string | null
  city?: string | null
  participationCode?: string
}

type EnrolledState = {
  loading: boolean
  filledCount: number
  totalCount: number
  paymentStatus: string
}

export default function KORegistroPage() {
  const router = useRouter()

  const [regStep,       setRegStep]       = useState<RegStep>('choose')
  const [lookupQuery,   setLookupQuery]   = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResult,  setLookupResult]  = useState<FoundData | null>(null)

  const [enrolledState, setEnrolledState] = useState<EnrolledState>({
    loading: true, filledCount: 0, totalCount: 16, paymentStatus: 'PENDING',
  })

  const [regForm, setRegForm] = useState({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' })
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Fetch real state when already-enrolled
  useEffect(() => {
    if (regStep === 'already-enrolled' && lookupResult?.participationCode) {
      setEnrolledState(s => ({ ...s, loading: true }))
      fetch(`/api/ko/picks?code=${lookupResult.participationCode}`)
        .then(r => r.json())
        .then(d => {
          const allR32 = (d.matches ?? []).filter((m: { stage: string }) => m.stage === 'R32')
          setEnrolledState({
            loading:       false,
            filledCount:   (d.picks ?? []).length,
            totalCount:    allR32.length || 16,
            paymentStatus: d.participant?.payment?.paymentStatus ?? 'PENDING',
          })
        })
        .catch(() => setEnrolledState(s => ({ ...s, loading: false })))
    }
  }, [regStep, lookupResult])

  async function handleLookup() {
    const q = lookupQuery.trim()
    if (!q) return
    setLookupLoading(true)

    const digits  = q.replace(/\D/g, '')
    const isPhone = digits.length >= 9 && (digits.startsWith('04') || digits.startsWith('58') || digits.startsWith('0'))

    try {
      const koParam = isPhone ? `phone=${encodeURIComponent(q)}` : `nationalId=${encodeURIComponent(digits)}`
      const koRes   = await fetch(`/api/ko/participants?${koParam}`)
      if (koRes.ok) {
        const koData = await koRes.json()
        setLookupResult({
          fullName: koData.fullName ?? '',
          nationalId: digits,
          phone: q,
          participationCode: koData.participationCode,
        })
        setLookupLoading(false)
        setRegStep('already-enrolled')
        return
      }

      if (!isPhone) {
        const prefillRes = await fetch(`/api/ko/participants?prefill=${encodeURIComponent(digits)}`)
        if (prefillRes.ok) {
          const fd: FoundData = await prefillRes.json()
          setLookupResult(fd)
          setLookupLoading(false)
          setRegStep('found')
          return
        }
      }

      setLookupLoading(false)
      setRegStep('not-found')
    } catch {
      setLookupLoading(false)
      setRegStep('not-found')
    }
  }

  async function handleConfirmExisting() {
    if (!lookupResult) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/ko/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:   lookupResult.fullName,
          nationalId: lookupResult.nationalId,
          phone:      lookupResult.phone,
          email:      lookupResult.email ?? '',
          city:       lookupResult.city  ?? '',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          router.push(`/eliminatorias/llenar/${data.code}`)
          return
        }
        setSubmitError(data.error ?? 'Error al inscribir')
        return
      }
      router.push(`/eliminatorias/llenar/${data.participant.participationCode}`)
    } catch {
      setSubmitError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  function validateNew() {
    const errs: Record<string, string> = {}
    if (!regForm.nombre.trim())   errs.nombre = 'El nombre es obligatorio'
    if (!regForm.cedula.trim())   errs.cedula = 'La cédula es obligatoria'
    else if (!/^\d{6,10}$/.test(regForm.cedula.trim())) errs.cedula = 'Solo números, 6-10 dígitos'
    if (!regForm.whatsapp.trim()) errs.whatsapp = 'El WhatsApp es obligatorio'
    else if (!/^04\d{9}$/.test(regForm.whatsapp.replace(/[\s\-]/g, ''))) errs.whatsapp = 'Formato: 04XXXXXXXXX'
    return errs
  }

  async function handleNewSubmit() {
    const errs = validateNew()
    setRegErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/ko/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:   regForm.nombre.trim(),
          nationalId: regForm.cedula.trim(),
          phone:      regForm.whatsapp.trim(),
          email:      regForm.email.trim()  || '',
          city:       regForm.ciudad.trim() || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          router.push(`/eliminatorias/llenar/${data.code}`)
          return
        }
        setSubmitError(data.error ?? 'Error al registrar')
        return
      }
      router.push(`/eliminatorias/llenar/${data.participant.participationCode}`)
    } catch {
      setSubmitError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (id: keyof typeof regForm, label: string, placeholder: string, required: boolean, hint?: string, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={regForm[id]}
        onChange={e => setRegForm(f => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        inputMode={id === 'cedula' || id === 'whatsapp' ? 'numeric' : undefined}
        className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
          regErrors[id] ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-green-500'
        }`}
      />
      {hint && !regErrors[id] && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
      {regErrors[id] && <p className="text-[10px] text-red-500 mt-1">⚠ {regErrors[id]}</p>}
    </div>
  )

  const header = (
    <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
      <Link href="/" className="text-green-200 text-xs mb-3 flex items-center gap-1 hover:text-white">
        ← Volver
      </Link>
      <h1 className="text-xl font-extrabold mb-0.5">📝 Inscripción</h1>
      <p className="text-green-200 text-sm">Quiniela Eliminatorias 2026 · Mundial 2026</p>
    </div>
  )

  if (regStep === 'choose') return (
    <div className="max-w-lg mx-auto py-2 pb-10">
      {header}
      <div className="space-y-4">
        <button onClick={() => setRegStep('lookup')}
          className="w-full bg-white border-2 border-green-300 hover:border-green-500 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-all group touch-manipulation">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-xl p-3 shrink-0 group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-base mb-1">Ya participé antes</p>
              <p className="text-sm text-slate-500 leading-relaxed">Jugué en la Fase de Grupos 2026 o ya me inscribí en Eliminatorias.</p>
              <p className="text-xs text-green-600 font-semibold mt-2">→ Busca por cédula o WhatsApp</p>
            </div>
          </div>
        </button>

        <button onClick={() => { setRegStep('new'); setRegForm({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' }); setRegErrors({}) }}
          className="w-full bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-all group touch-manipulation">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 rounded-xl p-3 shrink-0 group-hover:bg-blue-100 transition-colors">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-base mb-1">Soy nuevo participante</p>
              <p className="text-sm text-slate-500 leading-relaxed">Es mi primera vez. Quiero registrarme para participar en Eliminatorias.</p>
              <p className="text-xs text-blue-600 font-semibold mt-2">→ Crear nueva cuenta</p>
            </div>
          </div>
        </button>
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-6">
        🔒 Tu cédula es tu identificador · No se comparte públicamente
      </p>
    </div>
  )

  if (regStep === 'lookup') return (
    <div className="max-w-lg mx-auto py-2 pb-10">
      {header}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-extrabold text-slate-800 text-base mb-1">Buscar mis datos</h2>
        <p className="text-sm text-slate-500 mb-4">
          Ingresa tu cédula o número de WhatsApp.
        </p>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Cédula o WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={lookupQuery}
          onChange={e => setLookupQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          placeholder="Ej: 12345678 o 04141234567"
          className="w-full border-2 border-slate-200 focus:border-green-500 rounded-xl px-4 py-3 text-sm focus:outline-none mb-4"
        />
        <button
          onClick={handleLookup}
          disabled={!lookupQuery.trim() || lookupLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all active:scale-95 touch-manipulation"
        >
          {lookupLoading ? '🔍 Buscando…' : 'Buscar mis datos'}
        </button>
      </div>
      <button onClick={() => setRegStep('choose')} className="w-full text-slate-500 text-sm py-2 hover:text-slate-700">
        ← Volver
      </button>
    </div>
  )

  if (regStep === 'found' && lookupResult) return (
    <div className="max-w-lg mx-auto py-2 pb-10">
      {header}
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-extrabold shrink-0">
            {(lookupResult.fullName || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-green-700 font-semibold">✅ Datos encontrados</p>
            <p className="font-extrabold text-slate-800 text-base">{lookupResult.fullName}</p>
            <p className="text-xs text-green-600">Participó en la Fase de Grupos 2026</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-2 text-sm mb-4">
          <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Nombre</span> <strong>{lookupResult.fullName}</strong></p>
          <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">Cédula</span> <strong>{lookupResult.nationalId?.replace(/(\d{2})(\d+)(\d{2})/, '$1···$3')}</strong></p>
          <p className="text-slate-800"><span className="text-slate-500 text-xs w-20 inline-block">WhatsApp</span> <strong>{lookupResult.phone}</strong></p>
        </div>
        <p className="text-xs text-slate-600 mb-4 text-center">
          Ya tenemos tus datos. Confirma para inscribirte en <strong>Quiniela Eliminatorias 2026</strong>.
        </p>
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-3">{submitError}</div>
        )}
        <button onClick={handleConfirmExisting} disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition-all active:scale-95 touch-manipulation mb-2">
          {submitting ? 'Procesando…' : '✅ Confirmar inscripción a Eliminatorias'}
        </button>
        <button onClick={() => setRegStep('choose')}
          className="w-full text-slate-400 text-sm py-2 hover:text-slate-600">Cancelar</button>
      </div>
    </div>
  )

  if (regStep === 'already-enrolled' && lookupResult) {
    const code = lookupResult.participationCode!
    const { loading, filledCount, totalCount, paymentStatus } = enrolledState
    const allFilled = filledCount >= totalCount
    const isVerified = paymentStatus === 'VERIFIED'
    const isInReview = paymentStatus === 'IN_REVIEW'

    return (
      <div className="max-w-lg mx-auto py-2 pb-10">
        {header}
        <div className="bg-white border-2 border-green-200 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-extrabold shrink-0">
              {lookupResult.fullName ? lookupResult.fullName[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="text-xs text-green-700 font-semibold">✅ Ya estás inscrito</p>
              <p className="font-extrabold text-slate-800 text-base">{lookupResult.fullName || 'Participante'}</p>
              <p className="text-xs text-slate-500">Quiniela Eliminatorias 2026</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-slate-400 text-sm">Cargando estado…</div>
          ) : (
            <>
              {/* Progreso */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-semibold">Pronósticos</span>
                  <span className={`font-extrabold ${allFilled ? 'text-green-600' : 'text-amber-600'}`}>
                    {filledCount}/{totalCount}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${allFilled ? 'bg-green-500' : 'bg-amber-400'}`}
                    style={{ width: `${Math.round((filledCount / totalCount) * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {isVerified && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-semibold">✅ Pago verificado</span>}
                  {isInReview && <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">⏳ Pago en revisión</span>}
                  {!isVerified && !isInReview && <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-semibold">💳 Pago pendiente</span>}
                </div>
              </div>

              {/* CTA principal según estado */}
              {!allFilled && (
                <a href={`/eliminatorias/llenar/${code}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl text-center text-base shadow-lg transition-all active:scale-95 mb-2">
                  ⚽ Continuar llenando quiniela ({filledCount}/{totalCount})
                </a>
              )}

              {allFilled && !isVerified && !isInReview && (
                <a href={`/eliminatorias/pago/${code}`}
                  className="block w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-4 rounded-xl text-center text-base shadow-lg transition-all active:scale-95 mb-2">
                  💳 Reportar pago
                </a>
              )}

              {allFilled && (isVerified || isInReview) && (
                <a href={`/eliminatorias/mi-quiniela/${code}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl text-center text-base shadow-lg transition-all active:scale-95 mb-2">
                  📋 Ver mi quiniela
                </a>
              )}

              {/* CTAs secundarios */}
              <div className="flex gap-2 mt-1">
                {allFilled && !isVerified && !isInReview && (
                  <a href={`/eliminatorias/llenar/${code}`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">
                    Ver pronósticos
                  </a>
                )}
                <a href="/eliminatorias/ranking"
                  className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">
                  🏆 Ranking
                </a>
              </div>
            </>
          )}
        </div>
        <button onClick={() => { setRegStep('choose'); setLookupQuery('') }}
          className="w-full text-slate-400 text-sm py-2 hover:text-slate-600">← Volver</button>
      </div>
    )
  }

  if (regStep === 'not-found') return (
    <div className="max-w-lg mx-auto py-2 pb-10">
      {header}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm mb-4 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="font-extrabold text-slate-800 text-lg mb-2">No encontramos datos previos</h2>
        <p className="text-slate-600 text-sm mb-1">
          No encontramos ningún participante con:
        </p>
        <p className="font-mono font-bold text-slate-800 mb-4 bg-white border rounded-lg px-3 py-1.5 inline-block">
          {lookupQuery}
        </p>
        <div className="space-y-2">
          <button onClick={() => {
            setRegStep('new')
            const digits = lookupQuery.replace(/\D/g, '')
            const isPhone = digits.startsWith('04')
            setRegForm({ nombre: '', cedula: isPhone ? '' : digits, whatsapp: isPhone ? digits : '', ciudad: '', email: '' })
            setRegErrors({})
          }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all touch-manipulation">
            ✨ Registrarme como nuevo participante
          </button>
          <button onClick={() => { setRegStep('lookup'); setLookupQuery('') }}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50">
            🔄 Buscar con otro dato
          </button>
        </div>
      </div>
    </div>
  )

  // STEP: new
  return (
    <div className="max-w-lg mx-auto py-2 pb-10">
      {header}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-xs text-blue-700">
        <strong>Tu cédula es tu identificador.</strong> La usarás para acceder a tu quiniela.
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 mb-4">
        {field('nombre',   'Nombre completo',     'Ej: Carlos Eduardo Acosta',    true)}
        {field('cedula',   'Cédula de identidad', 'Ej: 12345678',                 true, 'Solo números, sin V- ni E-')}
        {field('whatsapp', 'WhatsApp',             'Ej: 04141234567',              true, 'Número venezolano: 04XXXXXXXXX', 'tel')}
        {field('ciudad',   'Ciudad',               'Ej: Caracas',                  false)}
        {field('email',    'Email',                'Ej: correo@ejemplo.com',       false, undefined, 'email')}
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-xs text-slate-500 space-y-1">
        <p>🔒 Tu cédula no se mostrará completa en el ranking público.</p>
        <p>🚫 Una cédula puede inscribirse <strong>una sola vez</strong> en esta quiniela.</p>
      </div>
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{submitError}</div>
      )}
      <button onClick={handleNewSubmit} disabled={submitting}
        className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg transition-all active:scale-95 touch-manipulation mb-3">
        {submitting ? 'Inscribiendo…' : '✅ Inscribirme en la quiniela'}
      </button>
      <button onClick={() => setRegStep('choose')} className="w-full text-slate-500 text-sm py-2 hover:text-slate-700">
        ← Volver
      </button>
    </div>
  )
}
