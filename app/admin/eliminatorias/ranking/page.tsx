import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 30

export default async function AdminKORankingPage() {
  const snapshots = await prisma.kORankingSnapshot.findMany({
    include: { participant: { include: { payment: true } } },
    orderBy: [
      { totalPoints: 'desc' }, { classifiedCorrect: 'desc' },
      { exactScores: 'desc' }, { penaltyBonus: 'desc' },
    ],
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-800">Ranking — Eliminatorias (Admin)</h1>
        <Link href="/admin/eliminatorias" className="text-sm text-slate-400 hover:underline">← Dashboard</Link>
      </div>

      <p className="text-sm text-slate-500">
        Muestra todos los participantes con picks calculados, incluyendo no verificados.
      </p>

      {snapshots.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Sin datos. Ingresa resultados para que aparezca el ranking.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="text-left py-2 px-2">Pos</th>
                <th className="text-left py-2 px-2">Nombre</th>
                <th className="text-center py-2 px-2">Pts</th>
                <th className="text-center py-2 px-2">🏆</th>
                <th className="text-center py-2 px-2">🎯</th>
                <th className="text-center py-2 px-2">⭐</th>
                <th className="text-center py-2 px-2">⚽</th>
                <th className="text-left py-2 px-2">Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {snapshots.map((s, idx) => (
                <tr key={s.id} className={`hover:bg-slate-50 ${s.participant.payment?.paymentStatus !== 'VERIFIED' ? 'opacity-60' : ''}`}>
                  <td className="py-2 px-2 font-bold text-slate-600">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <div className="font-semibold text-slate-800">{s.participant.fullName}</div>
                    <div className="text-xs font-mono text-slate-400">{s.participant.participationCode}</div>
                  </td>
                  <td className="py-2 px-2 text-center font-extrabold text-slate-800">{s.totalPoints}</td>
                  <td className="py-2 px-2 text-center text-slate-600">{s.classifiedCorrect}</td>
                  <td className="py-2 px-2 text-center text-slate-600">{s.exactScores}</td>
                  <td className="py-2 px-2 text-center text-slate-600">{s.penaltyBonus}</td>
                  <td className="py-2 px-2 text-center text-slate-600">{s.playedMatches}</td>
                  <td className="py-2 px-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      s.participant.payment?.paymentStatus === 'VERIFIED'  ? 'bg-green-100 text-green-700' :
                      s.participant.payment?.paymentStatus === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {s.participant.payment?.paymentStatus ?? 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
