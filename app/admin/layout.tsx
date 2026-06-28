'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Emoji constants as JS string escapes (safe on any OS/encoding)
const IC_GLOBE  = '\u{1F310}'  // 🌐
const IC_DOOR   = '\u{1F6AA}'  // 🚪

const NAV = [
  { href: '/admin',               icon: '\u{1F4CA}', label: 'Dashboard' },
  { href: '/admin/participantes', icon: '\u{1F465}', label: 'Participantes' },
  { href: '/admin/pagos',         icon: '\u{1F4B3}', label: 'Pagos' },
  { href: '/admin/quinielas',     icon: '\u{1F4CB}', label: 'Quinielas' },
  { href: '/admin/resultados',    icon: '\u{26BD}',  label: 'Resultados' },
  { href: '/admin/ranking',       icon: '\u{1F3C6}', label: 'Ranking' },
  { href: '/admin/pools',         icon: '\u{1F3B1}', label: 'Quiniela' },
  { href: '/admin/backups',       icon: '\u{1F4BE}', label: 'Backups' },
  { href: '/admin/configuracion', icon: '\u{2699}\u{FE0F}', label: 'Configuración' },
  { href: '/admin/analytics',     icon: '\u{1F4CA}', label: 'Analíticas' },
  { href: '/admin/eliminatorias',                    icon: '\u{26A1}',  label: 'Eliminatorias 2026' },
  { href: '/admin/prototipo-eliminatorias-avanzado', icon: '\u{1F9EA}', label: 'Prototipo (ref.)' },
]

function NavLinks({ onSelect }: { onSelect?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {NAV.map(({ href, icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onSelect}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-green-600 text-white'
                : 'hover:bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </Link>
        )
      })}
      <div className="border-t border-slate-700 pt-2 mt-2">
        <Link
          href="/"
          onClick={onSelect}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <span className="text-base">{IC_GLOBE}</span>
          Ver sitio
        </Link>
      </div>
    </>
  )
}

// ── STAGE TYPES ──────────────────────────────────────────────────────────────
export type AdminPhase = 'group_stage' | 'knockout_round_32' | 'knockout_round_16_to_final'

const PHASES: { key: AdminPhase; label: string; short: string; status: string }[] = [
  { key: 'group_stage',                label: 'Fase de Grupos',   short: 'Grupos',       status: 'Histórico'    },
  { key: 'knockout_round_32',          label: 'Dieciseisavos',    short: 'Dieciseisavos', status: 'Activa'      },
  { key: 'knockout_round_16_to_final', label: 'Octavos a Final',  short: 'Octavos+',     status: 'Próximamente' },
]

const PHASE_COLORS: Record<AdminPhase, string> = {
  group_stage:                'bg-slate-600',
  knockout_round_32:          'bg-green-600',
  knockout_round_16_to_final: 'bg-blue-600',
}

function StageBannerInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()
  const phase = (searchParams.get('phase') ?? 'group_stage') as AdminPhase
  const current = PHASES.find(p => p.key === phase) ?? PHASES[0]

  const navigate = (key: AdminPhase) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('phase', key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-slate-800 text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PHASE_COLORS[phase]}`}>
          {current.status}
        </span>
        <span className="text-xs text-slate-300 font-medium hidden sm:inline">Etapa:</span>
      </div>
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {PHASES.map(p => (
          <button
            key={p.key}
            onClick={() => navigate(p.key)}
            className={`shrink-0 text-xs px-3 py-1 rounded-lg font-semibold transition-colors border ${
              phase === p.key
                ? 'bg-white text-slate-900 border-white'
                : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function StageBanner() {
  return (
    <Suspense fallback={<div className="bg-slate-800 h-10" />}>
      <StageBannerInner />
    </Suspense>
  )
}

function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter()
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    onLogout?.()
    router.push('/admin/login')
    router.refresh()
  }
  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
    >
      <span className="text-base">{IC_DOOR}</span>
      Cerrar sesión
    </button>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Auth is now handled server-side by middleware.ts — just mark as checked
  useEffect(() => {
    setAuthChecked(true)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Don't render admin chrome until auth is verified (prevents flash)
  if (!authChecked) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><span className="text-slate-400 text-sm">Verificando acceso...</span></div>
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ──────────────────── */}
      <aside className="hidden md:flex w-56 bg-slate-900 text-white flex-col min-h-screen fixed top-0 left-0 bottom-0 z-30">
        <div className="p-4 border-b border-slate-700">
          <div className="text-lg font-bold">{'\u{26BD}'} Admin</div>
          <div className="text-xs text-slate-400">Mundial 2026 · v2.6</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-slate-700">
          <LogoutButton />
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ──────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="font-bold text-base">{'\u{26BD}'} Admin · Mundial 2026</div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-xl leading-none"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </header>

      {/* ── MOBILE DRAWER BACKDROP ──────────────────────────────── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER PANEL ─────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">{'\u{26BD}'} Admin</div>
            <div className="text-xs text-slate-400">Mundial 2026</div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white text-xl leading-none"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <NavLinks onSelect={() => setDrawerOpen(false)} />
        </nav>
        <div className="p-3 border-t border-slate-700">
          <LogoutButton onLogout={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="md:ml-56 min-h-screen overflow-x-hidden">
        <StageBanner />
        {children}
      </main>

    </div>
  )
}
