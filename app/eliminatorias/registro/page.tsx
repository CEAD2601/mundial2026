'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function KORegistroPage() {
  const router = useRouter()

  const [form, setForm] = useState({ fullName: '', nationalId: '', phone: '', email: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [prefilling, setPrefilling] = useState(false)

  const handlePrefill = async () => {
    if (form.nationalId.length < 6) return
    setPrefilling(true)
    try {
      const res = await fetch(`/api/ko/participants?prefill=${form.nationalId}`)
      if (res.ok) {
        const data = await res.json()
        setForm(f => ({
          ...f,
          fullName: data.fullName ?? f.fullName,
          phone:    data.phone    ?? f.phone,
          email:    data.email    ?? f.email,
          city:     data.city     ?? f.city,
        }))
      }
    } finally {
      setPrefilling(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/ko/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          router.push(`/eliminatorias/pago/${data.code}`)
          return
        }
        setError(data.error ?? 'Error al registrar')
        return
      }
      router.push(`/eliminatorias/pago/${data.participant.participationCode}`)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl mb-1">📝</div>
        <h1 className="text-xl font-extrabold text-slate-800">Inscripción — Dieciseisavos</h1>
        <p className="text-sm text-slate-500 mt-1">Si participaste en Fase de Grupos, ingresa tu cédula para recuperar tus datos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cédula con prefill */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Cédula de identidad</label>
          <div className="flex gap-2">
            <input
              type="text" inputMode="numeric" placeholder="Ej: 12345678"
              value={form.nationalId}
              onChange={e => setForm(f => ({ ...f, nationalId: e.target.value.replace(/\D/g, '') }))}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              required maxLength={10}
            />
            <button
              type="button" onClick={handlePrefill} disabled={prefilling || form.nationalId.length < 6}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
            >
              {prefilling ? '...' : 'Recuperar'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Toca "Recuperar" si ya participaste en grupos para pre-llenar el formulario.</p>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre completo</label>
          <input
            type="text" placeholder="Ej: María Rodríguez"
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
            required minLength={3} maxLength={100}
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
          <input
            type="tel" placeholder="Ej: 04141234567"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
            required minLength={10} maxLength={15}
          />
        </div>

        {/* Email y Ciudad (opcionales) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email <span className="text-slate-400 font-normal">(opcional)</span></label>
            <input
              type="email" placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ciudad <span className="text-slate-400 font-normal">(opcional)</span></label>
            <input
              type="text" placeholder="Ej: Caracas"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl text-base shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Continuar al pago →'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        ¿Ya te inscribiste? <a href="/eliminatorias/mi-quiniela" className="text-green-600 underline">Busca tu quiniela</a>
      </p>
    </div>
  )
}
