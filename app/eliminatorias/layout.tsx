import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quiniela Eliminatorias 2026',
  description: 'Quiniela oficial de la fase eliminatoria del Mundial 2026',
}

export default function EliminatoriasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-gradient-to-r from-green-800 to-green-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/eliminatorias" className="font-extrabold text-lg tracking-tight">
          ⚽ Quiniela Eliminatorias 2026
        </Link>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/eliminatorias/ranking"    className="hover:text-green-200 transition-colors">Ranking</Link>
          <Link href="/eliminatorias/resultados" className="hover:text-green-200 transition-colors">Resultados</Link>
          <Link href="/eliminatorias/mi-quiniela" className="hover:text-green-200 transition-colors">Mi quiniela</Link>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
