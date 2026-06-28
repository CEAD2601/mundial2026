import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PaymentActions } from './PaymentActions'

export const dynamic = 'force-dynamic'

const ENTRY_USD  = 20
const FIXED_RATE = 730

function fmtVes(n: number) {
  return Math.round(n).toLocaleString('es-VE')
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ahora mismo'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'Sin pago',
  IN_REVIEW: 'En revisión',
  VERIFIED:  'Verificado',
  REJECTED:  'Rechazado',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING:   'bg-slate-100 text-slate-500',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED:  'bg-green-100 text-green-700',
  REJECTED:  'bg-red-100 text-red-600',
}

export default async function AdminEliminatoriasPage() {
  const [
    totalKO,
    completeKO,
    verifiedKO,
    inReviewKO,
    rejectedKO,
    pendingKO,
    paymentsInReview,
    recentParticipants,
  ] = await Promise.all([
    prisma.kOParticipant.count({ where: { phase: 'R32' } }),
    prisma.kOParticipant.count({ where: { phase: 'R32', isComplete: true } }),
    prisma.kOPayment.count({ where: { paymentStatus: 'VERIFIED',  participant: { phase: 'R32' } } }),
    prisma.kOPayment.count({ where: { paymentStatus: 'IN_REVIEW', participant: { phase: 'R32' } } }),
    prisma.kOPayment.count({ where: { paymentStatus: 'REJECTED',  participant: { phase: 'R32' } } }),
    prisma.kOPayment.count({ where: { paymentStatus: 'PENDING',   participant: { phase: 'R32' } } }),
    prisma.kOPayment.findMany({
      where: { paymentStatus: 'IN_REVIEW', participant: { phase: 'R32' } },
      include: { participant: { include: { picks: { select: { matchId: true } } } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.kOParticipant.findMany({
      where: { phase: 'R32' },
      include: {
        payment: { select: { paymentStatus: true } },
        picks:   { select: { matchId: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const pozoUSD  = verifiedKO * ENTRY_USD
  const pozoBs   = pozoUSD * FIXED_RATE
  const prize1   = pozoUSD * 0.65
  const prize2   = pozoUSD * 0.20
  const prizeOrg = pozoUSD * 0.15

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Eliminatorias 2026</h1>
        <p className="text-slate-500 text-sm">Dashboard KO — Dieciseisavos de Final</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">💰 Pozo · Dieciseisavos</h2>
          <span className="text-xs text-green-200">{FIXED_RATE} Bs/USD</span>
        </div>
        <div className="text-3xl font-extrabold mb-1">${pozoUSD.toLocaleString('es-VE')} USD</div>
        <div className="text-green-200 text-sm mb-3">{fmtVes(pozoBs)} Bs · {verifiedKO} pago{verifiedKO !== 1 ? 's' : ''} verificado{verifiedKO !== 1 ? 's' : ''}</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: '1er lugar (65%)',    usd: prize1   },
            { label: '2do lugar (20%)',    usd: prize2   },
            { label: 'Organización (15%)', usd: prizeOrg },
          ].map(p => (
            <div key={p.label} className="bg-white/10 rounded-xl p-2">
              <div className="text-lg font-extrabold">${p.usd.toFixed(0)}</div>
              <div className="text-[10px] text-green-200 leading-tight">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagos en revisión */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-700 flex items-center gap-2">
            ⏳ Pagos en revisión
            {inReviewKO > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {inReviewKO}
              </span>
            )}
          </h2>
          <Link href="/admin/eliminatorias/pagos" className="text-xs text-green-600 hover:underline font-semibold">
            Ver todos →
          </Link>
        </div>

        {paymentsInReview.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-400">
            No hay pagos en revisión 🎉
          </div>
        ) : (
          <div className="space-y-2">
            {paymentsInReview.map(pay => (
              <div key={pay.id} className="bg-white border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{pay.participant.fullName}</p>
                    <p className="text-xs text-slate-500">
                      CI: {pay.participant.nationalId} · {pay.participant.phone}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {pay.participant.picks.length}/16 picks
                      {pay.paymentMethod ? ` · ${pay.paymentMethod === 'PAGO_MOVIL' ? 'Pago Móvil' : 'Zelle'}` : ''}
                      {pay.senderBank ? ` · ${pay.senderBank}` : ''}
                      {pay.paymentReference ? ` · Ref: ${pay.paymentReference}` : ''}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      ${pay.amountUsd} USD{pay.amountVes ? ` / ${fmtVes(pay.amountVes)} Bs` : ''}
                      {' · '}{timeAgo(pay.createdAt)}
                    </p>
                  </div>
                  <PaymentActions paymentId={pay.id} participantName={pay.participant.fullName} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registros recientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-700">🕐 Registros recientes</h2>
          <Link href="/admin/eliminatorias/participantes" className="text-xs text-green-600 hover:underline font-semibold">
            Ver todos ({totalKO}) →
          </Link>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {recentParticipants.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Sin registros aún</p>
          ) : (
            <div>
              {recentParticipants.map(p => {
                const pStatus = p.payment?.paymentStatus ?? 'PENDING'
                return (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-b-0 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {p.nationalId} · {p.phone}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.picks.length}/16 picks
                        {p.isComplete ? ' · 🔒 Confirmada' : ' · ✏️ Abierta'}
                        {' · '}{timeAgo(p.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${STATUS_COLOR[pStatus]}`}>
                        {STATUS_LABEL[pStatus]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/admin/eliminatorias/pagos',         label: '💳 Verificar pagos',    desc: `${inReviewKO} en revisión`  },
          { href: '/admin/eliminatorias/participantes', label: '👥 Participantes',       desc: `${totalKO} inscritos`       },
          { href: '/admin/eliminatorias/resultados',    label: '⚽ Resultados',          desc: 'Ingresar resultados KO'     },
          { href: '/admin/eliminatorias/ranking',       label: '🏆 Ranking KO',         desc: `${verifiedKO} verificados`  },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:shadow-md transition-shadow">
            <div className="font-bold text-slate-800 text-sm">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-sm">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600 hover:underline">
          ← Volver al admin principal
        </Link>
        <a href="/eliminatorias" target="_blank" className="text-green-600 hover:underline">
          Ver sitio público →
        </a>
      </div>
    </div>
  )
}
