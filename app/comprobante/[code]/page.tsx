'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

interface Participant {
  fullName: string
  nationalId: string
  phone: string
  participationCode: string
  isComplete: boolean
  submittedAt: string | null
  payment: {
    paymentStatus: string
    amountUsd: number
    amountVes: number | null
    paymentReference: string | null
    senderBank: string | null
  } | null
  predictions: { id: string }[]
  ranking: { totalPoints: number; currentPosition: number } | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-slate-100 text-slate-600', icon: '⏳' },
  IN_REVIEW: { label: 'En revisión', color: 'bg-orange-100 text-orange-700', icon: '🔍' },
  VERIFIED: { label: 'Verificado', color: 'bg-green-100 text-green-700', icon: '✅' },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-700', icon: '❌' },
}

function maskPhone(phone: string) {
  if (phone.length <= 4) return phone
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

function maskId(id: string) {
  if (id.length <= 3) return id
  return id.slice(0, 2) + '***' + id.slice(-2)
}

export default function ComprobantePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [code])

  const loadData = async () => {
    const res = await fetch(`/api/participants?code=${code}`)
    if (res.ok) {
      const data = await res.json()
      setParticipant(data.participant)
    }
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚽</div>
          <p className="text-slate-600">Cargando comprobante...</p>
        </div>
      </div>
    )
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">❌</div>
          <h2 className="font-bold text-slate-800 mb-2">Participante no encontrado</h2>
          <Link href="/" className="text-green-600 hover:underline">Ir al inicio</Link>
        </div>
      </div>
    )
  }

  const payStatus = participant.payment?.paymentStatus ?? 'PENDING'
  const statusConfig = STATUS_CONFIG[payStatus]
  const whatsappMsg = encodeURIComponent(
    `Mi comprobante de la Quiniela Mundial 2026\n\nNombre: ${participant.fullName}\nCódigo: ${participant.participationCode}\nEstado de pago: ${statusConfig.label}`
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg print:hidden">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-xs text-green-200">Paso 5 de 5</p>
          <h1 className="font-bold text-lg">Comprobante de Participación</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {/* Success banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-2">⚽</div>
          <h2 className="font-bold text-xl mb-1">¡Estás participando!</h2>
          <p className="text-green-200 text-sm">Quiniela Mundial FIFA 2026</p>
        </div>

        {/* Code */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 text-center">
          <p className="text-sm text-slate-500 mb-2">Tu código de participación</p>
          <div className="text-3xl font-mono font-bold text-green-600 tracking-widest">{participant.participationCode}</div>
          <p className="text-xs text-slate-400 mt-2">Guarda este código para consultar tu quiniela</p>
        </div>

        {/* Participant info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-bold text-slate-700 mb-4">Datos del participante</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Nombre completo</span>
              <span className="text-sm font-semibold text-slate-800">{participant.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Cédula</span>
              <span className="text-sm font-mono text-slate-700">V-{maskId(participant.nationalId)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Teléfono</span>
              <span className="text-sm font-mono text-slate-700">{maskPhone(participant.phone)}</span>
            </div>
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Pronósticos</p>
            <p className="text-2xl font-bold text-blue-600">{participant.predictions.length}/72</p>
            <p className="text-xs text-slate-400 mt-1">{participant.isComplete ? '✅ Confirmada' : '⏳ Incompleta'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Estado de pago</p>
            <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusConfig.color} font-medium mt-1`}>
              {statusConfig.icon} {statusConfig.label}
            </div>
            {participant.payment?.amountUsd && (
              <p className="text-xs text-slate-400 mt-1">${participant.payment.amountUsd} USD</p>
            )}
          </div>
        </div>

        {/* Payment info */}
        {participant.payment?.paymentReference && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-700 mb-3 text-sm">Datos del pago</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Banco</span>
                <span className="text-slate-700">{participant.payment.senderBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Referencia</span>
                <span className="font-mono text-slate-700">{participant.payment.paymentReference}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            🖨️ Imprimir
          </button>
          <a
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            📲 Compartir
          </a>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-2 print:hidden">
          <Link
            href={`/mi-quiniela/${code}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Ver mi quiniela completa
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 block">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
