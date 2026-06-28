'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',                          icon: '🏠', label: 'Inicio' },
  { href: '/eliminatorias/registro',    icon: '⚽', label: 'Inscripción' },
  { href: '/eliminatorias/mi-quiniela', icon: '📋', label: 'Mi quiniela' },
  { href: '/eliminatorias/ranking',     icon: '🏆', label: 'Ranking' },
  { href: '/eliminatorias/resultados',  icon: '📊', label: 'Resultados' },
]

export default function NavBar() {
  const path = usePathname()

  return (
    <div className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md">
      {/* Top brand bar */}
      <div className="px-4 py-2 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="font-extrabold text-base tracking-tight flex items-center gap-2">
          <span>⚽</span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold text-green-300 uppercase tracking-widest leading-none">Quiniela</span>
            <span className="text-sm font-extrabold">Eliminatorias 2026</span>
          </span>
        </Link>
        <Link href="/eliminatorias/registro"
          className="text-xs font-bold bg-yellow-400 text-slate-900 px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors touch-manipulation">
          Participar
        </Link>
      </div>

      {/* Icon tab bar */}
      <div className="overflow-x-auto scrollbar-none border-t border-green-600/40">
        <div className="flex min-w-max px-2 max-w-3xl mx-auto">
          {TABS.map(tab => {
            const isActive = tab.href === '/'
              ? path === '/'
              : path.startsWith(tab.href)
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 text-center transition-colors min-w-[64px] touch-manipulation ${
                  isActive
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-green-300 hover:text-white border-b-2 border-transparent'
                }`}>
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[10px] font-semibold whitespace-nowrap leading-none">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
