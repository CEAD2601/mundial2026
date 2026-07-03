'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PHASE = 'knockout_round_16_to_final'

type Step = 'choose' | 'lookup-r32' | 'found-r32' | 'already-r16' | 'new' | 'not-found'

type FoundData = {
  fullName:   string
  nationalId: string
  phone:      string
  email?:     string | null
  city?:      string | null
}

export default function OctavosRegistroPage() {
  const router = useRouter()

  const [step,          setStep]          = useState<Step>('choose')
  const [lookupQuery,   setLookupQuery]   = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [found,         setFound]         = useState<FoundData | null>(null)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitError,   setSubmitError]   = useState('')

  const [form,      setForm]      = useState({ nombre: '', cedula: '', whatsapp: '', ciudad: '', email: '' })
  const [formErr,   setFormErr]   = useState<Record<string, string>>({})

  // Auto-fill form when found from R32
  useEffect(() => {
    if (found && step === 'found-r32') {
      setForm(f => ({
        ...f,
        nombre:   found.fullName ?? f.nombre,
        cedula:   found.nationalId ?? f.cedula,
        whatsapp: found.phone ?? f.whatsapp,
        email:    found.email ?? f.email,
        ciudad:   found.city ?? f.ciudad,
      }))
    }
  }, [found, step])

  async function handleLookup() {
    const q = lookupQuery.trim()
    if (!q) return
    setLookupLoading(true)

    const digits  = q.replace(/\D/g, '')
    const isPhone = digits.length >= 10 && (digits.startsWith('04') || digits.startsWith('58'))
    const param   = isPhone ? `phone=${encodeURIComponent(q)}` : `nationalId=${encodeURIComponent(digits)}`

    try {
      // ¿Ya está inscrito en R16-Final?
      const r16Res = await fetch(`/api/ko/participants?${param}&phase=${PHASE}`)
      if (r16Res.ok) {
        const r16Data = await r16Res.json()
        setFound({
          fullName:   r16Data.fullName,
          nationalId: r16Data.nationalId,
          phone:      r16Data.phone,
          email:      r16Data.email,
          city:       r16Data.city,
        })
        setLookupLoading(false)
        setStep('already-r16')
        // Redirect to fill page
        setTimeout(() => router.push(`/eliminatorias/llenar/${r16Data.participationCode}`), 1500)
        return
      }

      // ¿Participó en R32? (búsqueda general sin filtro de fase)
      const r32Res = await fetch(`/api/ko/participants?${param}`)
      if (r32Res.ok) {
        const r32Data = await r32Res.json()
        setFound({
          fullName:   r32Data.fullName,
          nationalId: r32Data.nationalId,
          phone:      r32Data.phone,
          email:      r32Data.email,
          city:       r32Data.city,
        })
        setLookupLoading(false)
        setStep('found-r32')
        return
      }

      setLookupLoading(false)
      setStep('not-found')
    } catch {
      setLookupLoading(false)
      setStep('not-found')
    }
  }

  function validateForm() {
    const errs: Record<string, string> = {}
    if (!form.nombre.trim())   errs.nombre   = 'El nombre es obligatorio'
    if (!form.cedula.trim())   errs.cedula   = 'La cédula es obligatoria'
    else if (!/^\d{6,10}$/.test(form.cedula.trim())) errs.cedula = 'Solo números, 6–10 dígitos'
    if (!form.whatsapp.trim()) errs.whatsapp = 'El WhatsApp es obligatorio'
    else if (!/^04\d{9}$/.test(form.whatsapp.replace(/[\s\-]/g, ''))) errs.whatsapp = 'Formato: 04XXXXXXXXX'
    return errs
  }

  async function handleSubmit() {
    const errs = validateForm()
    setFormErr(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/ko/participants', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:   form.nombre.trim(),
          nationalId: form.cedula.trim(),
          phone:      form.whatsapp.trim(),
          email:      form.email.trim()  || '',
          city:       form.ciudad.trim() || '',
          phase:      PHASE,
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

  function inp(id: keyof typeof form, label: string, placeholder: string, required: boolean, hint?: string, type = 'text') {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={form[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={placeholder}
          inputMode={id === 'cedula' || id === 'whatsapp' ? 'numeric' : undefined}
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
            formErr[id] ? 'border-red-300 focus:border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'
          }`}
        />
        {formErr[id] && <p className="text-xs text-red-500 mt-1">{formErr[id]}</p>}
        {hint && !formErr[id] && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-blue-950 flex flex-col items-center justify-start px-4 pb-12">

      {/* Header */}
      <div className="w-full max-w-md py-6 text-center">
        <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-1">🏆 FIFA World Cup 2026™</p>
        <h1 className="text-white text-2xl font-extrabold mb-0.5">Quiniela</h1>
        <h2 className="text-blue-200 text-lg font-bold">Octavos a Final</h2>
        <p className="text-blue-400 text-xs mt-2">$20 USD · 14.600 Bs · Tasa fija 730 Bs/USD</p>
      </div>

      <div className="w-full max-w-md space-y-4">

        {/* ── ELEGIR FLUJO ── */}
        {step === 'choose' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center mb-2">
              <div className="text-3xl mb-2">⚽</div>
              <h3 className="font-extrabold text-slate-800 text-lg">¿Cómo quieres participar?</h3>
              <p className="text-slate-500 text-sm mt-1">Inscripción para la fase Octavos a Final</p>
            </div>
            <button
              onClick={() => setStep('lookup-r32')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors text-sm"
            >
              🔍 Ya participé antes (R32 o anterior)
              <p className="text-blue-200 text-xs font-normal mt-0.5">Busco mis datos para no repetirlos</p>
            </button>
            <button
              onClick={() => setStep('new')}
              className="w-full bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-bold py-4 rounded-2xl transition-colors text-sm"
            >
              ✨ Soy nuevo participante
              <p className="text-slate-400 text-xs font-normal mt-0.5">Primera vez en la quiniela</p>
            </button>
            <p className="text-center text-xs text-slate-400 pt-1">
              El pago se confirma después de llenar tu quiniela
            </p>
          </div>
        )}

        {/* ── BUSCAR R32 ── */}
        {step === 'lookup-r32' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <button onClick={() => setStep('choose')} className="text-xs text-slate-400 hover:text-slate-600">
              ← Volver
            </button>
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-bold text-slate-800">Busca tu participación anterior</h3>
              <p className="text-slate-500 text-sm mt-1">Ingresa tu cédula o número de WhatsApp</p>
            </div>
            <input
              type="text"
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="Ej: 12345678 o 04141234567"
              inputMode="numeric"
              className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
            <button
              onClick={handleLookup}
              disabled={lookupLoading || !lookupQuery.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              {lookupLoading ? 'Buscando…' : 'Buscar mis datos'}
            </button>
          </div>
        )}

        {/* ── YA INSCRITO EN R16 — REDIRECT ── */}
        {step === 'already-r16' && found && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl text-center space-y-3">
            <div className="text-3xl">✅</div>
            <h3 className="font-bold text-slate-800">¡Ya estás inscrito en Octavos a Final!</h3>
            <p className="text-slate-600 text-sm">{found.fullName}</p>
            <p className="text-slate-500 text-xs">Redirigiéndote a tu quiniela…</p>
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {/* ── ENCONTRADO EN R32 — CONFIRMAR DATOS ── */}
        {step === 'found-r32' && found && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <button onClick={() => setStep('lookup-r32')} className="text-xs text-slate-400 hover:text-slate-600">
              ← Volver
            </button>
            <div className="text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-bold text-slate-800">¡Te encontramos!</h3>
              <p className="text-slate-500 text-sm">Participaste en Dieciseisavos. Confirma o edita tus datos para inscribirte en Octavos a Final.</p>
            </div>

            <div className="bg-blue-50 rounded-2xl px-4 py-3 text-sm">
              <p className="font-semibold text-blue-800">{found.fullName}</p>
              <p className="text-blue-600 text-xs">{found.phone}</p>
            </div>

            <div className="space-y-3">
              {inp('nombre',   'Nombre completo',   'Como aparecerá en el ranking', true)}
              {inp('cedula',   'Cédula',            '12345678',                      true, undefined, 'tel')}
              {inp('whatsapp', 'WhatsApp',          '04141234567',                   true, 'Formato: 04XXXXXXXXX', 'tel')}
              {inp('ciudad',   'Ciudad (opcional)', 'Caracas, Maracaibo…',           false)}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors"
            >
              {submitting ? 'Inscribiendo…' : '🚀 Inscribirme en Octavos a Final'}
            </button>
          </div>
        )}

        {/* ── NO ENCONTRADO ── */}
        {step === 'not-found' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="text-3xl">🔎</div>
            <h3 className="font-bold text-slate-800">No encontramos tu participación</h3>
            <p className="text-slate-500 text-sm">
              Puede que estés registrado con otro dato, o es tu primera vez.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setLookupQuery(''); setStep('lookup-r32') }}
                className="flex-1 border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm hover:border-slate-300"
              >
                Buscar de nuevo
              </button>
              <button
                onClick={() => setStep('new')}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700"
              >
                Registrarme nuevo
              </button>
            </div>
          </div>
        )}

        {/* ── NUEVO PARTICIPANTE ── */}
        {step === 'new' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <button onClick={() => setStep('choose')} className="text-xs text-slate-400 hover:text-slate-600">
              ← Volver
            </button>
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold text-slate-800">Datos para la quiniela</h3>
              <p className="text-slate-500 text-sm mt-1">Octavos a Final · $20 USD</p>
            </div>

            <div className="space-y-3">
              {inp('nombre',   'Nombre completo',   'Como aparecerá en el ranking', true)}
              {inp('cedula',   'Cédula',            '12345678',                      true, undefined, 'tel')}
              {inp('whatsapp', 'WhatsApp',          '04141234567',                   true, 'Formato: 04XXXXXXXXX', 'tel')}
              {inp('ciudad',   'Ciudad (opcional)', 'Caracas, Maracaibo…',           false)}
              {inp('email',    'Email (opcional)',  'correo@ejemplo.com',            false, undefined, 'email')}
            </div>

            <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-600 space-y-1">
              <p>💳 <strong>Pago Móvil Banesco:</strong> 04241234567 · Cédula 12345678 · Banco Banesco</p>
              <p>💵 <strong>Zelle:</strong> acostac2601@gmail.com</p>
              <p className="text-slate-400">El pago se confirma después de llenar tu quiniela.</p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors"
            >
              {submitting ? 'Registrando…' : '🚀 Continuar — Llenar quiniela'}
            </button>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-blue-300 hover:text-white text-xs transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
