import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [participants, payments, settings] = await Promise.all([
    prisma.participant.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.payment.findMany({
      where: { paymentStatus: 'IN_REVIEW' },
      include: { participant: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.setting.findFirst(),
  ])

  const totalParticipants = await prisma.participant.count()
  const completeParticipants = await prisma.participant.count({ where: { isComplete: true } })
  const verifiedPayments = await prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } })
  const pendingReview = await prisma.payment.count({ where: { paymentStatus: 'IN_REVIEW' } })

  const entryPrice = settings?.entryPriceUsd ?? 20
  const totalRaisedUsd = verifiedPayments * entryPrice

  const firstPrizePct = settings?.firstPrizePercent ?? 50
  const secondPrizePct = settings?.secondPrizePercent ?? 30
  const orgPct = settings?.organizationPercent ?? 20

  const firstPrize = (totalRaisedUsd * firstPrizePct) / 100
  const secondPrize = (totalRaisedUsd * secondPrizePct) / 100

  const recentRegistrations = participants.slice(0, 10)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-3xl font-bold text-green-600">{totalParticipants}</div>
          <div className="text-sm text-slate-500 mt-1">Total participantes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-3xl font-bold text-blue-600">{completeParticipants}</div>
          <div className="text-sm text-slate-500 mt-1">Quinielas completas</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-3xl font-bold text-yellow-600">{verifiedPayments}</div>
          <div className="text-sm text-slate-500 mt-1">Pagos verificados</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-3xl font-bold text-orange-500">{pendingReview}</div>
          <div className="text-sm text-slate-500 mt-1">En revisión</div>
        </div>
      </div>

      {/* Prize pool */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-5 mb-6 text-white shadow-lg">
        <h2 className="font-bold text-lg mb-3">💰 Premio acumulado</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold">${totalRaisedUsd.toFixed(0)}</div>
            <div className="text-xs opacity-80">Total recaudado</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${firstPrize.toFixed(0)}</div>
            <div className="text-xs opacity-80">1er premio ({firstPrizePct}%)</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${secondPrize.toFixed(0)}</div>
            <div className="text-xs opacity-80">2do premio ({secondPrizePct}%)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending payments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">💳 Pagos en revisión</h2>
            <Link href="/admin/pagos" className="text-xs text-green-600 hover:underline">Ver todos</Link>
          </div>
          {payments.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No hay pagos pendientes</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{p.participant.fullName}</div>
                    <div className="text-xs text-slate-400">Ref: {p.paymentReference ?? 'N/A'}</div>
                  </div>
                  <Link href="/admin/pagos" className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200">
                    Revisar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">👥 Registros recientes</h2>
            <Link href="/admin/participantes" className="text-xs text-green-600 hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentRegistrations.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-700">{p.fullName}</div>
                  <div className="text-xs text-slate-400">{p.participationCode} · {p.city ?? '—'}</div>
                </div>
                <div className="flex items-center gap-1">
                  {p.isComplete && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✓</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    p.payment?.paymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                    p.payment?.paymentStatus === 'IN_REVIEW' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {p.payment?.paymentStatus === 'VERIFIED' ? 'Pagado' :
                     p.payment?.paymentStatus === 'IN_REVIEW' ? 'En revisión' : 'Pendiente'}
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
