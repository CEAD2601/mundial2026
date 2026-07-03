import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HistorialR32Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snapshot = await (prisma as any).kOPhaseSnapshot.findUnique({
    where: { phase: 'R32' },
  }).catch(() => null)

  if (!snapshot) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Sin snapshot de R32</h1>
        <p className="text-slate-500 text-sm mb-6">
          El ranking histórico de Dieciseisavos se guarda automáticamente cuando se hace la transición de fase desde el dashboard principal.
        </p>
        <Link href="/admin/eliminatorias" className="text-blue-600 hover:underline text-sm">
          ← Volver al dashboard
        </Link>
      </div>
    )
  }

  let data: {
    title: string
    finalizedAt: string
    totalParticipants: number
    participants: Array<{
      position: number
      name: string
      code: string
      points: number
      exactScores: number
      classifiedCorrect: number
      paymentStatus: string
    }>
  }

  try {
    data = JSON.parse(snapshot.dataJson)
  } catch {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-red-500">
        Error al leer el snapshot de R32.
      </div>
    )
  }

  const finalDate = new Date(data.finalizedAt).toLocaleDateString('es-VE', {
    timeZone: 'America/Caracas', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏆</span>
          <h1 className="text-2xl font-extrabold text-slate-800">Ranking Histórico · Dieciseisavos</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Cerrado el {finalDate} · {data.totalParticipants} participantes · Fase inmutable
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-800">
        🔒 Este ranking es el histórico final de la fase Dieciseisavos. No cambia aunque se agreguen nuevos resultados.
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase"
          style={{ gridTemplateColumns: '40px 1fr 60px 60px 70px' }}>
          <span>#</span><span>Participante</span><span>Pts</span><span>Exactas</span><span>Aciertos</span>
        </div>

        {data.participants.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">Sin datos en el snapshot</div>
        ) : (
          data.participants.map((p, i) => {
            const pos = p.position || i + 1
            const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : null
            return (
              <div key={p.code} className={`grid px-4 py-2.5 border-b border-slate-100 last:border-b-0 items-center ${
                pos <= 3 ? 'bg-yellow-50/40' : ''
              }`} style={{ gridTemplateColumns: '40px 1fr 60px 60px 70px' }}>
                <span className="font-extrabold text-slate-700 text-sm">
                  {medal ?? `#${pos}`}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.code}</p>
                </div>
                <span className="text-sm font-extrabold text-green-700">{p.points}</span>
                <span className="text-sm text-slate-600">{p.exactScores}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  p.paymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                  p.paymentStatus === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {p.paymentStatus === 'VERIFIED' ? '✅ Verificado' :
                   p.paymentStatus === 'IN_REVIEW' ? 'En revisión' : 'Sin pago'}
                </span>
              </div>
            )
          })
        )}
      </div>

      <div className="flex gap-4 text-sm pt-2 border-t border-slate-100">
        <Link href="/admin/eliminatorias" className="text-slate-400 hover:text-slate-600 hover:underline">
          ← Dashboard R32
        </Link>
        <Link href="/admin/eliminatorias/octavos" className="text-blue-600 hover:underline">
          Dashboard Octavos →
        </Link>
      </div>
    </div>
  )
}
