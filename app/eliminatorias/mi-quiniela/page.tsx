'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function KOLookupPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const q = query.trim()
      let url = ''
      if (/^KO/i.test(q)) {
        url = `/api/ko/participants?code=${encodeURIComponent(q.toUpperCase())}`
      } else if (/^\d+$/.test(q)) {
        url = `/api/ko/participants?nationalId=${q}`
      } else {
        url = `/api/ko/participants?phone=${encodeURIComponent(q)}`
      }

      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        setError('No encontramos un participante con esos datos. Verifica tu código, cédula o WhatsApp.')
        return
      }

      const code = data.participationCode ?? data.participant?.participationCode
      if (code) {
        router.push(`/eliminatorias/mi-quiniela/${code}`)
      } else {
        setError('No se pudo determinar el código de participación.')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl mb-1">🔍</div>
        <h1 className="text-xl font-extrabold text-slate-800">Busca tu quiniela</h1>
        <p className="text-sm text-slate-500 mt-1">Ingresa tu cédula o número de WhatsApp para ver tu quiniela</p>
      </div>

      <form onSubmit={lookup} className="space-y-4">
        <input
          type="text"
          placeholder="Cédula (ej: 12345678) o WhatsApp (ej: 04141234567)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full border-2 border-slate-200 focus:border-green-400 rounded-xl px-4 py-4 text-base focus:outline-none"
          autoComplete="off"
          autoFocus
        />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
        <button
          type="submit" disabled={loading || !query.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl text-base shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar →'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400">
        ¿Aún no estás inscrito?{' '}
        <a href="/eliminatorias/registro" className="text-green-600 font-semibold hover:underline">Inscribirme</a>
      </p>
    </div>
  )
}
