'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Users, Clock, Star, CheckCircle, HelpCircle, ChevronDown, ChevronUp, Share2, Zap, Shield, BarChart2 } from 'lucide-react'

const TOURNAMENT_START = new Date('2026-06-11T19:00:00Z') // June 11 3PM VET = 7PM UTC

/* ── Countdown ─────────────────────────────────────────────────── */
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const tick = () => {
      const diff = TOURNAMENT_START.getTime() - Date.now()
      if (diff <= 0) { setStarted(true); return }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (started) {
    return (
      <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-5 py-2 text-yellow-200 font-semibold animate-pulse">
        🟢 ¡El torneo ya comenzó!
      </div>
    )
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const units = [
    { label: 'Días',   value: pad(timeLeft.days) },
    { label: 'Horas',  value: pad(timeLeft.hours) },
    { label: 'Min',    value: pad(timeLeft.minutes) },
    { label: 'Seg',    value: pad(timeLeft.seconds) },
  ]

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[80px] text-center shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums leading-none">{value}</span>
          </div>
          <span className="text-[11px] text-green-200 mt-1.5 font-medium tracking-wide">{label}</span>
          {i < 3 && <span className="absolute text-white/60 font-bold text-2xl" style={{ marginTop: '10px', marginLeft: '92px' }} />}
        </div>
      ))}
    </div>
  )
}

