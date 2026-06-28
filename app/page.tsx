'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react'

/* ── AnimatedNumber ─────────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)
  useEffect(() => {
    if (animated.current) return
    setVal(0)
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      animated.current = true
      let start = 0
      const step = Math.max(target / 40, 1)
      const id = setInterval(() => {
        start = Math.min(start + step, target)
        setVal(Math.round(start))
        if (start >= target) clearInterval(id)
      }, 20)
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString('es-VE')}{suffix}</span>
}

/* ── FAQ ────────────────────────────────────────────────────────── */
const faqs = [
  { q: '¿Cómo funciona la quiniela de Eliminatorias?',
    a: 'Predices el marcador de cada partido de eliminación directa (Dieciseisavos, Octavos, Cuartos, Semis, Final). En eliminatorias el marcador es el del tiempo reglamentario — no cuenta prórroga ni penales para los goles, pero si predices empate debes elegir quién avanza por penales.' },
  { q: '¿Cuánto cuesta participar?',
    a: 'La inscripción es de 20 USD. Pagas por Pago Móvil Banesco (14.600 Bs a tasa fija 730 Bs/USD) o por Zelle (20 USD).' },
  { q: '¿Cómo funciona la puntuación?',
    a: '⚽ Clasificado correcto: +2 pts. 🎯 Marcador exacto (requiere clasificado correcto): +2 pts adicionales. ⭐ Bonus penales (predices empate y aciertas quién avanza): +1 pt. Máximo 5 pts por partido. Si no aciertas el clasificado, 0 pts aunque el marcador sea exacto.' },
  { q: '¿Cuándo se cierran los picks?',
    a: 'Los picks se pueden editar hasta el inicio de cada partido. Una vez comenzado el partido, los picks de ese partido quedan bloqueados. Puedes seguir modificando los picks de partidos que aún no han comenzado.' },
  { q: '¿Cómo se distribuyen los premios?',
    a: 'El 65% del fondo va al 1er lugar, el 20% al 2do lugar y el 15% restante cubre los gastos de organización.' },
  { q: '¿Puedo participar si ya estuve en la Fase de Grupos?',
    a: 'Sí. Son quinielas independientes. Debes hacer una nueva inscripción y pagar de nuevo. Puedes usar los mismos datos (cédula, WhatsApp) pero necesitas un código nuevo KO26-XXXXXX.' },
  { q: '¿Qué pasa en el desempate?',
    a: 'Se desempata por: 1) Clasificados correctos, 2) Marcadores exactos, 3) Bonus de penales, 4) Orden de inscripción.' },
  { q: '¿Los horarios están en hora Venezuela?',
    a: 'Sí, todos los partidos se muestran en hora Venezuela (UTC-4). Los Dieciseisavos comienzan el 27 de junio de 2026.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-50 transition-colors">
            <span className="text-slate-800 text-sm">{faq.q}</span>
            {open === i
              ? <ChevronUp size={18} className="text-green-600 shrink-0 ml-3" />
              : <ChevronDown size={18} className="text-slate-400 shrink-0 ml-3" />}
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function Home() {
  const [koVerified, setKoVerified] = useState(0)
  const [koPool, setKoPool] = useState(0)

  useEffect(() => {
    fetch('/api/ko/ranking')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.ranking) {
          setKoVerified(d.ranking.length)
          setKoPool(d.ranking.length * 20)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden text-white flex flex-col min-h-screen sm:min-h-[620px]">

        {/* Desktop image */}
        <div className="absolute inset-0 hidden sm:block">
          <Image src="/assets/hero/hero-desktop.webp" alt="Quiniela Eliminatorias 2026"
            fill className="object-cover object-center" priority sizes="100vw" />
        </div>
        {/* Mobile image */}
        <div className="absolute inset-0 block sm:hidden">
          <Image src="/assets/hero/hero-mobile.webp" alt="Quiniela Eliminatorias 2026"
            fill className="object-cover" style={{ objectPosition: 'center top' }} priority sizes="100vw" />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-black/55 via-transparent to-black/85" />
        <div className="absolute inset-0 hidden sm:block bg-[radial-gradient(ellipse_60%_80%_at_50%_40%,rgba(0,0,0,0.55)_0%,transparent_100%)]" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/75 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/25 via-transparent to-blue-900/25" />

        {/* Content */}
        <div className="relative flex-1 flex flex-col max-w-3xl mx-auto px-4 w-full
                        sm:pt-14 sm:pb-20 sm:justify-start
                        pt-8 pb-16 justify-end text-center items-center">

          {/* Stage badge */}
          <div className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90">Inscripciones abiertas · Dieciseisavos de Final</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-3 leading-[1.05] tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)' }}>
            Quiniela{' '}
            <span className="text-yellow-300"
                  style={{ textShadow: '0 0 30px rgba(251,191,36,0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>
              Eliminatorias
            </span>
            <br />
            <span className="text-3xl sm:text-4xl font-bold text-white/80">Mundial 2026</span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 mb-6 max-w-lg mx-auto leading-relaxed"
             style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Predice <strong className="text-yellow-300 font-bold">16 partidos de Dieciseisavos</strong> y
            sigue hasta la Final. Sistema de puntos nuevo. Máx. <strong className="text-yellow-300">5 pts</strong> por partido.
          </p>

          {/* Live stats */}
          {koVerified > 0 && (
            <div className="flex items-center gap-4 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
              <span className="text-white/90 text-sm"><strong className="text-yellow-300">{koVerified}</strong> participantes verificados</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="text-white/90 text-sm">Pozo: <strong className="text-yellow-300">${koPool}</strong> USD</span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none mb-5">
            <Link href="/eliminatorias/registro"
              className="group relative bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base sm:text-lg transition-all shadow-2xl hover:shadow-yellow-400/40 hover:-translate-y-1 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}>
              <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
              Participar ahora
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400">
                20 USD
              </span>
            </Link>
            <Link href="/eliminatorias/ranking"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all inline-flex items-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              <Trophy size={18} className="shrink-0" /> Ver ranking
            </Link>
            <Link href="/eliminatorias/mi-quiniela"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all inline-flex items-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              Mi quiniela
            </Link>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-white/50 text-xs">
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Pago Móvil o Zelle</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> 20 USD / 14.600 Bs · Tasa fija</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Código propio KO26-XXXXXX</span>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </header>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
          {[
            { value: 16,    suffix: '',     label: 'Partidos R32',      color: 'text-green-600' },
            { value: 32,    suffix: '',     label: 'Equipos',            color: 'text-blue-600' },
            { value: 20,    suffix: ' USD', label: 'Entrada',            color: 'text-yellow-600' },
            { value: 14600, suffix: ' Bs',  label: 'Monto fijo',         color: 'text-amber-600' },
            { value: 65,    suffix: '%',    label: 'Premio 1er lugar',   color: 'text-purple-600' },
          ].map(({ value, suffix, label, color }, i) => (
            <div key={i} className={i >= 3 ? 'hidden sm:block' : ''}>
              <div className={`text-2xl font-extrabold ${color}`}>
                <AnimatedNumber target={value} suffix={suffix} />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-14 w-full space-y-20">

        {/* ── STAGES ──────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Formato</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Etapas de la <span className="text-green-600">Eliminatoria</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { stage: 'Dieciseisavos', matches: 16, icon: '⚡', active: true,  sub: 'R32' },
              { stage: 'Octavos',       matches: 8,  icon: '🔥', active: false, sub: 'R16' },
              { stage: 'Cuartos',       matches: 4,  icon: '⭐', active: false, sub: 'QF'  },
              { stage: 'Semis',         matches: 2,  icon: '🏅', active: false, sub: 'SF'  },
              { stage: 'Final',         matches: 1,  icon: '🏆', active: false, sub: 'F'   },
            ].map(s => (
              <div key={s.sub} className={`rounded-2xl p-4 text-center border-2 ${s.active ? 'bg-green-50 border-green-400 shadow-md' : 'bg-white border-slate-200'}`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`font-extrabold text-sm ${s.active ? 'text-green-700' : 'text-slate-600'}`}>{s.stage}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.matches} partido{s.matches > 1 ? 's' : ''}</div>
                {s.active && <div className="mt-1.5 text-[10px] font-bold text-green-600 bg-green-100 rounded-full px-2 py-0.5 inline-block">Abierto</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── SCORING ─────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Puntuación</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Sistema de <span className="text-blue-700">Puntos</span></h2>
            <p className="text-slate-500 mt-2 text-sm">Eliminatorias tiene un sistema diferente al de la Fase de Grupos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '🏆', pts: '+2', title: 'Clasificado correcto', desc: 'Aciertas quién avanza al siguiente partido. Requisito para los demás puntos.', bg: 'bg-green-50', border: 'border-green-300', ptsBg: 'bg-green-500 text-white' },
              { icon: '🎯', pts: '+2', title: 'Marcador exacto', desc: 'Aciertas los goles exactos de reglamento. Solo suma si el clasificado es correcto.', bg: 'bg-blue-50', border: 'border-blue-300', ptsBg: 'bg-blue-600 text-white' },
              { icon: '⭐', pts: '+1', title: 'Bonus penales', desc: 'Predices empate en reglamento Y aciertas quién gana la tanda de penales.', bg: 'bg-amber-50', border: 'border-amber-300', ptsBg: 'bg-amber-500 text-white' },
            ].map(card => (
              <div key={card.pts + card.title} className={`${card.bg} border-2 ${card.border} rounded-2xl p-5 text-center`}>
                <div className="text-4xl mb-3">{card.icon}</div>
                <div className={`inline-block ${card.ptsBg} font-extrabold text-2xl rounded-xl px-4 py-2 mb-3`}>{card.pts} pts</div>
                <div className="font-bold text-slate-800 text-sm mb-2">{card.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-5 py-3 text-sm font-semibold">
              ⚽ Máximo: <span className="text-yellow-300">5 pts por partido</span> (2 clasificado + 2 exacto + 1 penales)
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { pred: 'Argentina gana 2-1 (real: 2-1)',           pts: '5', note: 'Clasificado + Exacto',            cls: 'text-green-700', bg: 'bg-green-50' },
                { pred: 'Argentina gana 3-0 (real: 2-1)',           pts: '2', note: 'Solo clasificado correcto',       cls: 'text-blue-600',  bg: '' },
                { pred: 'Empate 1-1 + penales ok (real: idem)',     pts: '5', note: 'Clasificado + Exacto + Penales',  cls: 'text-amber-600', bg: 'bg-amber-50' },
                { pred: 'México gana 1-0 (real: Argentina 2-1)',    pts: '0', note: 'Clasificado incorrecto → 0 pts',  cls: 'text-slate-400', bg: '' },
              ].map(row => (
                <div key={row.pred} className={`flex items-center justify-between px-5 py-3 ${row.bg}`}>
                  <div>
                    <span className="font-mono text-slate-700 text-xs">{row.pred}</span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{row.note}</span>
                  </div>
                  <div className={`font-extrabold ${row.cls} text-lg ml-3 flex-shrink-0`}>{row.pts} pts</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO PARTICIPATE ──────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Proceso</span>
            <h2 className="text-3xl font-extrabold text-slate-900">¿Cómo <span className="text-green-600">participar?</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: 1, icon: '📝', title: 'Regístrate', desc: 'Nombre, cédula y WhatsApp. Recibes tu código KO26-XXXXXX.', border: 'border-green-200', bg: 'bg-green-50', color: 'text-green-600' },
              { num: 2, icon: '💳', title: 'Paga', desc: 'Pago Móvil Banesco (14.600 Bs) o Zelle (20 USD). Reporta la referencia.', border: 'border-blue-200', bg: 'bg-blue-50', color: 'text-blue-600' },
              { num: 3, icon: '⚽', title: 'Llena tu quiniela', desc: 'Predice los 16 partidos de Dieciseisavos. Editable hasta el inicio de cada partido.', border: 'border-purple-200', bg: 'bg-purple-50', color: 'text-purple-600' },
              { num: 4, icon: '🏆', title: '¡Gana!', desc: 'El admin verifica tu pago. Sigue el ranking y gana el pozo acumulado.', border: 'border-yellow-200', bg: 'bg-yellow-50', color: 'text-yellow-600' },
            ].map(step => (
              <div key={step.num} className={`relative bg-white rounded-2xl p-5 shadow-sm border-2 ${step.border} hover:shadow-md transition-all`}>
                <div className={`absolute -top-3 -left-3 w-7 h-7 ${step.bg} border-2 ${step.border} ${step.color} text-sm font-extrabold rounded-full flex items-center justify-center`}>{step.num}</div>
                <div className="text-3xl mb-3 mt-1">{step.icon}</div>
                <div className="font-bold text-slate-800 text-sm mb-1">{step.title}</div>
                <div className="text-xs text-slate-500 leading-snug">{step.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/eliminatorias/registro"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg text-sm">
              ⚡ Inscribirme ahora · 20 USD
            </Link>
          </div>
        </section>

        {/* ── PRIZES ──────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Premios</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Tabla de <span className="text-yellow-600">Premios</span></h2>
          </div>
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white p-8 text-center">
              <p className="text-green-200 text-sm mb-2">Pozo acumulado · {koVerified} participante{koVerified !== 1 ? 's' : ''} verificado{koVerified !== 1 ? 's' : ''}</p>
              <p className="text-5xl font-extrabold text-white drop-shadow">
                ${koPool.toLocaleString('en-US')} <span className="text-2xl font-bold text-green-200">USD</span>
              </p>
              <p className="text-green-300 text-sm mt-1">{(koPool * 730).toLocaleString('es-VE')} Bs · tasa fija 730 Bs/USD</p>
              <p className="text-green-400 text-xs mt-1">{koVerified} pagos × $20 USD</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { medal: '🥇', pos: '1er Lugar',    pct: 65, usd: Math.round(koPool * 0.65), badge: 'bg-yellow-100 text-yellow-800', color: 'from-yellow-50 to-amber-50' },
                { medal: '🥈', pos: '2do Lugar',    pct: 20, usd: Math.round(koPool * 0.20), badge: 'bg-slate-100 text-slate-600',   color: '' },
                { medal: '🏛️', pos: 'Organización', pct: 15, usd: Math.round(koPool * 0.15), badge: 'bg-blue-50 text-blue-600',     color: '' },
              ].map(row => (
                <div key={row.pos} className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${row.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{row.medal}</span>
                    <span className="font-bold text-slate-700">{row.pos}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.badge}`}>{row.pct}%</span>
                    <div className="text-right">
                      <div className="font-extrabold text-lg text-slate-800">${row.usd.toLocaleString('en-US')} USD</div>
                      <div className="text-xs text-slate-500">{(row.usd * 730).toLocaleString('es-VE')} Bs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 p-4">El pozo se actualiza según los pagos verificados por el administrador.</p>
          </div>
        </section>

        {/* ── PAYMENT ─────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Pago</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Métodos de <span className="text-blue-700">Pago</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-xl">
              <div className="text-center mb-5">
                <div className="text-3xl mb-1">📱</div>
                <h3 className="font-extrabold text-xl">Pago Móvil</h3>
                <div className="text-green-200 text-sm mt-1">Pago en bolívares</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center mb-4">
                <div className="text-green-200 text-xs mb-1">Monto</div>
                <div className="text-3xl font-extrabold">14.600 <span className="text-lg font-semibold">Bs</span></div>
                <div className="text-green-200 text-xs mt-1">20 USD · Tasa fija 730 Bs/USD</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Banco',    value: 'Banesco',     icon: '🏦' },
                  { label: 'Teléfono', value: '04143043337', icon: '📞' },
                  { label: 'Cédula',   value: 'V-4.561.947', icon: '🪪' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="text-green-200 text-xs">{label}</div>
                      <div className="font-bold text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl">
              <div className="text-center mb-5">
                <div className="text-3xl mb-1">💵</div>
                <h3 className="font-extrabold text-xl">Zelle</h3>
                <div className="text-blue-200 text-sm mt-1">Pago en dólares</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center mb-4">
                <div className="text-blue-200 text-xs mb-1">Monto</div>
                <div className="text-3xl font-extrabold">20 <span className="text-lg font-semibold">USD</span></div>
                <div className="text-blue-200 text-xs mt-1">Pago directo en dólares</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Método', value: 'Zelle',                  icon: '💵' },
                  { label: 'Correo', value: 'kissigloxxi@hotmail.com', icon: '📧' },
                  { label: 'Monto',  value: '20 USD',                  icon: '💲' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="text-blue-200 text-xs">{label}</div>
                      <div className="font-bold text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 text-center">
            📌 Entrada: <strong>20 USD</strong> · Pago Móvil: <strong>14.600 Bs</strong> · Zelle: <strong>20 USD</strong> · Tasa fija: 730 Bs/USD
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Plataforma</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Todo lo que <span className="text-purple-600">necesitas</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🏆', bg: 'bg-yellow-50', title: 'Ranking en tiempo real', desc: 'Tu posición se actualiza automáticamente al ingresar resultados.' },
              { icon: '⚽', bg: 'bg-green-50',  title: 'Picks por partido', desc: 'Rellena tu quiniela partido por partido. Editable hasta que empiece.' },
              { icon: '⭐', bg: 'bg-blue-50',   title: 'Penales incluidos', desc: 'Predice quién avanza en empates. Ganas el bonus si aciertas.' },
              { icon: '📱', bg: 'bg-purple-50', title: 'Código personal', desc: 'Accede siempre con tu código KO26-XXXXXX, cédula o WhatsApp.' },
              { icon: '🔒', bg: 'bg-red-50',    title: 'Cierre automático', desc: 'Cada partido se bloquea al inicio. Transparencia garantizada.' },
              { icon: '💳', bg: 'bg-amber-50',  title: 'Pago Móvil o Zelle', desc: 'Dos métodos de pago disponibles. El admin verifica manualmente.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className={`${feat.bg} rounded-xl p-2.5 shrink-0 text-2xl`}>{feat.icon}</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{feat.title}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Dudas</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Preguntas <span className="text-green-600">Frecuentes</span></h2>
          </div>
          <FAQ />
        </section>

        {/* ── FASE DE GRUPOS HISTÓRICO ─────────────────────────────── */}
        <section>
          <div className="text-center mb-6">
            <span className="inline-block bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Fase anterior</span>
            <h2 className="text-2xl font-extrabold text-slate-700">Quiniela Fase de Grupos — <span className="text-slate-500">Histórico</span></h2>
            <p className="text-slate-400 text-sm mt-1">La Fase de Grupos ya cerró. Puedes consultar el ranking final y los resultados.</p>
          </div>
          <div className="bg-slate-100 rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: '/ranking',     icon: '🏆', label: 'Ranking final',         desc: 'Posiciones finales Grupos' },
                { href: '/resultados',  icon: '⚽', label: 'Resultados',            desc: '72 partidos de grupos' },
                { href: '/mi-quiniela', icon: '📋', label: 'Mi quiniela (Grupos)',  desc: 'Ver predicciones anteriores' },
                { href: '/estadisticas',icon: '📊', label: 'Estadísticas',          desc: 'Análisis de la fase' },
              ].map(({ href, icon, label, desc }) => (
                <Link key={href} href={href}
                  className="bg-white border border-slate-200 rounded-xl py-4 px-3 text-center hover:shadow-sm transition-all hover:border-slate-300">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-semibold text-slate-700 text-xs">{label}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ───────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-blue-700 rounded-3xl p-10 text-white text-center overflow-hidden shadow-2xl">
          <div className="relative">
            <div className="text-5xl mb-4">⚡</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¡Inscripciones abiertas!</h2>
            <p className="text-green-100 mb-6 max-w-md mx-auto">
              Dieciseisavos de Final · 16 partidos · Máx. 5 pts cada uno.<br/>
              Elimina a la competencia y gana el pozo.
            </p>
            <Link href="/eliminatorias/registro"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-10 py-4 rounded-2xl text-lg transition-all shadow-xl hover:-translate-y-1">
              ⚽ Participar ahora — 20 USD
            </Link>
            <p className="text-green-200 text-xs mt-4">Pago Móvil Banesco · Zelle · 20 USD / 14.600 Bs · Tasa fija 730 Bs/USD</p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-semibold text-white mb-1">Quiniela Eliminatorias 2026 ⚡</p>
          <p className="text-xs mb-4">Pago Móvil Banesco 04143043337 · CI 4561947 · Zelle: kissigloxxi@hotmail.com · 20 USD / 14.600 Bs · Tasa fija 730 Bs/USD</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
            {[
              { href: '/eliminatorias/registro',  label: 'Inscribirme' },
              { href: '/eliminatorias/ranking',   label: 'Ranking KO' },
              { href: '/eliminatorias/resultados',label: 'Resultados KO' },
              { href: '/eliminatorias/mi-quiniela',label: 'Mi quiniela KO' },
              { href: '/ranking',                 label: 'Ranking Grupos' },
              { href: '/admin',                   label: 'Admin' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4">© 2026 Quiniela Mundial 2026 · Todos los horarios en Hora Venezuela (UTC-4)</p>
        </div>
      </footer>
    </div>
  )
}
