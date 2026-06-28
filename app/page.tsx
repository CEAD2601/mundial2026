'use client'

/**
 * Home pública — copia fiel del renderHome() del prototipo aprobado.
 * Fuente: /admin/prototipo-eliminatorias-avanzado (líneas 882–1738)
 * Único cambio: setView() → Link, datos localStorage → API real.
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Trophy, Users, Clock, Star, Shield, BarChart2, ChevronDown,
} from 'lucide-react'

// ── Prize pool constants (idénticas al prototipo) ────────────────────────────
const ENTRY_USD               = 20
const RATE_BS                 = 730
const PCT_1ST                 = 0.65
const PCT_2ND                 = 0.20
const PCT_ORG                 = 0.15
const ESTIMATED_PARTICIPANTS  = 24
const REAL_POOL_THRESHOLD     = 10

// ── AnimatedCounter (idéntico al prototipo) ──────────────────────────────────
function AnimatedCounter({
  value, prefix = '', suffix = '', duration = 900, delay = 0,
}: {
  value: number; prefix?: string; suffix?: string; duration?: number; delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const rafRef   = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || value === 0) { setDisplay(value); return }
    let started = false
    const timeout = setTimeout(() => {
      started = true
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const elapsed  = ts - startRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased    = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) rafRef.current = requestAnimationFrame(animate)
        else setDisplay(value)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
      if (started) setDisplay(value)
    }
  }, [value, duration, delay])

  const formatted = display.toLocaleString('es-VE')
  return <span>{prefix}{formatted}{suffix}</span>
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [faqOpen, setFaqOpen]     = useState<number | null>(null)
  const [verified, setVerified]   = useState(0)

  // Scroll-reveal (idéntico al prototipo)
  useEffect(() => {
    let io: IntersectionObserver | null = null
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.ko-reveal'))
      if (!els.length) return
      io = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('ko-visible'); io?.unobserve(e.target) }
        }),
        { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => io!.observe(el))
    }, 80)
    return () => { clearTimeout(timer); io?.disconnect() }
  }, [])

  // Datos reales — participantes verificados KO
  useEffect(() => {
    fetch('/api/ko/ranking')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.ranking) setVerified(d.ranking.length) })
      .catch(() => {})
  }, [])

  // Prize pool (idéntico al prototipo)
  const pozoUSD    = verified * ENTRY_USD
  const pozoBs     = pozoUSD * RATE_BS
  const isEstimated = verified < REAL_POOL_THRESHOLD
  const estPozoUSD  = ESTIMATED_PARTICIPANTS * ENTRY_USD
  const estPozoBs   = estPozoUSD * RATE_BS
  const displayUSD  = isEstimated ? estPozoUSD : pozoUSD
  const displayBs   = isEstimated ? estPozoBs  : pozoBs
  const prizeRows = [
    { medal: '🥇', pos: '1er Lugar',    pct: '65%', usd: Math.round(displayUSD * PCT_1ST), bs: Math.round(displayBs * PCT_1ST), color: 'from-yellow-50 to-amber-50', badge: 'bg-yellow-100 text-yellow-800', delay: 400 },
    { medal: '🥈', pos: '2do Lugar',    pct: '20%', usd: Math.round(displayUSD * PCT_2ND), bs: Math.round(displayBs * PCT_2ND), color: 'from-slate-50 to-slate-50',  badge: 'bg-slate-100 text-slate-600',  delay: 500 },
    { medal: '🏛️', pos: 'Organización', pct: '15%', usd: Math.round(displayUSD * PCT_ORG), bs: Math.round(displayBs * PCT_ORG), color: '',                            badge: 'bg-blue-50 text-blue-600',    delay: 600 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Animaciones (idénticas al prototipo) ── */}
      <style>{`
        @keyframes ko-rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ko-rise    { animation: ko-rise 0.65s cubic-bezier(.22,1,.36,1) both; }
        .ko-rise-d1 { animation: ko-rise 0.65s 0.10s cubic-bezier(.22,1,.36,1) both; }
        .ko-rise-d2 { animation: ko-rise 0.65s 0.20s cubic-bezier(.22,1,.36,1) both; }
        .ko-rise-d3 { animation: ko-rise 0.65s 0.32s cubic-bezier(.22,1,.36,1) both; }
        .ko-rise-d4 { animation: ko-rise 0.65s 0.46s cubic-bezier(.22,1,.36,1) both; }

        .ko-reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1);
          will-change: transform, opacity;
        }
        .ko-reveal.ko-visible { opacity: 1; transform: translateY(0); }

        .ko-faq-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.32s cubic-bezier(.22,1,.36,1), opacity 0.28s ease;
          opacity: 0;
        }
        .ko-faq-body.ko-faq-open { max-height: 400px; opacity: 1; }

        .ko-btn-cta {
          transition: transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s ease, filter 0.15s ease;
        }
        .ko-btn-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 32px rgba(34,197,94,0.4); filter: brightness(1.08); }
        .ko-btn-cta:active { transform: scale(0.96); }

        .ko-card-hover { transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease; }
        .ko-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.14); }
        .ko-card-hover:active { transform: scale(0.98); }

        @media (prefers-reduced-motion: reduce) {
          .ko-rise, .ko-rise-d1, .ko-rise-d2, .ko-rise-d3, .ko-rise-d4 { animation: none !important; }
          .ko-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .ko-faq-body { transition: none !important; max-height: 400px !important; opacity: 1 !important; }
          .ko-btn-cta, .ko-card-hover { transition: none !important; transform: none !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <header className="relative overflow-hidden text-white flex flex-col min-h-screen sm:min-h-[600px]">

        <div className="absolute inset-0 block sm:hidden">
          <img src="/assets/hero/hero-mobile.webp" alt="Quiniela Eliminatorias 2026"
            className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <img src="/assets/hero/hero-desktop.webp" alt="Quiniela Eliminatorias 2026"
            className="w-full h-full object-cover object-center" />
        </div>

        <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-black/55 via-transparent to-black/85" />
        <div className="absolute inset-0 hidden sm:block bg-[radial-gradient(ellipse_60%_80%_at_50%_40%,rgba(0,0,0,0.55)_0%,transparent_100%)]" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-blue-900/20" />

        <div className="relative flex-1 flex flex-col max-w-3xl mx-auto px-4 w-full
                        sm:pt-14 sm:pb-20 sm:justify-start
                        pt-8 pb-16 justify-end text-center items-center ko-rise">

          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 shadow-lg">
            <span>🇲🇽 🇺🇸 🇨🇦</span>
            <span className="text-white/90">México · EE.UU. · Canadá 2026</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5 text-yellow-300 text-sm font-bold mb-5 animate-pulse">
            🟢 Inscripciones abiertas
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-[1.05] tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)' }}>
            Quiniela{' '}
            <span className="text-yellow-300" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>
              Dieciseisavos 2026
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 mb-3 max-w-lg mx-auto leading-relaxed"
             style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Predice los <strong className="text-yellow-300 font-bold">16 partidos</strong> de Dieciseisavos,
            compite con tus amigos y gana el pozo acumulado.
          </p>

          <p className="text-white/55 text-sm mb-8" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            🟢 Quiniela activa: <strong className="text-yellow-300/80">Dieciseisavos</strong>
            <span className="mx-2 opacity-40">·</span>
            ⏳ Próxima: <span className="opacity-70">Octavos → Final</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none">
            <Link href="/eliminatorias/registro"
              className="ko-btn-cta group relative bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-2xl inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation"
              style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}>
              <span className="text-xl group-hover:scale-110 transition-transform">⚽</span>
              Participar ahora
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400">
                20 USD
              </span>
            </Link>
            <Link href="/eliminatorias/ranking"
              className="bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation">
              🏆 Ver ranking
            </Link>
            <Link href="/eliminatorias/mi-quiniela"
              className="bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center touch-manipulation">
              📋 Mi quiniela
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/50 text-xs">
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Pago Móvil o Zelle</span>
            <span className="w-px h-3 bg-white/20 hidden sm:block" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> 20 USD / 14.600 Bs · Tasa fija</span>
            <span className="w-px h-3 bg-white/20 hidden sm:block" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Ranking en tiempo real</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm ko-rise-d1">
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-green-600"><AnimatedCounter value={16} duration={700} delay={100} /></div>
            <div className="text-xs text-slate-500 mt-0.5">Partidos</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-600"><AnimatedCounter value={32} duration={700} delay={150} /></div>
            <div className="text-xs text-slate-500 mt-0.5">Equipos</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-yellow-600"><AnimatedCounter value={20} suffix=" USD" duration={700} delay={200} /></div>
            <div className="text-xs text-slate-500 mt-0.5">Entrada</div>
          </div>
          <div className="hidden sm:block">
            <div className="text-2xl font-extrabold text-amber-600"><AnimatedCounter value={14600} duration={800} delay={250} /></div>
            <div className="text-xs text-slate-500 mt-0.5">Monto en Bs</div>
          </div>
          <div className="hidden sm:block">
            <div className="text-2xl font-extrabold text-purple-600">65%</div>
            <div className="text-xs text-slate-500 mt-0.5">Premio 1er lugar</div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-14 w-full space-y-20">

        {/* ── DOS QUINIELAS SEPARADAS ── */}
        <section className="ko-rise-d2">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Tus quinielas</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Las Eliminatorias en <span className="text-green-600">dos quinielas</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Las eliminatorias se dividen en dos quinielas independientes,<br className="hidden sm:block" />
              cada una con su propia inscripción, ranking y premios.
            </p>
          </div>

          <div className="space-y-5">
            {/* QUINIELA DIECISEISAVOS — ACTIVA */}
            <div className="rounded-2xl border-2 border-green-400 bg-white shadow-md overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest">🟢 Quiniela activa</span>
                <span className="text-xs font-semibold text-green-200">Inscripciones abiertas</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Quiniela Dieciseisavos</h3>
                    <p className="text-sm text-slate-500 mt-1">16 partidos · 28 jun – 3 jul 2026</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Esta quiniela es <strong className="text-slate-600">independiente</strong>. Solo incluye los 16 partidos de Dieciseisavos de final.
                      Tiene su propio ranking y sus propios premios.
                    </p>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className="text-3xl font-extrabold leading-none text-green-600">
                      {verified}<span className="text-lg text-slate-400"> verificados</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">participantes</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">⚽</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Dieciseisavos de final</p>
                      <p className="text-xs text-slate-500">16 partidos · 28 jun – 3 jul</p>
                    </div>
                  </div>
                  <Link href="/eliminatorias/registro"
                    className="text-sm font-bold px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all active:scale-95 touch-manipulation">
                    Inscribirme
                  </Link>
                </div>
              </div>
            </div>

            {/* QUINIELA OCTAVOS A FINAL — PRÓXIMAMENTE */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden opacity-80">
              <div className="bg-slate-600 text-white px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest">⏳ Próxima quiniela</span>
                <span className="text-xs font-semibold text-slate-300">Se abre en julio</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-slate-700 leading-tight">Quiniela Octavos a Final</h3>
                    <p className="text-sm text-slate-500 mt-1">Octavos · Cuartos · Semifinales · Final · 4 – 19 jul</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Se abrirá cuando estén definidos los 16 clasificados de Dieciseisavos.
                      Tendrá <strong className="text-slate-500">nueva inscripción</strong>, nuevo llenado y
                      <strong className="text-slate-500"> ranking separado</strong>. No se mezcla con esta quiniela.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1.5 rounded-full">Por definir</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(['Octavos (R16)','Cuartos (QF)','Semifinales','Final'] as const).map(s => (
                    <div key={s} className="rounded-lg border border-slate-200 bg-white/60 px-3 py-2 flex items-center gap-2">
                      <span className="text-base">🔒</span>
                      <p className="text-xs font-semibold text-slate-600">{s}</p>
                    </div>
                  ))}
                </div>
                <button disabled
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold bg-slate-200 text-slate-400 cursor-not-allowed">
                  Próximamente — nueva inscripción
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── ¿CÓMO PARTICIPAR? ── */}
        <section className="ko-reveal">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Proceso</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              ¿Cómo <span className="text-green-600">participar?</span>
            </h2>
            <p className="text-slate-500 mt-2">En 5 pasos simples, completa tu quiniela y compite por el premio.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { num: 1, icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), title: 'Regístrate', desc: 'Nombre, cédula y WhatsApp.', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
              { num: 2, icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>), title: 'Llena tu quiniela', desc: 'Predice los 16 partidos de Dieciseisavos.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              { num: 3, icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>), title: 'Paga y reporta', desc: 'Pago Móvil o Zelle. Envía tu comprobante por WhatsApp.', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
              { num: 4, icon: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>), title: 'Sigue el ranking', desc: 'Mira tu posición en vivo.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
              { num: 5, icon: <Trophy className="w-8 h-8" />, title: '¡Gana!', desc: 'El mejor puntaje gana el premio.', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            ].map((step) => (
              <div key={step.num} className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                <div className={`ko-card-hover relative flex-1 lg:w-full bg-white rounded-2xl p-5 lg:p-6 shadow-sm border ${step.border}`}>
                  <div className={`absolute -top-3 -left-3 lg:left-1/2 lg:-translate-x-1/2 w-7 h-7 ${step.bg} border-2 ${step.border} ${step.color} text-sm font-extrabold rounded-full flex items-center justify-center shadow-sm`}>
                    {step.num}
                  </div>
                  <div className={`${step.color} mb-3 mt-1`}>{step.icon}</div>
                  <div className="font-bold text-slate-800 text-sm mb-1">{step.title}</div>
                  <div className="text-xs text-slate-500 leading-snug">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/eliminatorias/registro"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 text-sm touch-manipulation">
              ⚽ Empezar ahora · 20 USD
            </Link>
          </div>
        </section>

        {/* ── TABLA DE PREMIOS ── */}
        <section className="ko-reveal">
          <div className="text-center mb-10">
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Premios</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Tabla de <span className="text-yellow-600">Premios</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
            <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white p-8 text-center overflow-hidden">
              <div className="relative">
                {isEstimated ? (
                  <>
                    <p className="text-green-200 text-sm mb-2">Pozo estimado · Meta inicial {ESTIMATED_PARTICIPANTS} participantes</p>
                    <p className="text-5xl font-extrabold text-white drop-shadow">
                      $<AnimatedCounter value={displayUSD} duration={900} delay={200} /> <span className="text-2xl font-bold text-green-200">USD</span>
                    </p>
                    <p className="text-green-300 text-sm mt-1">
                      <AnimatedCounter value={displayBs} duration={900} delay={250} /> Bs
                      <span className="text-xs ml-1">(tasa fija {RATE_BS} Bs/USD)</span>
                    </p>
                    {verified > 0 && <p className="text-green-400 text-xs mt-1">Pagos verificados actuales: {verified}</p>}
                  </>
                ) : (
                  <>
                    <p className="text-green-200 text-sm mb-2">
                      Pozo acumulado · <AnimatedCounter value={verified} suffix=" pagos verificados" duration={700} delay={300} />
                    </p>
                    <p className="text-5xl font-extrabold text-white drop-shadow">
                      $<AnimatedCounter value={displayUSD} duration={900} delay={200} /> <span className="text-2xl font-bold text-green-200">USD</span>
                    </p>
                    <p className="text-green-300 text-sm mt-1">
                      <AnimatedCounter value={displayBs} duration={900} delay={250} /> Bs
                      <span className="text-xs ml-1">(tasa fija {RATE_BS} Bs/USD)</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {prizeRows.map((row) => (
                <div key={row.pos} className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${row.color} hover:bg-opacity-80 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{row.medal}</span>
                    <span className="font-bold text-slate-700">{row.pos}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.badge}`}>{row.pct}</span>
                    <div className="text-right">
                      <div className="font-extrabold text-lg text-slate-800">
                        $<AnimatedCounter value={row.usd} duration={800} delay={row.delay} /> USD
                      </div>
                      <div className="text-xs text-slate-500">
                        <AnimatedCounter value={row.bs} duration={800} delay={row.delay + 50} /> Bs
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 p-4">
              {isEstimated
                ? 'El pozo real se actualizará automáticamente según los pagos verificados.'
                : `${verified} pago${verified !== 1 ? 's' : ''} verificado${verified !== 1 ? 's' : ''} · Tasa fija: ${RATE_BS} Bs/USD`}
            </p>
          </div>
        </section>

        {/* ── MÉTODOS DE PAGO ── */}
        <section className="ko-reveal">
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Pago</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Métodos de <span className="text-blue-700">Pago</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Puedes pagar por Pago Móvil Banesco o por Zelle. Elige el que prefieras.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="ko-card-hover bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-xl">
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
                  { label: 'Banco', value: 'Banesco', icon: '🏦' },
                  { label: 'Teléfono', value: '04143043337', icon: '📞' },
                  { label: 'Cédula', value: 'V-4.561.947', icon: '🪪' },
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
            <div className="ko-card-hover bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl">
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
                  { label: 'Método', value: 'Zelle', icon: '💵' },
                  { label: 'Correo', value: 'kissigloxxi@hotmail.com', icon: '📧' },
                  { label: 'Monto', value: '20 USD', icon: '💲' },
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

        {/* ── SISTEMA DE PUNTUACIÓN ── */}
        <section className="ko-reveal">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Puntuación</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Sistema de <span className="text-green-600">Puntuación</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Predice el marcador de cada partido. Acertar el clasificado da 2 pts. Si también aciertas el marcador exacto sumas 2 pts más.
              Si el partido termina empatado y aciertas quién clasifica por penales, ganas 1 pt de Bonus. Máximo 5 pts por partido.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: '🏆', pts: '+2', extra: '', title: 'Clasificado correcto', desc: 'Aciertas qué equipo gana (o quién avanza por penales si hay empate).', bg: 'bg-green-50', border: 'border-green-300', ptsBg: 'bg-green-500', ptsText: 'text-white' },
              { icon: '🎯', pts: '+2', extra: '', title: 'Marcador exacto', desc: 'Solo si también acertaste el clasificado. El marcador exacto no incluye penales.', bg: 'bg-yellow-50', border: 'border-yellow-300', ptsBg: 'bg-yellow-400', ptsText: 'text-slate-900' },
              { icon: '⭐', pts: '+1', extra: 'bonus', title: 'Bonus penales', desc: 'Si pronosticas empate y aciertas quién clasifica por penales, sumas 1 pt bonus.', bg: 'bg-amber-50', border: 'border-amber-300', ptsBg: 'bg-amber-500', ptsText: 'text-white' },
              { icon: '❌', pts: '0', extra: '', title: 'Fallo', desc: 'Si fallas quién clasifica, no sumas puntos por clasificado ni por penales.', bg: 'bg-slate-50', border: 'border-slate-200', ptsBg: 'bg-slate-300', ptsText: 'text-slate-700' },
            ].map((card) => (
              <div key={card.title} className={`${card.bg} border-2 ${card.border} rounded-2xl p-4 text-center hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className={`inline-flex items-end gap-1 ${card.ptsBg} ${card.ptsText} font-extrabold text-2xl rounded-xl px-4 py-1.5 mb-2 shadow-sm`}>
                  {card.pts} <span className="text-base font-semibold">pts</span>
                  {card.extra && <span className="text-[10px] font-semibold opacity-80 mb-0.5">({card.extra})</span>}
                </div>
                <div className="font-bold text-slate-800 text-xs mb-1">{card.title}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 mb-6">
            Máximo por partido: <strong className="text-slate-700">5 pts</strong> (2 + 2 + 1 bono penales) · 32 partidos · Máximo total: <strong className="text-slate-700">160 pts</strong>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
            <span className="text-2xl shrink-0">⭐</span>
            <div>
              <p className="font-bold text-amber-900 text-sm mb-1">Bonus penales — +1 pt</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                En eliminatorias no hay empate final: si colocas empate, debes elegir qué equipo clasifica por penales (obligatorio).
                Si el partido real termina empatado y aciertas el equipo que clasifica por penales, sumas <strong>1 pt de bonus</strong>.
                Este bonus solo aplica si también acertaste el clasificado.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="bg-slate-800 text-white px-5 py-3 text-sm font-semibold">
              ⚽ Ejemplo A — Resultado real: <span className="text-yellow-300">Argentina 2 – 1 México</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { pred: 'Argentina 2 – 1 México', note: 'Clasificado ✓ + Marcador exacto ✓  →  2+2', pts: 4, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
                { pred: 'Argentina 3 – 0 México', note: 'Clasificado ✓, marcador diferente  →  2',   pts: 2, cls: 'text-green-600',  bg: '' },
                { pred: 'México 1 – 0 Argentina', note: 'Clasificado ✗ — falla el ganador  →  0',    pts: 0, cls: 'text-slate-400',  bg: '' },
              ].map((row) => (
                <div key={row.pred} className={`flex items-center justify-between px-5 py-3.5 ${row.bg}`}>
                  <div>
                    <span className="font-mono font-bold text-slate-800 text-sm">{row.pred}</span>
                    <span className="text-xs text-slate-400 ml-3 hidden sm:inline">{row.note}</span>
                  </div>
                  <div className={`font-extrabold text-lg ${row.cls}`}>{row.pts} pts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-amber-700 text-white px-5 py-3 text-sm font-semibold">
              ⭐ Ejemplo B — Resultado real: <span className="text-yellow-200">Argentina 1 – 1 Francia · Argentina clasifica por penales</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { pred: 'Empate 1–1 · Penales: Argentina', note: 'Clasificado ✓ + Exacto ✓ + Bonus ✓  →  2+2+1',           pts: 5, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
                { pred: 'Argentina 2–1 Francia',            note: 'Clasificado ✓ · No predijo empate → sin bonus',            pts: 2, cls: 'text-green-600',  bg: '' },
                { pred: 'Empate 1–1 · Penales: Francia',   note: 'Falló el clasificado → 0 pts aunque el marcador coincida', pts: 0, cls: 'text-slate-400',  bg: '' },
                { pred: 'Empate 0–0 · Penales: Argentina', note: 'Clasificado ✓ + Bonus ✓, marcador diferente  →  2+1',      pts: 3, cls: 'text-green-600',  bg: '' },
                { pred: 'Francia 2–0 Argentina',           note: 'Clasificado ✗ — falla quien clasifica',                    pts: 0, cls: 'text-slate-400',  bg: '' },
              ].map((row) => (
                <div key={row.pred} className={`flex items-center justify-between px-5 py-3.5 ${row.bg}`}>
                  <div>
                    <p className="font-mono font-bold text-slate-800 text-sm">{row.pred}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{row.note}</p>
                  </div>
                  <div className={`font-extrabold text-lg shrink-0 ml-3 ${row.cls}`}>{row.pts} pts</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-slate-50 text-xs text-slate-500 text-center">
              Máximo posible: <strong>5 pts × 32 partidos = 160 puntos</strong>
            </div>
          </div>
        </section>

        {/* ── TODO LO QUE NECESITAS ── */}
        <section className="ko-reveal">
          <div className="text-center mb-10">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Plataforma</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Todo lo que <span className="text-purple-600">necesitas</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Trophy size={22} className="text-yellow-600" />,   bg: 'bg-yellow-50',  title: 'Ranking en tiempo real',  desc: 'Ve tu posición actualizada después de cada partido jugado.' },
              { icon: <Users size={22} className="text-blue-600" />,       bg: 'bg-blue-50',    title: 'Quinielas comparables',   desc: 'Compara tu estrategia con otros participantes después del cierre.' },
              { icon: <Clock size={22} className="text-green-600" />,      bg: 'bg-green-50',   title: 'Hora Venezuela',           desc: 'Todos los horarios en VET (UTC-4). Sin confusiones de zona horaria.' },
              { icon: <BarChart2 size={22} className="text-purple-600" />, bg: 'bg-purple-50',  title: 'Estadísticas completas',  desc: 'Goleadores y tabla de equipos del torneo.' },
              { icon: <Shield size={22} className="text-red-600" />,       bg: 'bg-red-50',     title: 'Transparencia total',      desc: 'Resultados y puntuación verificables por todos los participantes.' },
              { icon: <Star size={22} className="text-amber-600" />,       bg: 'bg-amber-50',   title: 'Soporte WhatsApp',         desc: 'Contacta al administrador directamente para cualquier duda.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all">
                <div className={`${feat.bg} rounded-xl p-2.5 shrink-0`}>{feat.icon}</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{feat.title}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FASE ANTERIOR ── */}
        <section className="ko-reveal">
          <div className="text-center mb-8">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Historial</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Fase <span className="text-slate-600">anterior</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Consulta los resultados, ranking y quinielas de la Fase de Grupos ya disputada.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '⚽', label: 'Resultados Fase de Grupos', desc: 'Todos los marcadores de la fase de grupos.',  href: '/resultados' },
              { emoji: '🏆', label: 'Ranking Fase de Grupos',    desc: 'Posiciones finales de la quiniela anterior.', href: '/ranking' },
              { emoji: '📋', label: 'Mi quiniela anterior',       desc: 'Revisa tus pronósticos de la fase pasada.',  href: '/mi-quiniela' },
            ].map(({ emoji, label, desc, href }) => (
              <Link key={label} href={href}
                className="bg-white border-2 border-slate-200 hover:border-green-300 rounded-2xl p-5 flex items-start gap-3 shadow-sm hover:shadow-md transition-all group">
                <span className="text-2xl mt-0.5">{emoji}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-green-700 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ko-reveal">
          <div className="text-center mb-10">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Dudas</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Preguntas <span className="text-green-600">Frecuentes</span>
            </h2>
          </div>
          <div className="space-y-2">
            {[
              { q: '¿Cómo funciona la quiniela?', a: 'Predices el marcador de los 32 partidos de la fase eliminatoria. Por cada partido: acertar el clasificado da 2 pts, acertar además el marcador exacto da 2 pts más, y si el partido termina empatado y aciertas el ganador por penales sumas 1 pt extra (máximo 5 pts por partido). Gana quien acumule más puntos.' },
              { q: '¿Cuánto cuesta participar?', a: 'La inscripción es de 20 USD. Puedes pagar por Pago Móvil Banesco (14.600 Bs a tasa fija 730 Bs/USD) o por Zelle (20 USD directamente).' },
              { q: '¿Cómo puedo pagar?', a: 'Pago Móvil Banesco: Teléfono 04143043337 · CI V-4.561.947 · Monto 14.600 Bs. Zelle: kissigloxxi@hotmail.com · 20 USD. Después de pagar, reporta la referencia o comprobante por WhatsApp.' },
              { q: '¿Hasta cuándo puedo inscribirme?', a: 'Puedes inscribirte y llenar tu quiniela hasta antes del primer partido de la fase eliminatoria. Una vez inicia la ronda, tu quiniela queda bloqueada.' },
              { q: '¿Cómo se distribuyen los premios?', a: 'El 65% del fondo va al 1er lugar, el 20% al 2do lugar y el 15% restante cubre los gastos de organización.' },
              { q: '¿Qué pasa si hay empate en puntos?', a: 'Se desempata por: 1) Mayor número de predicciones exactas, 2) Mayor efectividad porcentual, 3) Orden de inscripción.' },
              { q: '¿Los horarios están en hora Venezuela?', a: 'Sí, todos los partidos se muestran en hora Venezuela (UTC-4, sin horario de verano).' },
              { q: '¿Puedo modificar mi quiniela después de enviarla?', a: 'Puedes modificar tus pronósticos hasta que comience el primer partido de la ronda correspondiente. Una vez inicia el partido, ese pronóstico queda bloqueado.' },
              { q: '¿Qué pasa si el partido va a penales?', a: 'En eliminatorias puede haber empate en tiempo reglamentario y definición por penales. Si predices empate, el formulario te pedirá que elijas también quién gana por penales. Para los puntos, lo que cuenta es el clasificado final (quien avanza, incluyendo penales). El marcador exacto se refiere al resultado en 90 minutos (ej: 1–1), sin contar la prórroga ni los penales.' },
              { q: '¿Cómo se calculan exactamente los puntos?', a: 'El equipo clasificado es la prioridad: si lo fallas, son 0 pts aunque el marcador coincida. Si aciertas el clasificado: +2 pts. Si además el marcador exacto coincide (goles en tiempo reglamentario, sin contar penales): +2 pts más. Bonus +1 si pronosticaste empate y acertaste quién clasifica por penales. Máximo 5 pts por partido.' },
              { q: '¿Puedo participar si ya estuve en la Fase de Grupos?', a: 'Sí. Son quinielas completamente independientes. Debes hacer una nueva inscripción y un nuevo pago. Tus datos anteriores (cédula, WhatsApp) no pasan automáticamente.' },
            ].map((faq, i) => {
              const isOpen = faqOpen === i
              return (
                <div key={i} className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-green-300 bg-green-50/30' : 'border-slate-200 hover:border-green-200'}`}>
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-50/60 transition-colors touch-manipulation"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm leading-snug ${isOpen ? 'text-green-800 font-semibold' : 'text-slate-800'}`}>{faq.q}</span>
                    <span className={`shrink-0 ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown size={18} className={isOpen ? 'text-green-600' : 'text-slate-400'} />
                    </span>
                  </button>
                  <div className={`ko-faq-body ${isOpen ? 'ko-faq-open' : ''}`}>
                    <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="ko-reveal relative bg-gradient-to-br from-green-700 via-green-600 to-blue-700 rounded-3xl p-10 text-white text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'url(/assets/hero/football-pattern.svg)', backgroundSize: '120px' }} />
          <div className="relative">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¡Inscripciones abiertas!</h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Predice los 32 partidos de la fase eliminatoria y compite por el primer lugar.
            </p>
            <Link href="/eliminatorias/registro"
              className="ko-btn-cta inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-extrabold px-10 py-4 rounded-2xl text-lg shadow-xl touch-manipulation">
              ⚽ Inscribirme ahora · 20 USD
            </Link>
            <p className="text-green-200 text-xs mt-4">Pago Móvil Banesco · Zelle · 20 USD / 14.600 Bs · Tasa fija 730 Bs/USD</p>
          </div>
        </section>

        {/* Admin — discreto al final */}
        <div className="text-center py-8 border-t border-slate-100">
          <Link href="/admin" className="text-slate-300 hover:text-slate-500 text-xs transition-colors">
            Admin
          </Link>
        </div>

      </main>
    </div>
  )
}
