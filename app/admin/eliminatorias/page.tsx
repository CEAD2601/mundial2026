import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { KO_ENTRY_USD } from '@/lib/ko/utils'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

async function getStats() {
  const [total, verified, inReview, finished] = await Promise.all([
    prisma.kOParticipant.count(),
    prisma.kOPayment.count({ where: { paymentStatus: 'VERIFIED' } }),
    prisma.kOPayment.count({ where: { paymentStatus: 'IN_REVIEW' } }),
    prisma.kOMatchResult.count({ where: { status: 'FINISHED' } }),
  ])
  return { total, verified, inReview, finished, pool: verified * KO_ENTRY_USD }
}

export default async function AdminKOPage() {
  const s     = await getStats()
  const total = KNOCKOUT_MATCHES.filter(m => m.stage === 'R32').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Eliminatorias 2026</h1>
        <p className="text-slate-500 text-sm">Panel de administración — Dieciseisavos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Inscritos',    value: s.total,    color: 'blue'   },
          { label: 'Verificados',  value: s.verified, color: 'green'  },
          { label: 'En revisión',  value: s.inReview, color: 'amber'  },
          { label: 'Premio total', value: `$${s.pool}`, color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-2xl px-4 py-4`}>
            <div className={`text-2xl font-extrabold text-${color}-700`}>{value}</div>
            <div className={`text-xs text-${color}-500 mt-0.5`}>{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600">
        Partidos terminados: <strong>{s.finished}</strong> / {total} (R32)
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { href: '/admin/eliminatorias/pagos',          label: '💳 Verificar pagos',       desc: `${s.inReview} en revisión` },
          { href: '/admin/eliminatorias/participantes',  label: '👥 Participantes',          desc: `${s.total} inscritos` },
          { href: '/admin/eliminatorias/resultados',     label: '⚽ Ingresar resultados',    desc: `${s.finished} terminados` },
          { href: '/admin/eliminatorias/ranking',        label: '🏆 Ranking KO',            desc: `${s.verified} verificados` },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 hover:shadow-md transition-shadow">
            <div className="font-bold text-slate-800">{label}</div>
            <div className="text-sm text-slate-500 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>

      {/* Link back */}
      <div className="pt-2 border-t border-slate-100">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
          ← Volver al admin principal (Fase de Grupos)
        </Link>
      </div>
    </div>
  )
}
