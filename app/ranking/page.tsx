import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface RankingEntry {
  position: number
  previousPosition: number | null
  movement: number
  participantId: string
  fullName: string
  city: string | null
  totalPoints: number
  exactScores: number
  correctResults: number
  wrongPredictions: number
  pendingPredictions: number
  playedMatches: number
  totalGoalDiffError: number
  effectivenessPercent: number
  paymentStatus: string
}

async function getRanking(): Promise<RankingEntry[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/ranking`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.ranking ?? []
  } catch {
    return []
  }
}

function MovementIcon({ movement }: { movement: number }) {
  if (movement > 0) return <span className="text-green-500 text-xs">↑{movement}</span>
  if (movement < 0) return <span className="text-red-500 text-xs">↓{Math.abs(movement)}</span>
  return <span className="text-slate-400 text-xs">—</span>
}

export default async function RankingPage() {
  const ranking = await getRanking()
  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3)

  const podiumOrder = [
    top3[1] ?? null, // 2nd (left)
    top3[0] ?? null, // 1st (center, tallest)
    top3[2] ?? null, // 3rd (right)
  ]
  const podiumMedals = ['🥈', '🥇', '🥉']
  const podiumHeights = ['h-20', 'h-28', 'h-16']

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">🏆 Ranking</h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {ranking.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-slate-500">El ranking estará disponible cuando comiencen los partidos</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <div className="mb-8">
                <div className="flex items-end justify-center gap-3">
                  {podiumOrder.map((entry, i) => {
                    if (!entry) return <div key={i} className="w-24" />
                    return (
                      <div key={entry.participantId} className="flex flex-col items-center">
                        <div className="text-2xl mb-1">{podiumMedals[i]}</div>
                        <div className="text-center mb-2">
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {entry.fullName.split(' ')[0]}
                          </p>
                          <p className="text-xs text-slate-500">{entry.totalPoints} pts</p>
                          <p className="text-xs text-green-600">🎯 {entry.exactScores} exactos</p>
                        </div>
                        <div className={`${podiumHeights[i]} w-24 rounded-t-xl flex items-center justify-center text-white font-bold text-lg ${
                          i === 1 ? 'bg-yellow-500' : i === 0 ? 'bg-slate-400' : 'bg-orange-400'
                        }`}>
                          {i === 1 ? 1 : i === 0 ? 2 : 3}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Scoring legend */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 mb-4 flex gap-4 text-xs text-slate-600">
              <span>🎯 <strong>3 pts</strong> marcador exacto</span>
              <span>✅ <strong>1 pt</strong> resultado correcto</span>
              <span>❌ <strong>0 pts</strong> incorrecto</span>
            </div>

            {/* Full table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 grid grid-cols-12 text-xs font-medium text-slate-400">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Participante</div>
                <div className="col-span-2 text-center">Pts</div>
                <div className="col-span-2 text-center">🎯 Exactos</div>
                <div className="col-span-2 text-center">✅ Result.</div>
                <div className="col-span-1 text-center">Δ⚽</div>
              </div>
              {ranking.map((entry) => (
                <div
                  key={entry.participantId}
                  className={`px-3 py-3 grid grid-cols-12 items-center border-b border-slate-50 last:border-0 ${
                    entry.position <= 3 ? 'bg-yellow-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="col-span-1 text-center">
                    <span className="font-bold text-slate-700 text-sm">
                      {entry.position <= 3 ? ['🥇','🥈','🥉'][entry.position - 1] : entry.position}
                    </span>
                    <div className="mt-0.5">
                      <MovementIcon movement={entry.movement} />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{entry.fullName}</p>
                    {entry.city && <p className="text-xs text-slate-400">{entry.city}</p>}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-bold text-green-600 text-base">{entry.totalPoints}</span>
                  </div>
                  <div className="col-span-2 text-center text-sm text-slate-600">{entry.exactScores}</div>
                  <div className="col-span-2 text-center text-sm text-slate-600">{entry.correctResults}</div>
                  <div className="col-span-1 text-center text-xs text-slate-400">{entry.totalGoalDiffError}</div>
                </div>
              ))}
            </div>

            {/* Tiebreaker note */}
            <div className="mt-4 bg-slate-100 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium mb-1">Criterios de desempate:</p>
              <ol className="text-xs text-slate-400 space-y-0.5 list-decimal list-inside">
                <li>Mayor cantidad de marcadores exactos (🎯)</li>
                <li>Mayor cantidad de resultados correctos (✅)</li>
                <li>Menor error acumulado de goles (Δ⚽)</li>
              </ol>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              {ranking.length} participante{ranking.length !== 1 ? 's' : ''} en el ranking
            </p>
          </>
        )}
      </div>
    </div>
  )
}
