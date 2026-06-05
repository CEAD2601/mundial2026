import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [totalParticipants, completeParticipants, verifiedPayments, pendingReview, rejectedPayments, pendingPayments, settings, recentPayments, recentRegistrations, finishedMatches, totalMatches, topRanking] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { isComplete: true } }),
    prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } }),
    prisma.payment.count({ where: { paymentStatus: 'IN_REVIEW' } }),
    prisma.payment.count({ where: { paymentStatus: 'REJECTED' } }),
    prisma.payment.count({ where: { paymentStatus: 'PENDING' } }),
    prisma.setting.findFirst(),
    prisma.payment.findMany({
      where: { paymentStatus: 'IN_REVIEW' },
      include: { participant: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.participant.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.match.count({ where: { status: 'FINISHED' } }),
    prisma.match.count(),
    prisma.rankingSnapshot.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 1,
      include: { participant: true },
    }),
  ])

  const entryUsd = settings?.entryPriceUsd ?? 20
  const fixedRate = settings?.fixedExchangeRate ?? 700
  const entryVes = Math.round(entryUsd * fixedRate)

  const totalRaisedUsd = verifiedPayments * entryUsd
  const totalRaisedVes = totalRaisedUsd * fixedRate

  const p1Pct = settings?.firstPrizePercent ?? 65
  const p2Pct = settings?.secondPrizePercent ?? 20
  const orgPct = settings?.organizationPercent ?? 15

  const prize1Usd = (totalRaisedUsd * p1Pct) / 100
  const prize2Usd = (totalRaisedUsd * p2Pct) / 100
  const orgUsd = (totalRaisedUsd * orgPct) / 100

  const leader = topRanking[0]

  const fmtVes = (n: number) => n.toLocaleString('es-VE', { maximumFractionDigits: 0 })

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { val: totalParticipants, label: 'Participantes', color: 'text-green-600', icon: '👥' },
          { val: completeParticipants, label: 'Quinielas completas', color: 'text-blue-600', icon: '📋' },
          { val: verifiedPayments, label: 'Pagos verificados', color: 'text-emerald-600', icon: '✅' },
          { val: pendingReview, label: 'En revisión', color: 'text-orange-500', icon: '⏳' },
          { val: pendingPayments, label: 'Sin pago', color: 'text-slate-500', icon: '❌' },
          { val: rejectedPayments, label: 'Rechazados', color: 'text-red-500', icon: '🚫' },
          { val: finishedMatches, label: 'Partidos jugados', color: 'text-purple-600', icon: '⚽' },
          { val: totalMatches, label: 'Total partidos', color: 'text-indigo-500', icon: '📅' },
        ].map(({ val, label, color, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span>{icon}</span>
              <span className={`text-2xl font-bold ${color}`}>{val}</span>
            </div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Prize pool */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 mb-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">💰 Pozo acumulado</h2>
          <div className="text-right text-sm">
            <div className="text-yellow-100">Tasa fija:</div>
            <div className="font-bold">{fixedRate} Bs/USD</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { label: 'Total recaudado', usd: totalRaisedUsd, ves: totalRaisedVes, badge: null },
            { label: `1er premio (${p1Pct}%)`, usd: prize1Usd, ves: prize1Usd * fixedRate, badge: '🥇' },
            { label: `2do premio (${p2Pct}%)`, usd: prize2Usd, ves: prize2Usd * fixedRate, badge: '🥈' },
            { label: `Organización (${orgPct}%)`, usd: orgUsd, ves: orgUsd * fixedRate, badge: '🏛️' },
          ].map((row) => (
            <div key={row.label} className="bg-white/20 rounded-xl p-3">
              <div className="text-xs text-yellow-100 mb-1">{row.badge} {row.label}</div>
              <div className="text-xl font-extrabold">${row.usd.toFixed(0)}</div>
              <div className="text-xs text-yellow-100">{fmtVes(row.ves)} Bs</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-yellow-100 text-center">
          Entrada: ${entryUsd} USD / {fmtVes(entryVes)} Bs · {verifiedPayments} pagos verificados
        </div>
      </div>

      {/* Leader + quick info */}
      {leader && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 mb-5 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-xs text-purple-200">Líder actual del ranking</div>
              <div className="font-bold text-lg">{leader.participant.fullName}</div>
              <div className="text-sm text-purple-200">{leader.totalPoints} pts · {leader.exactScores} exactos · {leader.correctResults} acertados</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">⏳ Pagos en revisión</h2>
            <Link href="/admin/pagos" className="text-xs text-green-600 hover:underline">Ver todos →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No hay pagos pendientes</p>
          ) : (
            <div className="space-y-2">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{p.participant.fullName}</div>
                    <div className="text-xs text-slate-400">
                      Ref: {p.paymentReference ?? 'N/A'} · {p.senderBank ?? '—'}
                    </div>
                    <div className="text-xs text-slate-500">${p.amountUsd} USD / {p.amountVes ? fmtVes(p.amountVes) + ' Bs' : '—'}</div>
                  </div>
                  <Link href="/admin/pagos" className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 shrink-0 ml-2">
                    Revisar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">👥 Registros recientes</h2>
            <Link href="/admin/participantes" className="text-xs text-green-600 hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-2">
            {recentRegistrations.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-700">{p.fullName}</div>
                  <div className="text-xs text-slate-400">{p.participationCode}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {p.isComplete && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">✓ Completa</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    p.payment?.paymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                    p.payment?.paymentStatus === 'IN_REVIEW' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {p.payment?.paymentStatus === 'VERIFIED' ? 'Pagado' :
                     p.payment?.paymentStatus === 'IN_REVIEW' ? 'En revisión' : 'Sin pago'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