/* ── FAQ ────────────────────────────────────────────────────────── */
const faqs = [
  { q: '¿Cómo funciona la quiniela?',
    a: 'Predices el resultado (gana equipo 1, empate, o gana equipo 2) para cada uno de los 72 partidos de la fase de grupos. Cada acierto vale 1 punto. Gana quien acumule más puntos al final de la fase de grupos.' },
  { q: '¿Cuánto cuesta participar?',
    a: 'La inscripción es de 20 USD, pagados en bolívares según la tasa del Euro BCV del día del pago, por Pago Móvil Banesco.' },
  { q: '¿Hasta cuándo puedo inscribirme?',
    a: 'Puedes registrarte hasta el inicio del primer partido: 11 de junio de 2026 a las 3:00 PM hora Venezuela. Después no se aceptan más inscripciones.' },
  { q: '¿Cómo se distribuyen los premios?',
    a: '65% para el 1er lugar, 20% para el 2do lugar, 15% para la organización.' },
  { q: '¿Qué pasa si hay empate en puntos?',
    a: 'Se desempata por: 1) Mayor número de predicciones exactas, 2) Mayor efectividad porcentual, 3) Orden de inscripción.' },
  { q: '¿Puedo ver la quiniela de otros participantes?',
    a: 'Sí, después del cierre de inscripciones el administrador puede habilitar la vista pública de todas las quinielas.' },
  { q: '¿Los horarios están en hora Venezuela?',
    a: 'Sí, todos los partidos se muestran en hora Venezuela (UTC-4, sin horario de verano).' },
  { q: '¿Puedo modificar mi quiniela después de enviarla?',
    a: 'No. Una vez confirmada, la quiniela queda bloqueada permanentemente para garantizar la transparencia del concurso.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-50 transition-colors"
          >
            <span className="text-slate-800">{faq.q}</span>
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

/* ── Steps ──────────────────────────────────────────────────────── */
const steps = [
  { icon: '📝', title: 'Regístrate',           desc: 'Nombre, cédula y teléfono' },
  { icon: '⚽', title: 'Llena tu quiniela',     desc: 'Predice los 72 partidos' },
  { icon: '✅', title: 'Confirma',               desc: 'Revisa y confirma. Queda bloqueada' },
  { icon: '📱', title: 'Paga',                   desc: 'Pago Móvil Banesco · 20 USD en Bs.' },
  { icon: '📷', title: 'Reporta el pago',        desc: 'Ingresa la referencia de pago' },
  { icon: '⏳', title: 'Verificación',           desc: 'El admin confirma tu participación' },
  { icon: '📊', title: 'Sigue el ranking',       desc: 'Ve tu posición en tiempo real' },
  { icon: '🏆', title: '¡Gana!',                desc: 'El mejor quinielero gana el 65%' },
]

/* ── AnimatedNumber ─────────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = target / 40
      const id = setInterval(() => {
        start = Math.min(start + step, target)
        setVal(Math.round(start))
        if (start >= target) clearInterval(id)
      }, 30)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function Home() {
  const [shareUrl, setShareUrl] = useState("https://quiniela2026.ve")
  useEffect(() => { setShareUrl(window.location.origin) }, [])
  const shareMsg = `🏆⚽ ¡Participa en la Quiniela del Mundial 2026!\nPredice los 72 partidos y compite por el premio.\n👉 ${shareUrl}`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden text-white" style={{ minHeight: '600px' }}>

        {/* Hero image — desktop */}
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src="/assets/hero/hero-desktop.webp"
            alt="Quiniela Mundial 2026 — jugadores internacionales"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Hero image — mobile */}
        <div className="absolute inset-0 block sm:hidden">
          <Image
            src="/assets/hero/hero-mobile.webp"
            alt="Quiniela Mundial 2026"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Multi-layer overlay for text legibility without killing the image */}
        {/* Radial dark center for text area */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_40%,rgba(0,0,0,0.55)_0%,transparent_100%)]" />
        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        {/* Subtle color tint for brand coherence */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-blue-900/20" />

        {/* Content — centered in the dark middle zone of the image */}
        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-20 text-center flex flex-col items-center">

          {/* Host badge */}
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6 shadow-lg">
            <span>🇲🇽 🇺🇸 🇨🇦</span>
            <span className="text-white/90">México · EE.UU. · Canadá 2026</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-[1.05] tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)' }}>
            Quiniela{' '}
            <span className="text-yellow-300"
                  style={{ textShadow: '0 0 30px rgba(251,191,36,0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>
              Mundial 2026
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 mb-8 max-w-lg mx-auto leading-relaxed"
             style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Predice los <strong className="text-yellow-300 font-bold">72 partidos</strong> de la fase de grupos,
            compite con tus amigos y gana el pozo acumulado.
          </p>

          {/* Countdown */}
          <div className="mb-8 w-full">
            <p className="text-white/60 text-[11px] font-medium uppercase tracking-widest mb-3">
              ⏱ Tiempo para el primer partido
            </p>
            <Countdown />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none">
            <Link
              href="/registro"
              className="group relative bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base sm:text-lg transition-all shadow-2xl hover:shadow-yellow-400/40 hover:-translate-y-1 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">⚽</span>
              Crear mi quiniela
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400">
                20 USD
              </span>
            </Link>
            <Link
              href="/ranking"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all inline-flex items-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              🏆 Ver ranking
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-6 flex items-center gap-4 text-white/50 text-xs">
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Pago Móvil Banesco</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Bolívares tasa Euro BCV</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1"><span className="text-green-400">✓</span> Ranking en tiempo real</span>
          </div>
        </div>

        {/* Bottom wave */}
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
            { value: 72,   suffix: '',    label: 'Partidos',      color: 'text-green-600' },
            { value: 12,   suffix: '',    label: 'Grupos',         color: 'text-blue-600' },
            { value: 48,   suffix: '',    label: 'Equipos',        color: 'text-purple-600' },
            { value: 20,   suffix: ' USD', label: 'Inscripción',   color: 'text-yellow-600' },
            { value: 65,   suffix: '%',   label: 'Premio 1er lugar', color: 'text-amber-600' },
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

        {/* ── HOW TO PARTICIPATE ──────────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Proceso</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              ¿Cómo <span className="text-green-600">participar?</span>
            </h2>
            <p className="text-slate-500 mt-2">En 5 pasos simples, completa tu quiniela y compite por el premio.</p>
          </div>

          {/* Steps — 5 cards in a row on desktop, 2-3 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                num: 1,
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                ),
                title: 'Regístrate',
                desc: 'Nombre, cédula y WhatsApp.',
                color: 'text-green-600',
                bg: 'bg-green-50',
                border: 'border-green-200',
              },
              {
                num: 2,
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                ),
                title: 'Llena tu quiniela',
                desc: 'Predice los 72 marcadores.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
              },
              {
                num: 3,
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                  </svg>
                ),
                title: 'Paga y reporta',
                desc: 'Pago Móvil + referencia.',
                note: 'Tu pago será revisado por el administrador.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                border: 'border-purple-200',
              },
              {
                num: 4,
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                title: 'Sigue el ranking',
                desc: 'Mira tu posición en vivo.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
              },
              {
                num: 5,
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 21h8M12 21v-4M5 3h14l-2 9H7L5 3zM7 12a5 5 0 0 0 10 0"/>
                  </svg>
                ),
                title: 'Gana',
                desc: 'El mejor puntaje gana el premio.',
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
              },
            ].map((step, i, arr) => (
              <div key={step.num} className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center group">
                {/* Card */}
                <div className={`relative flex-1 lg:w-full bg-white rounded-2xl p-5 lg:p-6 shadow-sm border ${step.border} hover:shadow-md transition-all`}>
                  {/* Number badge */}
                  <div className={`absolute -top-3 -left-3 lg:left-1/2 lg:-translate-x-1/2 w-7 h-7 ${step.bg} border-2 ${step.border} ${step.color} text-sm font-extrabold rounded-full flex items-center justify-center shadow-sm`}>
                    {step.num}
                  </div>
                  {/* Icon */}
                  <div className={`${step.color} mb-3 mt-1`}>{step.icon}</div>
                  {/* Text */}
                  <div className="font-bold text-slate-800 text-sm mb-1">{step.title}</div>
                  <div className="text-xs text-slate-500 leading-snug">{step.desc}</div>
                  {step.note && (
                    <div className="mt-2 text-[11px] text-slate-400 italic leading-tight">{step.note}</div>
                  )}
                </div>
                {/* Connector arrow (desktop only, between cards) */}
                {i < arr.length - 1 && (
                  <div className="hidden lg:flex absolute items-center justify-center" style={{ left: `calc(${(i + 1) * 20}% - 10px)`, top: '50%', transform: 'translateY(-50%)' }}>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connector line — desktop only */}
          <div className="hidden lg:flex items-center justify-between mt-2 px-12 pointer-events-none select-none">
            {[1,2,3,4].map((n) => (
              <div key={n} className="flex-1 flex items-center">
                <div className="flex-1 h-px border-t-2 border-dashed border-slate-200" />
                <svg className="w-3 h-3 text-slate-300 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M4 2l4 4-4 4"/>
                </svg>
              </div>
            ))}
          </div>

          {/* CTA under steps */}
          <div className="text-center mt-8">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 text-sm"
            >
              ⚽ Empezar ahora · 20 USD
            </Link>
          </div>
        </section>

        {/* ── PRIZES ──────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Premios</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Tabla de <span className="text-yellow-600">Premios</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
            {/* Header gradient */}
            <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white p-8 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'url(/assets/hero/football-pattern.svg)', backgroundSize: '100px' }} />
              <div className="relative">
                <p className="text-green-200 text-sm mb-2">Pozo estimado · 20 participantes</p>
                <p className="text-5xl font-extrabold text-white drop-shadow">$400 <span className="text-2xl font-bold text-green-200">USD</span></p>
                <p className="text-green-300 text-xs mt-2">20 participantes × $20 USD = $400 USD</p>
              </div>
            </div>
            {/* Prize rows */}
            <div className="divide-y divide-slate-100">
              {[
                { medal: '🥇', pos: '1er Lugar', pct: 65, ex: 260, color: 'from-yellow-50 to-amber-50', badge: 'bg-yellow-100 text-yellow-800' },
                { medal: '🥈', pos: '2do Lugar', pct: 20, ex: 80,  color: 'from-slate-50 to-slate-50',  badge: 'bg-slate-100 text-slate-600' },
                { medal: '🏛️', pos: 'Organización', pct: 15, ex: 60, color: '', badge: 'bg-blue-50 text-blue-600' },
              ].map((row) => (
                <div key={row.pos} className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${row.color} hover:bg-opacity-80 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{row.medal}</span>
                    <span className="font-bold text-slate-700">{row.pos}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.badge}`}>{row.pct}%</span>
                    <span className="font-extrabold text-lg text-slate-800">${row.ex} USD</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 p-4">
              El pozo real depende del total de participantes con pago verificado.
            </p>
          </div>
        </section>

        {/* ── PAYMENT CARD ────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Pago</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Datos de <span className="text-blue-700">Pago Móvil</span>
            </h2>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { label: 'Banco',    value: 'Banesco',      icon: '🏦' },
                  { label: 'Teléfono', value: '04143043337',  icon: '📞' },
                  { label: 'Cédula',   value: '4.561.947',    icon: '🪪' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-blue-200 text-xs">{label}</div>
                      <div className="font-bold text-base">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Monto',    value: '20 USD',             icon: '💵' },
                  { label: 'Moneda',   value: 'Bolívares',           icon: '🪙' },
                  { label: 'Tasa',     value: 'Euro BCV del día',    icon: '📈' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-blue-200 text-xs">{label}</div>
                      <div className="font-bold text-base">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 bg-yellow-400/20 border border-yellow-300/30 rounded-xl p-3 text-sm text-yellow-100 text-center">
              💡 El monto exacto en bolívares se calcula automáticamente al momento del pago
            </div>
          </div>
        </section>

        {/* ── SCORING ─────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Puntuación</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Sistema de <span className="text-green-600">Puntuación</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Cada acierto vale 1 punto · Máximo 72 puntos</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { pick: 'G1', label: 'Gana el\nEquipo 1', bg: 'bg-green-600', light: 'bg-green-50 border-green-200', ex: '2-0 · 3-1 · 1-0' },
              { pick: 'E',  label: 'Empate',             bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-200',  ex: '1-1 · 0-0 · 2-2' },
              { pick: 'G2', label: 'Gana el\nEquipo 2', bg: 'bg-blue-600',  light: 'bg-blue-50 border-blue-200',    ex: '0-1 · 1-3 · 0-2' },
            ].map((item) => (
              <div key={item.pick} className={`rounded-2xl p-4 sm:p-5 text-center border-2 ${item.light} hover:shadow-md transition-shadow`}>
                <div className={`${item.bg} text-white font-extrabold text-2xl rounded-xl py-3 mb-4 shadow-sm`}>{item.pick}</div>
                <div className="font-bold text-slate-700 text-sm whitespace-pre-line mb-2">{item.label}</div>
                <div className="text-slate-400 text-xs">{item.ex}</div>
                <div className="mt-3 inline-flex items-center gap-1 bg-white rounded-full px-3 py-1 border border-slate-200">
                  <Zap size={12} className="text-green-500" />
                  <span className="text-green-600 font-extrabold text-sm">1 punto</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Plataforma</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Todo lo que <span className="text-purple-600">necesitas</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Trophy size={22} className="text-yellow-600" />, bg: 'bg-yellow-50', title: 'Ranking en tiempo real', desc: 'Ve tu posición actualizada después de cada partido jugado.' },
              { icon: <Users size={22} className="text-blue-600" />,   bg: 'bg-blue-50',   title: 'Quinielas comparables',  desc: 'Compara tu estrategia con otros participantes después del cierre.' },
              { icon: <Clock size={22} className="text-green-600" />,  bg: 'bg-green-50',  title: 'Hora Venezuela',          desc: 'Todos los horarios en VET (UTC-4). Sin confusiones de zona horaria.' },
              { icon: <BarChart2 size={22} className="text-purple-600" />, bg: 'bg-purple-50', title: 'Estadísticas completas', desc: 'Efectividad, pronósticos populares, líderes, tendencias.' },
              { icon: <Shield size={22} className="text-red-600" />,   bg: 'bg-red-50',    title: 'Transparencia total',     desc: 'Auditoría anti-trampa. Hash de confirmación. Logs de cambios.' },
              { icon: <Star size={22} className="text-amber-600" />,   bg: 'bg-amber-50',  title: 'Soporte WhatsApp',        desc: 'Contacta al administrador directamente para cualquier duda.' },
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

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Dudas</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Preguntas <span className="text-green-600">Frecuentes</span>
            </h2>
          </div>
          <FAQ />
          <div className="text-center mt-6">
            <Link href="/faq" className="text-green-600 hover:text-green-700 text-sm font-semibold underline underline-offset-2">
              Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </section>

        {/* ── QUICK LINKS ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { href: '/ranking',    icon: '🏆', label: 'Ranking',     color: 'hover:border-yellow-400' },
            { href: '/resultados', icon: '⚽', label: 'Resultados',  color: 'hover:border-green-400' },
            { href: '/reglas',     icon: '📋', label: 'Reglas',      color: 'hover:border-blue-400' },
            { href: '/faq',        icon: '❓', label: 'FAQ',         color: 'hover:border-purple-400' },
          ].map(({ href, icon, label, color }) => (
            <Link key={href} href={href}
              className={`bg-white border-2 border-slate-200 ${color} rounded-2xl py-5 font-semibold text-slate-700 hover:text-slate-900 transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <span className="text-3xl block mb-2">{icon}</span>
              {label}
            </Link>
          ))}
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-blue-700 rounded-3xl p-10 text-white text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'url(/assets/hero/football-pattern.svg)', backgroundSize: '120px' }} />
          <div className="relative">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¡El torneo comienza el 11 de junio!</h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">Regístrate ahora y no pierdas la oportunidad de ganar el pozo acumulado.</p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-10 py-4 rounded-2xl text-lg transition-all shadow-xl hover:shadow-yellow-400/40 hover:shadow-2xl hover:-translate-y-1"
            >
              ⚽ Crear mi quiniela — 20 USD
            </Link>
            <p className="text-green-200 text-xs mt-4">Pago Móvil Banesco · Bolívares a tasa Euro BCV</p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-semibold text-white mb-1">Quiniela Mundial 2026 🏆</p>
          <p className="text-xs mb-4">Pago Móvil Banesco · 04143043337 · CI 4561947 · Tasa Euro BCV</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
            {[
              { href: '/registro',    label: 'Participar' },
              { href: '/ranking',     label: 'Ranking' },
              { href: '/resultados',  label: 'Resultados' },
              { href: '/estadisticas',label: 'Estadísticas' },
              { href: '/reglas',      label: 'Reglas' },
              { href: '/faq',         label: 'FAQ' },
              { href: '/admin',       label: 'Admin' },
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
