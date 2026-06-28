'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ── Tipos ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED'

interface KOParticipant {
  id:                string
  fullName:          string
  nationalId:        string
  phone:             string
  participationCode: string
  isComplete:        boolean
  createdAt:         string
  phase:             string
  picks:             Array<{ matchId: string }>
  payment: {
    id:               string
    paymentStatus:    PaymentStatus
    paymentMethod:    string | null
    senderBank:       string | null
    senderName:       string | null
    senderEmail:      string | null
    paymentReference: string | null
    paymentDate:      string | null
    amountUsd:        number
    amountVes:        number | null
    adminNotes:       string | null
    createdAt:        string
  } | null
}

// ── Constantes ───────────────────────────────────────────────────────────────

const TASA = 730

const STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING:   'Sin pago',
  IN_REVIEW: 'En revisión',
  VERIFIED:  'Verificado',
  REJECTED:  'Rechazado',
}

const STATUS_COLOR: Record<PaymentStatus, string> = {
  PENDING:   'bg-slate-100 text-slate-500',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED:  'bg-green-100 text-green-700',
  REJECTED:  'bg-red-100 text-red-600',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function maskId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + '****' + id.slice(-2)
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

function fmtPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('58')) return `+${digits}`
  if (digits.length === 10) return `+58${digits}`
  return phone
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function AdminKODashboard() {
  const [participants, setParticipants] = useState<KOParticipant[]>([])
  const [loading,      setLoading]      = useState(true)
  const [actionId,     setActionId]     = useState<string | null>(null)
  const [toast,        setToast]        = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  // Misma fuente que /admin/eliminatorias/participantes
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/ko/participants')
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const d = await r.json()
      setParticipants(d.participants ?? [])
    } catch (e) {
      console.error('Error cargando participantes KO:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Calcular stats desde los participantes (igual que la página de participantes)
  const total      = participants.length
  const complete   = participants.filter(p => p.isComplete).length
  const inReview   = participants.filter(p => p.payment?.paymentStatus === 'IN_REVIEW')
  const verified   = participants.filter(p => p.payment?.paymentStatus === 'VERIFIED')
  const pending    = participants.filter(p => !p.payment || p.payment.paymentStatus === 'PENDING')
  const rejected   = participants.filter(p => p.payment?.paymentStatus === 'REJECTED')

  const pozoUSD    = verified.reduce((s, p) => s + (p.payment?.amountUsd ?? 20), 0)
  const pozoBs     = pozoUSD * TASA
  const prize1     = Math.floor(pozoUSD * 0.65)
  const prize2     = Math.floor(pozoUSD * 0.20)
  const prizeOrg   = Math.floor(pozoUSD * 0.15)

  // Registros recientes: ordenados por fecha de inscripción
  const recent = [...participants]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)

  const updatePayment = async (paymentId: string, status: PaymentStatus, name: string) => {
    setActionId(paymentId)
    try {
      const r = await fetch('/api/admin/ko/payments', {
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Eliminatorias 2026</h1>
          <p className="text-slate-500 text-sm">Dashboard KO — Dieciseisavos de Final</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl font-semibold transition-colors"
        >
          {loading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-slate-400 text-sm">Cargando datos reales…</div>
      )}

      {!loading && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label: 'Inscritos',   val: total,            color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100'  },
              { label: 'Completas',   val: complete,         color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100'},
              { label: 'En revisión', val: inReview.length,  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100' },
              { label: 'Verificados', val: verified.length,  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100' },
              { label: 'Sin pago',    val: pending.length,   color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200' },
              { label: 'Rechazados',  val: rejected.length,  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100'   },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-3 py-3 text-center`}>
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pozo */}
          <div className="bg-gradient-to-br from-green-700 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-2">
              Pozo acumulado · {verified.length} pago{verified.length !== 1 ? 's' : ''} verificado{verified.length !== 1 ? 's' : ''}
            </p>
            <div className="text-3xl font-extrabold">${pozoUSD.toLocaleString('es-VE')} USD</div>
            <div className="text-green-200 text-sm mb-3">{pozoBs.toLocaleString('es-VE')} Bs · Tasa {TASA} Bs/USD</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: '1er lugar (65%)',    val: prize1   },
                { label: '2do lugar (20%)',    val: prize2   },
                { label: 'Organización (15%)', val: prizeOrg },
              ].map(p => (
                <div key={p.label} className="bg-white/10 rounded-xl p-2">
                  <div className="text-lg font-extrabold">${p.val}</div>
                  <div className="text-[10px] text-green-200 leading-tight">{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagos en revisión */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-extrabold text-slate-700 text-sm flex items-center gap-2">
                ⏳ Pagos en revisión
                {inReview.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {inReview.length}
                  </span>
                )}
              </h2>
              <Link href="/admin/eliminatorias/pagos" className="text-xs text-green-600 hover:underline font-semibold">
                Ver todos →
              </Link>
            </div>

            {inReview.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-400">
                No hay pagos en revisión 🎉
              </div>
            ) : (
              <div className="space-y-2">
                {inReview.map(p => (
                  <div key={p.id} className="bg-white border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">{p.fullName}</p>
                        <p className="text-xs text-slate-500">
                          CI: {p.nationalId} · {fmtPhone(p.phone)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {p.picks.length}/16 picks
                          {p.payment?.paymentMethod ? ` · ${p.payment.paymentMethod === 'PAGO_MOVIL' ? 'Pago Móvil' : p.payment.paymentMethod === 'ZELLE' ? 'Zelle' : p.payment.paymentMethod}` : ''}
                          {p.payment?.senderBank ? ` · ${p.payment.senderBank}` : ''}
                          {p.payment?.paymentReference ? ` · Ref: ${p.payment.paymentReference}` : ''}
                        </p>
                        {p.payment?.createdAt && (
                          <p className="text-[10px] text-slate-400">{timeAgo(p.payment.createdAt)}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                        <button
                          disabled={actionId === p.payment?.id}
                          onClick={() => p.payment && updatePayment(p.payment.id, 'VERIFIED', p.fullName)}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                        >
                          ✅ Verificar
                        </button>
                        <button
                          disabled={actionId === p.payment?.id}
                          onClick={() => p.payment && updatePayment(p.payment.id, 'REJECTED', p.fullName)}
                          className="bg-red-100 hover:bg-red-200 disabled:opacity-40 text-red-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
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
                Ver todos ({total}) →
              </Link>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {recent.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Sin registros aún</p>
              ) : (
                <>
                  <div className="hidden sm:grid px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase"
                    style={{ gridTemplateColumns: '1fr 80px 60px 90px 70px' }}>
                    <span>Participante</span>
                    <span>WhatsApp</span>
                    <span>Picks</span>
                    <span>Pago</span>
                    <span>Inscripción</span>
                  </div>
                  {recent.map(p => {
                    const pStatus = (p.payment?.paymentStatus ?? 'PENDING') as PaymentStatus
                    return (
                      <div key={p.id} className="px-4 py-3 border-b border-slate-100 last:border-b-0">
                        {/* Mobile layout */}
                        <div className="sm:hidden flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{p.fullName}</p>
                            <p className="text-[10px] text-slate-500">
                              V-{maskId(p.nationalId)} · {fmtPhone(p.phone)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {p.picks.length}/16 picks · {p.isComplete ? '🔒 Confirmada' : '✏️ Abierta'} · {timeAgo(p.createdAt)}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${STATUS_COLOR[pStatus]}`}>
                            {STATUS_LABEL[pStatus]}
                          </span>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden sm:grid items-center"
                          style={{ gridTemplateColumns: '1fr 80px 60px 90px 70px' }}>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{p.fullName}</p>
                            <p className="text-[10px] text-slate-400">V-{maskId(p.nationalId)}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{p.phone.slice(-10)}</span>
                          <span className="text-xs font-bold text-slate-700 tabular-nums">
                            {p.picks.length}/16
                            <span className="ml-1 text-[10px] text-slate-400">
                              {p.isComplete ? '🔒' : '✏️'}
                            </span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block ${STATUS_COLOR[pStatus]}`}>
                            {STATUS_LABEL[pStatus]}
                          </span>
                          <span className="text-[10px] text-slate-400">{timeAgo(p.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>

          {/* Navegación */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/eliminatorias/pagos',         label: '💳 Verificar pagos',    desc: `${inReview.length} en revisión`   },
              { href: '/admin/eliminatorias/participantes', label: '👥 Participantes',       desc: `${total} inscritos`               },
              { href: '/admin/eliminatorias/resultados',    label: '⚽ Ingresar resultados', desc: 'Actualiza picks y ranking'        },
              { href: '/admin/eliminatorias/ranking',       label: '🏆 Ranking KO',         desc: `${verified.length} verificados`   },
            ].map(({ href, label, desc }) => (
              <Link key={href} href={href}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:shadow-md transition-shadow">
                <div className="font-bold text-slate-800 text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-slate-400 hover:text-slate-600 hover:underline">
              ← Volver al admin (Fase de Grupos)
            </Link>
            <a href="/eliminatorias" target="_blank" className="text-green-600 hover:underline">
              Ver sitio público →
            </a>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
