import { prisma } from '@/lib/prisma'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

export const revalidate = 60

export default async function KOResultadosPage() {
  const results = await prisma.kOMatchResult.findMany()
  const resultMap = Object.fromEntries(results.map(r => [r.id, r]))

  const finished = KNOCKOUT_MATCHES.filter(m => resultMap[m.id]?.status === 'FINISHED')
  const upcoming = KNOCKOUT_MATCHES.filter(m => !resultMap[m.id] || resultMap[m.id]?.status === 'SCHEDULED')

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-slate-800">Resultados — Eliminatorias</h1>
      </div>

      {finished.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Partidos jugados</h2>
          <div className="space-y-2">
            {finished.map(m => {
              const r = resultMap[m.id]!
              return (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
                  <div className="text-xs text-slate-400 mb-2">{m.date} · {m.displayTime} VET · {m.city}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-right">
                      <div className="text-xl">{m.home.flag ?? '🏳️'}</div>
                      <div className="text-xs font-bold">{m.home.name ?? m.home.placeholder}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-extrabold text-2xl text-slate-800">{r.homeGoals} – {r.awayGoals}</div>
                      {r.penaltyWinner && (
                        <div className="text-xs text-slate-500">
                          Penales: {r.penaltyWinner === 'home' ? (m.home.name ?? 'Local') : (m.away.name ?? 'Visitante')}
                        </div>
                      )}
                      <div className="text-xs text-green-600 font-semibold mt-0.5">Final</div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">{m.away.flag ?? '🏳️'}</div>
                      <div className="text-xs font-bold">{m.away.name ?? m.away.placeholder}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Próximos partidos</h2>
          <div className="space-y-2">
            {upcoming.slice(0, 8).map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
                <div className="text-xs text-slate-400 mb-1.5">{m.date} · {m.displayTime} VET · {m.city}</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-right">
                    <div className="text-xl">{m.home.flag ?? '🏳️'}</div>
                    <div className="text-xs font-bold">{m.home.name ?? m.home.placeholder}</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-slate-300 font-bold text-lg">vs</div>
                    <div className="text-xs text-slate-400">{m.stageLabel}</div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xl">{m.away.flag ?? '🏳️'}</div>
                    <div className="text-xs font-bold">{m.away.name ?? m.away.placeholder}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
