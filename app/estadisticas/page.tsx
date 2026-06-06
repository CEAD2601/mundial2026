import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EstadisticasPage() {
  const [
    totalParticipants,
    completeParticipants,
    verifiedPayments,
    settings,
    topParticipant,
    totalPredictions,
  ] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { isComplete: true } }),
    prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } }),
    prisma.setting.findFirst(),
    prisma.rankingSnapshot.findFirst({
      orderBy: { totalPoints: 'desc' },
      include: { participant: true },
    }),
    prisma.prediction.count(),
  ])

  const entryPrice = settings?.entryPriceUsd ?? 20
  const totalRaised = verifiedPayments * entryPrice
  const firstPrizePct = settings?.firstPrizePercent ?? 65
  const secondPrizePct = settings?.secondPrizePercent ?? 20
  const firstPrize = (totalRaised * firstPrizePct) / 100
  const secondPrize = (totalRaised * secondPrizePct) / 100

  const stats = [
    { label: 'Total participantes', value: totalParticipants, icon: '👥', color: 'text-blue-600' },
    { label: 'Quinielas completas', value: completeParticipants, icon: '✅', color: 'text-green-600' },
    { label: 'Pagos verificados', value: verifiedPayments, icon: '💳', color: 'text-purple-600' },
    { label: 'Pronósticos realizados', value: totalPredictions.toLocaleString(), icon: '📊', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">📊 Estadísticas</h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-5">
        {/* Participation stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Prize pool */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="font-bold text-lg mb-4">💰 Fondo de premios</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">${totalRaised}</div>
              <div className="text-xs opacity-80 mt-1">Total recaudado</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${firstPrize.toFixed(0)}</div>
              <div className="text-xs opacity-80 mt-1">🥇 1er premio</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${secondPrize.toFixed(0)}</div>
              <div className="text-xs opacity-80 mt-1">🥈 2do premio</div>
            </div>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (verifiedPayments / Math.max(totalParticipants, 1)) * 100)}%` }}
            />
          </div>
          <p className="text-xs opacity-70 mt-1 text-center">
            {verifiedPayments} de {totalParticipants} pagos verificados
          </p>
        </div>

        {/* Leader */}
        {topParticipant && topParticipant.totalPoints > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-5">
            <h2 className="font-bold text-slate-700 mb-3">🏆 Líder actual</h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl">👑</div>
              <div className="flex-1">
                <div className="font-bold text-slate-800 text-lg">{topParticipant.participant.fullName}</div>
                <div className="text-sm text-slate-500">{topParticipant.participant.city ?? '—'}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{topParticipant.totalPoints}</div>
                <div className="text-xs text-slate-400">puntos</div>
              </div>
            </div>
          </div>
        )}

        {/* Entry price */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-3">📋 Información</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Precio de entrada</span>
              <span className="font-semibold">${entryPrice} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">1er premio</span>
              <span className="font-semibold text-yellow-600">{firstPrizePct}% del fondo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">2do premio</span>
              <span className="font-semibold text-slate-600">{secondPrizePct}% del fondo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sistema de puntos</span>
              <span className="font-semibold">3 pts por acierto</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/ranking" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors">
            Ver ranking
          </Link>
          <Link href="/resultados" className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl text-center text-sm hover:bg-slate-50">
            Ver resultados
          </Link>
        </div>
      </div>
    </div>
  )
}
