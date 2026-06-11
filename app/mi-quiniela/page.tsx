'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { track } from '@/lib/analytics'

export default function MiQuinielaSearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setError('')
    setLoading(true)

    try {
      // Try by participation code first (starts with letters)
      // Then by nationalId (all digits), then by phone
      const isCode    = /^[A-Za-z]{3}/i.test(q)
      const isNumeric = /^\d+$/.test(q)

      let res: Response | null = null
      let participationCode: string | null = null

      if (isCode) {
        // Direct lookup by code
        res = await fetch(`/api/participants?code=${encodeURIComponent(q.toUpperCase())}`)
        if (res.ok) {
          const data = await res.json()
          participationCode = data.participant?.participationCode ?? null
        }
      }

      if (!participationCode && isNumeric) {
        // Try by nationalId
        res = await fetch(`/api/participants?nationalId=${encodeURIComponent(q)}`)
        if (res.ok) {
          const data = await res.json()
          participationCode = data.participationCode ?? null
        }
      }

      if (!participationCode) {
        // Try by phone
        res = await fetch(`/api/participants?phone=${encodeURIComponent(q)}`)
        if (res && res.ok) {
          const data = await res.json()
          participationCode = data.participationCode ?? null
        }
      }

      if (participationCode) {
        track('PARTICIPANT_LOOKUP', '/mi-quiniela')
        router.push(`/mi-quiniela/${participationCode}`)
      } else {
        setError('No encontramos una quiniela con esos datos. Verifica la información o crea una nueva participación.')
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-4 px-4 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-green-200 text-sm hover:text-white transition-colors">← Inicio</Link>
          <h1 className="font-bold text-lg">Quiniela Mundial 2026</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🔍</div>
              <h2 className="text-2xl font-bold text-slate-800">Consulta tu quiniela</h2>
              <p className="text-slate-500 text-sm mt-2">
                Ingresa tu cédula, WhatsApp o código de participación para continuar o revisar tu quiniela.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cédula, WhatsApp o código
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: 12345678 · 04141234567 · MUN26-XXXX"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400"
                  autoComplete="off"
                  required
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Puedes buscar con tu cédula (solo números), WhatsApp o el código que recibiste al registrarte.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  {error}
                  <div className="mt-3">
                    <Link href="/registro" className="inline-flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">
                      Crear mi quiniela
                    </Link>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
              >
                {loading ? 'Buscando...' : 'Buscar mi quiniela'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
              <p className="text-sm text-slate-500">
                ¿Aún no tienes quiniela?{' '}
                <Link href="/registro" className="text-green-600 font-semibold hover:underline">
                  Crear una ahora
                </Link>
              </p>
              <p className="text-xs text-slate-300">
                <Link href="/admin/login" className="hover:text-slate-400 transition-colors">
                  Administrador
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

