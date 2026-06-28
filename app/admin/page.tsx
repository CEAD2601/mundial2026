import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { calculatePrizePool, DEFAULT_PRIZE_SETTINGS, fmtVes } from '@/lib/prizes'
import { REGISTRATION_DEADLINE, isRegistrationOpen } from '@/lib/deadline'

export const dynamic = 'force-dynamic'

type Phase = 'group_stage' | 'knockout_round_32' | 'knockout_round_16_to_final'

// ── FASE DE GRUPOS (histórico) ────────────────────────────────────────────────
async function DashboardGrupos() {
  const [
    totalParticipants, completeParticipants,
    verifiedPayments, pendingReview, rejectedPayments, pendingPayments,
    settings, recentPayments, recentRegistrations,
    finishedMatches, totalMatches, topRanking,
  ] = await Promise.all([
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

  const pool = calculatePrizePool({
    verifiedPaymentsCount: verifiedPayments,
    entryPriceUsd:       settings?.entryPriceUsd       ?? DEFAULT_PRIZE_SETTINGS.entryPriceUsd,
    fixedExchangeRate:   settings?.fixedExchangeRate    ?? DEFAULT_PRIZE_SETTINGS.fixedExchangeRate,
    firstPrizePercent:   settings?.firstPrizePercent    ?? DEFAULT_PRIZE_SETTINGS.firstPrizePercent,
    secondPrizePercent:  settings?.secondPrizePercent   ?? DEFAULT_PRIZE_SETTINGS.secondPrizePercent,
    organizationPercent: settings?.organizationPercent  ?? DEFAULT_PRIZE_SETTINGS.organizationPercent,
  })

  const fixedRate = pool.fixedExchangeRate
  const entryVes  = Math.round(pool.entryPriceUsd * fixedRate)
  const leader    = topRanking[0]

  return (
    <div className="p-4 sm:p-6">
      {/* Histórico banner */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 mb-5 flex items-center gap-3 text-sm">
        <span className="text-xl shrink-0">🔒</span>
        <div>
          <span className="font-semibold text-slate-700">Fase de Grupos — Histórico</span>
          <span className="ml-2 text-xs text-slate-500">Quiniela finalizada. Solo lectura.</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard · Fase de Grupos</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { val: totalParticipants,    label: 'Participantes',       color: 'text-green-600',   icon: '👥' },
          { val: completeParticipants, label: 'Quinielas completas', color: 'text-blue-600',    icon: '📋' },
          { val: verifiedPayments,     label: 'Pagos verificados',   color: 'text-emerald-600', icon: '✅' },
          { val: pendingReview,        label: 'En revisión',         color: 'text-orange-500',  icon: '⏳' },
          { val: pendingPayments,      label: 'Sin pago',            color: 'text-slate-500',   icon: '❌' },
          { val: rejectedPayments,     label: 'Rechazados',          color: 'text-red-500',     icon: '🚫' },
          { val: finishedMatches,      label: 'Partidos jugados',    color: 'text-purple-600',  icon: '⚽' },
          { val: totalMatches,         label: 'Total partidos',      color: 'text-indigo-500',  icon: '📅' },
        ].map(({ val, label, color, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-slate-100">
            <div className="text-lg sm:text-xl mb-0.5">{icon}</div>
            <div className={`text-2xl sm:text-3xl font-bold ${color} leading-tight`}>{val}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-snug">{label}</div>
          </div>
        ))}
      </div>

      {/* Prize pool */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 mb-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">💰 Pozo · Fase de Grupos</h2>
          <div className="text-right text-sm">
            <div className="text-yellow-100">Tasa fija:</div>
            <div className="font-bold">{fixedRate} Bs/USD</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          {[
            { label: 'Total recaudado', usd: pool.totalPoolUsd,     ves: pool.totalPoolVes,              badge: null   },
            { label: `1er premio (${pool.firstPrizePercent}%)`,   usd: pool.firstPrizeUsd,    ves: pool.firstPrizeUsd * fixedRate,    badge: '🥇' },
            { label: `2do premio (${pool.secondPrizePercent}%)`,  usd: pool.secondPrizeUsd,   ves: pool.secondPrizeUsd * fixedRate,   badge: '🥈' },
            { label: `Organización (${pool.organizationPercent}%)`, usd: pool.organizationUsd, ves: pool.organizationUsd * fixedRate, badge: '🏛️' },
          ].map((row) => (
            <div key={row.label} className="bg-white/20 rounded-xl p-3">
              <div className="text-xs text-yellow-100 mb-1">{row.badge} {row.label}</div>
              <div className="text-xl font-extrabold">${row.usd.toFixed(0)}</div>
              <div className="text-xs text-yellow-100">{fmtVes(row.ves)} Bs</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-yellow-100 text-center">
          Entrada: ${pool.entryPriceUsd} USD / {fmtVes(entryVes)} Bs · {verifiedPayments} pagos verificados
        </div>
      </div>

      {leader && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 mb-5 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-xs text-purple-200">Líder final · Fase de Grupos</div>
              <div className="font-bold text-lg">{leader.participant.fullName}</div>
              <div className="text-sm text-purple-200">{leader.totalPoints} pts · {leader.exactScores} exactos · {leader.correctResults} acertados</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">⏳ Pagos en revisión</h2>
            <Link href="/admin/pagos?phase=group_stage" className="text-xs text-green-600 hover:underline">Ver todos →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No hay pagos pendientes</p>
          ) : (
            <div className="space-y-2">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{p.participant.fullName}</div>
                    <div className="text-xs text-slate-400">Ref: {p.paymentReference ?? 'N/A'} · {p.senderBank ?? '—'}</div>
                    <div className="text-xs text-slate-500">${p.amountUsd} USD / {p.amountVes ? fmtVes(p.amountVes) + ' Bs' : '—'}</div>
                  </div>
                  <Link href="/admin/pagos?phase=group_stage" className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 shrink-0 ml-2">
                    Revisar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">👥 Registros recientes</h2>
            <Link href="/admin/participantes?phase=group_stage" className="text-xs text-green-600 hover:underline">Ver todos →</Link>
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

// ── DIECISEISAVOS (activa) ───────────────────────────────────────────────────
function DashboardDieciseisavos() {
  // Datos reales de Dieciseisavos estarán en DB cuando se implementen inscripciones.
  // Por ahora: dashboard preparado con estado actual del prototipo.
  const ENTRY_USD   = 20
  const FIXED_RATE  = 730
  const ENTRY_VES   = ENTRY_USD * FIXED_RATE

  // Placeholder stats — se leerán de DB cuando haya datos reales
  const verifiedKO  = 0
  const pendingKO   = 0
  const totalPool   = verifiedKO * ENTRY_USD
  const prize1      = totalPool * 0.65
  const prize2      = totalPool * 0.20
  const orgFee      = totalPool * 0.15

  return (
    <div className="p-4 sm:p-6">
      {/* Active banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 flex items-center gap-3 text-sm">
        <span className="text-xl shrink-0">🟢</span>
        <div>
          <span className="font-semibold text-green-800">Dieciseisavos — Quiniela Activa</span>
          <span className="ml-2 text-xs text-green-600">Inscripciones y pagos independientes de Fase de Grupos.</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard · Dieciseisavos</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { val: 0, label: 'Inscritos',           color: 'text-green-600',   icon: '👥' },
          { val: 0, label: 'Quinielas completas', color: 'text-blue-600',    icon: '📋' },
          { val: verifiedKO, label: 'Pagos verificados',   color: 'text-emerald-600', icon: '✅' },
          { val: pendingKO,  label: 'Pagos pendientes',    color: 'text-orange-500',  icon: '⏳' },
          { val: 0, label: 'Sin pago',            color: 'text-slate-500',   icon: '❌' },
          { val: 0, label: 'Rechazados',          color: 'text-red-500',     icon: '🚫' },
          { val: 16, label: 'Partidos',           color: 'text-purple-600',  icon: '⚽' },
          { val: 0, label: 'Jugados',             color: 'text-indigo-500',  icon: '📅' },
        ].map(({ val, label, color, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-slate-100">
            <div className="text-lg sm:text-xl mb-0.5">{icon}</div>
            <div className={`text-2xl sm:text-3xl font-bold ${color} leading-tight`}>{val}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-snug">{label}</div>
          </div>
        ))}
      </div>

      {/* Prize pool */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 mb-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">💰 Pozo · Dieciseisavos</h2>
          <div className="text-right text-sm">
            <div className="text-green-100">Tasa fija:</div>
            <div className="font-bold">{FIXED_RATE} Bs/USD</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          {[
            { label: 'Total recaudado', usd: totalPool, ves: totalPool * FIXED_RATE,   badge: null   },
            { label: '1er premio (65%)',   usd: prize1,     ves: prize1 * FIXED_RATE,  badge: '🥇' },
            { label: '2do premio (20%)',   usd: prize2,     ves: prize2 * FIXED_RATE,  badge: '🥈' },
            { label: 'Organización (15%)', usd: orgFee,     ves: orgFee * FIXED_RATE,  badge: '🏛️' },
          ].map((row) => (
            <div key={row.label} className="bg-white/20 rounded-xl p-3">
              <div className="text-xs text-green-100 mb-1">{row.badge} {row.label}</div>
              <div className="text-xl font-extrabold">${row.usd.toFixed(0)}</div>
              <div className="text-xs text-green-100">{fmtVes(row.ves)} Bs</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-green-100 text-center">
          Entrada: ${ENTRY_USD} USD / {fmtVes(ENTRY_VES)} Bs · {verifiedKO} pagos verificados
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-bold text-slate-700 mb-3">⚙️ Configuración · Dieciseisavos</h2>
          <div className="space-y-2 text-sm">
            {[
              ['Inscripciones', 'Abiertas'],
              ['Monto',         `$${ENTRY_USD} USD / ${fmtVes(ENTRY_VES)} Bs`],
              ['Tasa fija',     `${FIXED_RATE} Bs/USD`],
              ['1er premio',    '65% del pozo'],
              ['2do premio',    '20% del pozo'],
              ['Organización',  '15% del pozo'],
              ['Partidos',      '16 (Dieciseisavos)'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">{k}</span>
                <span className="font-semibold text-slate-700">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-bold text-slate-700 mb-3">📋 Acciones rápidas</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/participantes?phase=knockout_round_32', label: 'Ver participantes Dieciseisavos', icon: '👥' },
              { href: '/admin/pagos?phase=knockout_round_32',         label: 'Verificar pagos Dieciseisavos',  icon: '💳' },
              { href: '/admin/ranking?phase=knockout_round_32',       label: 'Ver ranking Dieciseisavos',      icon: '🏆' },
              { href: '/admin/resultados?phase=knockout_round_32',    label: 'Resultados Dieciseisavos',       icon: '⚽' },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 text-sm text-slate-700 hover:text-green-800 transition-colors">
                <span>{icon}</span>{label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── OCTAVOS A FINAL (próximamente) ───────────────────────────────────────────
function DashboardOctavos() {
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 flex items-center gap-3 text-sm">
        <span className="text-xl shrink-0">⏳</span>
        <div>
          <span className="font-semibold text-blue-800">Octavos a Final — Próximamente</span>
          <span className="ml-2 text-xs text-blue-600">Esta quiniela se activará cuando finalicen los Dieciseisavos.</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard · Octavos a Final</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center mb-5">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-slate-700 font-extrabold text-xl mb-2">Quiniela Octavos a Final</p>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Esta quiniela todavía no está abierta. Se activará cuando finalicen los Dieciseisavos y se configure la apertura desde Configuración.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '👥', title: 'Inscripciones',    desc: 'Nuevas inscripciones independientes. Se reutilizan datos de persona si la cédula ya existe.' },
          { icon: '💳', title: 'Pagos',            desc: 'Nuevo pago independiente. Los pagos de etapas anteriores no cuentan aquí.' },
          { icon: '📋', title: 'Quinielas',        desc: 'Pronósticos desde Cuartos de Final hasta la Gran Final.' },
          { icon: '🏆', title: 'Ranking',          desc: 'Ranking propio. No se mezcla con Dieciseisavos ni Fase de Grupos.' },
          { icon: '💰', title: 'Pozo',             desc: 'Pozo independiente calculado solo con pagos verificados de esta etapa.' },
          { icon: '⚽', title: 'Resultados',       desc: 'Partidos desde Octavos hasta la Final.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl border border-slate-100 p-4 opacity-60">
            <div className="flex items-center gap-2 mb-1">
              <span>{icon}</span>
              <span className="font-semibold text-slate-700">{title}</span>
              <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">Próximamente</span>
            </div>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ENTRY POINT ──────────────────────────────────────────────────────────────
interface Props {
  searchParams: Promise<{ phase?: string }>
}

export default async function AdminDashboard({ searchParams }: Props) {
  const { phase } = await searchParams
  const p = (phase ?? 'group_stage') as Phase

  if (p === 'knockout_round_32')          return <DashboardDieciseisavos />
  if (p === 'knockout_round_16_to_final') return <DashboardOctavos />
  return <DashboardGrupos />
}
