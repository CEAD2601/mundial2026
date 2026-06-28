'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  paymentId: string
  participantName: string
}

export function PaymentActions({ paymentId, participantName }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const update = async (status: 'VERIFIED' | 'REJECTED') => {
    setBusy(true)
    try {
      const r = await fetch('/api/admin/ko/payments?secret=CEAD2601', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      })
      if (!r.ok) throw new Error('Error al actualizar')
      router.refresh()
    } catch {
      alert('Error al actualizar el pago. Intenta de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        disabled={busy}
        onClick={() => update('VERIFIED')}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap"
        title={`Verificar pago de ${participantName}`}
      >
        {busy ? '…' : '✅ Verificar'}
      </button>
      <button
        disabled={busy}
        onClick={() => update('REJECTED')}
        className="bg-red-100 hover:bg-red-200 disabled:opacity-40 text-red-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap"
        title={`Rechazar pago de ${participantName}`}
      >
        {busy ? '…' : '❌ Rechazar'}
      </button>
    </div>
  )
}
