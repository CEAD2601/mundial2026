'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type PaymentStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED'

interface Participant {
  id: string
  fullName: string
  nationalId: string
  phone: string
  participationCode: string
  isComplete: boolean
  picksCount: number
  paymentStatus: PaymentStatus
  paymentId: string | null
  paymentMethod: string | null
  createdAt: string
}

interface Stats {
  total: number
  complete: number
  pending: number
  inReview: number
  verified: number
  rejected: number
  pozoUSD: number
}

const TASA = 730
const STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING:   '⚪ Sin pago',
  IN_REVIEW: '⏳ En revisión',
  VERIFIED:  '✅ Verificado',
  REJECTED:  '❌ Rechazado',
}
const STATUS_COLOR: Record<PaymentStatus, string> = {
  PENDING:   'bg-slate-100 text-slate-500',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED:  'bg-green-100 text-green-700',
  REJECTED:  'bg-red-100 text-red-600',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ahora mismo'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

export default function AdminKODashboard() {
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [recent,   setRecent]   = useState<Participant[]>([])
  const [inReview, setInReview] = useState<Participant[]>([])
  const [loading,  setLoading]  = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [toast,    setToast]    = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Usar el stats endpoint con secret (no depende de cookie, funciona siempre)
      const r = await fetch('/api/admin/ko/stats?secret=CEAD2601')
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const d = await r.json()
      setStats(d.stats)
      setRecent(d.recent ?? [])
      setInReview(d.inReview ?? [])
    } catch (e) {
      console.error('Error cargando stats KO:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const updatePayment = async (paymentId: string, status: PaymentStatus, name: string) => {
    setActionId(paymentId)
    try {
      const r = await fetch('/api/admin/ko/payments?secret=CEAD2601', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      })
      if (!r.ok) throw new Error('Error')
      showToast(status === 'VERIFIED' ? `✅ ${name} verificado` : `❌ ${name} rechazado`)
      await loadData()
    } catch {
      showToast('❌ Error al actualizar pago')
    } finally {
      setActionId(null)
    }
  }

  const pozoUSD  = stats?.pozoUSD ?? 0
  const pozoBs   = pozoUSD * TASA
  const prize1   = Math.floor(pozoUSD * 0.5)
  const prize2   = Math.floor(pozoUSD * 0.3)
  const prizeOrg = Math.floor(pozoUSD * 0.2)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Eliminatorias 2026</h1>
          <p className="text-slate-500 text-sm">Panel KO — Dieciseisavos de Final</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl font-semibold transition-colors"
        >
          {loading ? '⏳ Cargando…' : '🔄 Actualizar'}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: 'Inscritos',   val: stats?.total    ?? 0, color: 'text-blue-700',    bg: 'bg-blue-50',   border: 'border-blue-100'   },
          { label: 'Completas',   val: stats?.complete ?? 0, color: 'text-indigo-700',  bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'En revisión', val: stats?.inReview ?? 0, color: 'text-amber-700',   bg: 'bg-amber-50',  border: 'border-amber-100'  },
          { label: 'Verificados', val: stats?.verified ?? 0, color: 'text-green-700',   bg: 'bg-green-50',  border: 'border-green-100'  },
          { label: 'Pendientes',  val: stats?.pending  ?? 0, color: 'text-slate-600',   bg: 'bg-slate-50',  border: 'border-slate-200'  },
          { label: 'Rechazados',  val: stats?.rejected ?? 0, color: 'text-red-700',     bg: 'bg-red-50',    border: 'border-red-100'    },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-3 py-3 text-center`}>
            <div className={`text-xl font-extrabold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pozo */}
      <div className="bg-gradient-to-br from-green-700 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-2">Pozo acumulado (pagos verificados)</p>
        <div className="text-3xl font-extrabold">${pozoUSD.toLocaleString('es-VE')} USD</div>
        <div className="text-green-200 text-sm mb-3">{pozoBs.toLocaleString('es-VE')} Bs · Tasa {TASA} Bs/USD</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: '1er lugar (50%)',  val: prize1  },
            { label: '2do lugar (30%)',  val: prize2  },
            { label: 'Organización (20%)', val: prizeOrg },
          ].map(p => (
            <div key={p.label} className="bg-white/10 rounded-xl p-2">
              <div className="text-lg font-extrabold">${p.val}</div>
              <div className="text-[10px] text-green-200 leading-tight">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagos en revisión — acción directa */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-slate-700 text-sm">
            ⏳ Pagos en revisión
            {inReview.length > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {inReview.length}
              </span>
            )}
          </h2>
          <Link href="/admin/eliminatorias/pagos" className="text-xs text-green-600 hover:underline font-semibold">
            Ver todos los pagos →
          </Link>
        </div>

        {inReview.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-400">
            {loading ? 'Cargando…' : 'No hay pagos en revisión 🎉'}
          </div>
        ) : (
          <div className="space-y-2">
            {inReview.map(p => (
              <div key={p.id} className="bg-white border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{p.fullName}</p>
                    <p className="text-xs text-slate-500">
                      CI: {p.nationalId} · {p.phone} · {p.participationCode}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {p.picksCount}/16 picks · {p.paymentMethod ?? 'Sin método'} · {timeAgo(p.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={actionId === p.paymentId}
                      onClick={() => p.paymentId && updatePayment(p.paymentId, 'VERIFIED', p.fullName)}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                    >
                      ✅ Verificar
                    </button>
                    <button
                      disabled={actionId === p.paymentId}
                      onClick={() => p.paymentId && updatePayment(p.paymentId, 'REJECTED', p.fullName)}
                      className="bg-red-100 hover:bg-red-200 disabled:opacity-40 text-red-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registros recientes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-slate-700 text-sm">🕐 Registros recientes</h2>
          <Link href="/admin/eliminatorias/participantes" className="text-xs text-green-600 hover:underline font-semibold">
            Ver todos →
          </Link>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-6">Cargando…</p>
          ) : recent.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Sin registros aún</p>
          ) : (
            <div>
              {/* Header */}
              <div className="grid px-4 py-2 bg-slate-50 border-b border-slate-100"
                style={{ gridTemplateColumns: '1fr 60px 70px 80px' }}>
                {['Participante', 'Picks', 'Estado', 'Tiempo'].map(h => (
                  <span key={h} className="text-[10px] font-bold text-slate-500 uppercase">{h}</span>
                ))}
              </div>
              {recent.map(p => (
                <div key={p.id}
                  className="grid px-4 py-2.5 border-b border-slate-100 last:border-b-0 items-center"
                  style={{ gridTemplateColumns: '1fr 60px 70px 80px' }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.fullName}</p>
                    <p className="text-[10px] text-slate-400">V-{p.nationalId}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">{p.picksCount}/16</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block ${STATUS_COLOR[p.paymentStatus]}`}>
                    {STATUS_LABEL[p.paymentStatus].replace(/^[^\s]+\s/, '')}
                  </span>
                  <span className="text-[10px] text-slate-400">{timeAgo(p.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Links de navegación */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/admin/eliminatorias/pagos',         label: '💳 Verificar pagos',    desc: `${stats?.inReview ?? 0} en revisión` },
          { href: '/admin/eliminatorias/participantes', label: '👥 Participantes',       desc: `${stats?.total ?? 0} inscritos`      },
          { href: '/admin/eliminatorias/resultados',    label: '⚽ Ingresar resultados', desc: 'Actualiza picks y ranking'           },
          { href: '/admin/eliminatorias/ranking',       label: '🏆 Ranking KO',         desc: `${stats?.verified ?? 0} verificados` },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:shadow-md transition-shadow">
            <div className="font-bold text-slate-800 text-sm">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
          ← Volver al admin (Fase de Grupos)
        </Link>
        <a href="/eliminatorias" target="_blank" className="text-sm text-green-600 hover:underline">
          Ver sitio público →
        </a>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
