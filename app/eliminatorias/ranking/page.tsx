import { prisma } from '@/lib/prisma'

async function getRanking() {
  const snapshots = await prisma.kORankingSnapshot.findMany({
    include: { participant: { include: { payment: true } } },
    orderBy: [
      { totalPoints: 'desc' }, { classifiedCorrect: 'desc' },
      { exactScores: 'desc' }, { penaltyBonus: 'desc' },
    ],
  })
  return snapshots.filter(s => s.participant.payment?.paymentStatus === 'VERIFIED')
}

export const revalidate = 60

export default async function KORankingPage() {
  const ranking = await getRanking()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-slate-800">Ranking — Eliminatorias</h1>
        <p className="text-sm text-slate-500">{ranking.length} participantes verificados</p>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-600">
        <span>🏆 Clas. <strong>2 pts</strong></span>
        <span className="text-slate-200">·</span>
        <span>🎯 Exacto <strong>+2</strong></span>
        <span className="text-slate-200">·</span>
        <span>⭐ Penales <strong>+1</strong></span>
        <span className="text-slate-200">·</span>
        <span>Máx. <strong>5 pts</strong></span>
      </div>

      {ranking.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-2">🏆</div>
          <p>El ranking se publicará cuando haya partidos terminados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((snap, idx) => {
            const pos  = idx + 1
            const prev = snap.previousPosition
            const move = prev != null ? prev - pos : 0
            return (
              <div key={snap.id} className={`bg-white rounded-2xl border shadow-sm px-4 py-3 flex items-center gap-3 ${pos <= 3 ? 'border-yellow-200' : 'border-slate-100'}`}>
                {/* Posición */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                  pos === 1 ? 'bg-yellow-400 text-yellow-900' :
                  pos === 2 ? 'bg-slate-300 text-slate-700' :
                  pos === 3 ? 'bg-amber-600 text-white' :
                  'bg-slate-100 text-slate-600'
                }`}>{pos}</div>

                {/* Nombre y stats */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{snap.participant.fullName}</div>
                  <div className="text-xs text-slate-400">{snap.participant.city ?? ''}</div>
                  <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                    <span>🏆 {snap.classifiedCorrect}</span>
                    <span>🎯 {snap.exactScores}</span>
                    <span>⭐ {snap.penaltyBonus}</span>
                    <span>⚽ {snap.playedMatches}</span>
                  </div>
                </div>

                {/* Puntos y movimiento */}
                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold text-xl text-slate-800">{snap.totalPoints}</div>
                  <div className="text-xs text-slate-400">pts</div>
                  {move !== 0 && (
                    <div className={`text-xs font-bold ${move > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {move > 0 ? `▲${move}` : `▼${Math.abs(move)}`}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
