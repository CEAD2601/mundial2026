import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PaymentActions } from '../PaymentActions'

export const dynamic = 'force-dynamic'

const PHASE        = 'knockout_round_16_to_final'
const ENTRY_USD    = 20
const FIXED_RATE   = 730
const TOTAL_PICKS  = 15   // R16(8) + QF(4) + SF(2) + FINAL(1)

function fmtVes(n: number) { return Math.round(n).toLocaleString('es-VE') }
function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 1) return 'ahora mismo'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}
function formatTime(date: Date) {
  return date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Caracas' })
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'Sin pago', IN_REVIEW: 'En revisión', VERIFIED: 'Verificado ✅', REJECTED: 'Rechazado',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING:   'bg-slate-100 text-slate-500', IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED:  'bg-green-100 text-green-700', REJECTED:  'bg-red-100 text-red-600',
}

export default async function AdminOctavosPage() {
  const nowUtc = new Date()

  const allParticipants = await prisma.kOParticipant.findMany({
    where:    { phase: PHASE },
    include:  { payment: true, picks: { select: { matchId: true } } },
    orderBy:  { createdAt: 'desc' },
  })

  const totalKO    = allParticipants.length
  const completeKO = allParticipants.filter(p => p.isComplete).length
  const verifiedKO = allParticipants.filter(p => p.payment?.paymentStatus === 'VERIFIED').length
  const inReviewKO = allParticipants.filter(p => p.payment?.paymentStatus === 'IN_REVIEW').length
  const rejectedKO = allParticipants.filter(p => p.payment?.paymentStatus === 'REJECTED').length
  const pendingKO  = allParticipants.filter(p => !p.payment || p.payment.paymentStatus === 'PENDING').length

  const pozoUSD  = verifiedKO * ENTRY_USD
  const pozoBs   = pozoUSD * FIXED_RATE

  const pendingPayment = allParticipants.filter(p =>
    p.isComplete && p.payment?.paymentStatus !== 'VERIFIED'
  )
  const recent = allParticipants.slice(0, 20)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Octavos a Final</h1>
          <p className="text-slate-500 text-sm">
            Dashboard KO — Fase R16-Final · {nowUtc.toLocaleDateString('es-VE', { timeZone: 'America/Caracas', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/eliminatorias/octavos"
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl font-semibold transition-colors">
          🔄 Actualizar
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { val: totalKO,    label: 'Inscritos',   color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100'   },
          { val: completeKO, label: 'Completas',   color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { val: inReviewKO, label: 'En revisión', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100'  },
          { val: verifiedKO, label: 'Verificados', color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100'  },
          { val: pendingKO,  label: 'Sin pago',    color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200'  },
          { val: rejectedKO, label: 'Rechazados',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100'    },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-3 py-3 text-center`}>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pozo */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg">💰 Pozo · Octavos a Final</h2>
          <span className="text-xs text-blue-200">{FIXED_RATE} Bs/USD · ${ENTRY_USD}/entrada</span>
        </div>
        <div className="text-3xl font-extrabold">${pozoUSD} USD</div>
        <div className="text-blue-200 text-sm mb-3">{fmtVes(pozoBs)} Bs · {verifiedKO} verificado{verifiedKO !== 1 ? 's' : ''}</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: '1er lugar (65%)',    usd: pozoUSD * 0.65 },
            { label: '2do lugar (20%)',    usd: pozoUSD * 0.20 },
            { label: 'Organización (15%)', usd: pozoUSD * 0.15 },
          ].map(p => (
            <div key={p.label} className="bg-white/10 rounded-xl p-2">
              <div className="text-lg font-extrabold">${p.usd.toFixed(0)}</div>
              <div className="text-[10px] text-blue-200 leading-tight">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quinielas completas — confirmar pago */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-extrabold text-slate-800 text-base">🔒 Quinielas completas — confirmar pago</h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            pendingPayment.length > 0 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>{pendingPayment.length}</span>
        </div>

        {pendingPayment.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-sm">
            No hay quinielas completas pendientes de verificar 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayment.map(p => {
              const pay = p.payment
              const pStatus = pay?.paymentStatus ?? 'PENDING'
              return (
                <div key={p.id} className="bg-white border-2 border-blue-300 rounded-2xl px-4 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <div>
                      <p className="font-extrabold text-slate-900 text-base">{p.fullName}</p>
                      <p className="text-xs text-slate-500">CI: {p.nationalId} · {p.phone}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">
                        🔒 {p.picks.length} picks
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_COLOR[pStatus]}`}>
                        {STATUS_LABEL[pStatus]}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3 text-xs space-y-1">
                    {pay?.paymentMethod ? (
                      <>
                        <div><span className="text-slate-500">Método: </span><strong>{pay.paymentMethod === 'PAGO_MOVIL' ? 'Pago Móvil Banesco' : 'Zelle'}</strong></div>
                        {pay.paymentReference && <div><span className="text-slate-500">Ref: </span><strong>{pay.paymentReference}</strong></div>}
                        <div><span className="text-slate-500">Monto: </span><strong>${pay.amountUsd} USD</strong></div>
                      </>
                    ) : (
                      <p className="text-slate-400 italic">Pago no reportado aún</p>
                    )}
                    <div className="text-slate-400">Inscripción: {formatTime(p.createdAt)} · {timeAgo(p.createdAt)}</div>
                  </div>
                  {pay ? (
                    <PaymentActions paymentId={pay.id} participantName={p.fullName} />
                  ) : (
                    <p className="text-xs text-slate-400 italic">El participante debe reportar su pago primero</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Registros recientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-700">
            📋 Inscritos recientes
            <span className="ml-2 text-sm font-normal text-slate-400">({recent.length})</span>
          </h2>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-sm">
            Sin inscripciones aún para Octavos a Final
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase"
              style={{ gridTemplateColumns: '1fr 80px 100px 60px' }}>
              <span>Participante</span><span>Picks</span><span>Pago</span><span>Hora</span>
            </div>
            {recent.map(p => {
              const pStatus = p.payment?.paymentStatus ?? 'PENDING'
              return (
                <div key={p.id} className="grid px-4 py-2.5 border-b border-slate-100 last:border-b-0 items-center"
                  style={{ gridTemplateColumns: '1fr 80px 100px 60px' }}>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.fullName}</p>
                    <p className="text-[10px] text-slate-400">{p.nationalId} · {p.participationCode}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {p.picks.length}{p.isComplete ? ' 🔒' : ''}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${STATUS_COLOR[pStatus]}`}>
                    {STATUS_LABEL[pStatus]}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatTime(p.createdAt)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-sm flex-wrap">
        <Link href="/admin/eliminatorias" className="text-slate-400 hover:text-slate-600 hover:underline">
          ← Dashboard R32
        </Link>
        <a href="/octavos/registro" target="_blank" className="text-blue-600 hover:underline">
          Portal registro Octavos →
        </a>
        <a href="/eliminatorias/ranking" target="_blank" className="text-blue-600 hover:underline">
          Ranking activo →
        </a>
      </div>
    </div>
  )
}
