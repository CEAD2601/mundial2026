'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PHASE = 'knockout_round_16_to_final'

export default function OctavosLlenadoPage() {
  const router = useRouter()
  const [query,   setQuery]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleLookup() {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError('')

    const digits  = q.replace(/\D/g, '')
    const isPhone = digits.length >= 10 && (digits.startsWith('04') || digits.startsWith('58'))
    const isCode  = q.toUpperCase().startsWith('KO26-')

    try {
      let url = ''
      if (isCode) {
        url = `/api/ko/participants?code=${encodeURIComponent(q.toUpperCase())}`
      } else if (isPhone) {
        url = `/api/ko/participants?phone=${encodeURIComponent(q)}&phase=${PHASE}`
      } else {
        url = `/api/ko/participants?nationalId=${encodeURIComponent(digits)}&phase=${PHASE}`
      }

      const res  = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        setError('No encontramos tu inscripción en Octavos a Final. ¿Ya te registraste?')
        setLoading(false)
        return
      }

      // GET ?code= returns { participant: { participationCode } }
      // GET ?nationalId= / ?phone= returns { participationCode }
      const code = data.participant?.participationCode ?? data.participationCode
      if (!code) {
        setError('No encontramos tu inscripción.')
        setLoading(false)
        return
      }

      router.push(`/octavos/llenado/${code}`)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-blue-950 flex flex-col items-center justify-start px-4 pb-12">

      <div className="w-full max-w-md py-8 text-center">
        <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-1">🏆 FIFA World Cup 2026™</p>
        <h1 className="text-white text-2xl font-extrabold mb-0.5">Llenar Quiniela</h1>
        <h2 className="text-blue-200 text-lg font-bold">Octavos a Final</h2>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-extrabold text-slate-800 text-lg">Accede a tu quiniela</h3>
            <p className="text-slate-500 text-sm mt-1">Ingresa tu código, cédula o WhatsApp</p>
          </div>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="KO26-XXXXXX · 12345678 · 04141234567"
            className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            autoFocus
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleLookup}
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            {loading ? 'Buscando…' : '→ Ir a mi quiniela'}
          </button>

          <p className="text-center text-xs text-slate-400">
            ¿Aún no estás inscrito?{' '}
            <Link href="/octavos/registro" className="text-blue-600 hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-300 hover:text-white text-xs transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
