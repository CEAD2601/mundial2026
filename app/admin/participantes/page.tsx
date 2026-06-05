'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Participant {
  id: string
  fullName: string
  nationalId: string
  phone: string
  email: string | null
  city: string | null
  participationCode: string
  isComplete: boolean
  createdAt: string
  payment: { paymentStatus: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_REVIEW: 'En revisión',
  VERIFIED: 'Verificado',
  REJECTED: 'Rechazado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  IN_REVIEW: 'bg-orange-100 text-orange-700',
  VERIFIED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function ParticipantesPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadParticipants()
  }, [])

  const loadParticipants = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/participants')
    if (res.ok) {
      const data = await res.json()
      setParticipants(data.participants ?? [])
    }
    setLoading(false)
  }

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.nationalId.includes(q) ||
      p.participationCode.toLowerCase().includes(q) ||
      (p.city ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Participantes</h1>
        <span className="text-sm text-slate-500">{participants.length} en total</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="p-4 border-b border-slate-100">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Cédula</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Código</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Ciudad</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Quiniela</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Pago</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{p.nationalId}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{p.participationCode}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.city ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.isComplete ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Completa</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">Incompleta</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[p.payment?.paymentStatus ?? 'PENDING']}`}>
                        {STATUS_LABELS[p.payment?.paymentStatus ?? 'PENDING']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/mi-quiniela/${p.participationCode}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline mr-2"
                      >
                        Ver quiniela
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No se encontraron participantes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
