import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'
import { KO_ENTRY_USD, KO_AMOUNT_VES } from '@/lib/ko/utils'

async function getStats() {
  const [total, verified] = await Promise.all([
    prisma.kOParticipant.count(),
    prisma.kOPayment.count({ where: { paymentStatus: 'VERIFIED' } }),
  ])
  return { total, verified, pool: verified * KO_ENTRY_USD }
}

export default async function EliminatoriasPage() {
  const stats   = await getStats()
  const r32     = KNOCKOUT_MATCHES.filter(m => m.stage === 'R32')
  const nextMatches = r32.filter(m => m.isOpenForPredictions).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl text-white px-6 py-8 text-center shadow-xl">
        <div className="text-4xl mb-2">🏆</div>
        <h1 className="text-2xl font-extrabold mb-1">Quiniela Eliminatorias</h1>
        <p className="text-green-200 text-sm mb-4">Mundial 2026 · Dieciseisavos de Final</p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div>
            <div className="text-2xl font-extrabold">{stats.verified}</div>
            <div className="text-xs text-green-200">participantes</div>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <div className="text-2xl font-extrabold">${stats.pool}</div>
            <div className="text-xs text-green-200">en premios</div>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <div className="text-2xl font-extrabold">${KO_ENTRY_USD}</div>
            <div className="text-xs text-green-200">inscripción</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/eliminatorias/registro"
            className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold py-3 px-6 rounded-xl shadow-lg transition-all text-base"
          >
            Inscribirme ahora →
          </Link>
          <Link
            href="/eliminatorias/mi-quiniela"
            className="bg-white/15 hover:bg-white/25 text-white font-bold py-3 px-6 rounded-xl transition-all text-base border border-white/20"
          >
            Mi quiniela
          </Link>
        </div>
      </div>

      {/* Sistema de puntos */}
      <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
        <h2 className="font-extrabold text-slate-800 mb-3">Sistema de puntos — Eliminatorias</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl">🏆</span>
            <div><span className="font-bold text-green-700">+2 pts</span> — Clasificado correcto (acertás quién avanza)</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div><span className="font-bold text-blue-700">+2 pts</span> — Marcador exacto del partido (requiere clasificado correcto)</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">⭐</span>
            <div><span className="font-bold text-amber-600">+1 pt</span> — Bonus penales: predices empate y aciertas quién avanza por penales</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div><span className="font-bold text-slate-500">0 pts</span> — Clasificado incorrecto</div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">El marcador no incluye penales · Máx. 5 pts por partido</p>
      </div>

      {/* Próximos partidos */}
      {nextMatches.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
          <h2 className="font-extrabold text-slate-800 mb-3">Próximos partidos</h2>
          <div className="space-y-2">
            {nextMatches.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{m.home.flag ?? '🏳️'} {m.home.name ?? m.home.placeholder}</span>
                  <span className="text-slate-400 text-xs">vs</span>
                  <span>{m.away.flag ?? '🏳️'} {m.away.name ?? m.away.placeholder}</span>
                </div>
                <div className="text-xs text-slate-400 text-right">
                  <div>{m.date}</div>
                  <div>{m.displayTime}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/eliminatorias/mi-quiniela" className="block mt-3 text-center text-sm text-green-700 font-semibold hover:underline">
            Ver mi quiniela completa →
          </Link>
        </div>
      )}

      {/* Precio */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
        <h2 className="font-extrabold text-blue-900 mb-2">Costo de inscripción</h2>
        <div className="flex gap-6 text-sm">
          <div>
            <div className="font-extrabold text-blue-800 text-lg">${KO_ENTRY_USD} USD</div>
            <div className="text-blue-600">Pago Móvil Banesco</div>
            <div className="text-blue-500 text-xs">Bs. {KO_AMOUNT_VES.toLocaleString('es-VE')} · tasa fija 730</div>
          </div>
          <div>
            <div className="font-extrabold text-blue-800 text-lg">${KO_ENTRY_USD} USD</div>
            <div className="text-blue-600">Zelle</div>
          </div>
        </div>
        <div className="text-xs text-blue-400 mt-2">Premios: 65% al 1.º · 20% al 2.º · 15% organización</div>
      </div>

      {/* Links */}
      <div className="text-center text-sm text-slate-500 space-y-1 pb-6">
        <div>
          <Link href="/ranking" className="hover:underline text-slate-400">Ver ranking Fase de Grupos (histórico)</Link>
        </div>
        <div>
          <Link href="/admin" className="hover:underline text-slate-300 text-xs">Admin</Link>
        </div>
      </div>
    </div>
  )
}
