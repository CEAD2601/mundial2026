import type { Metadata } from 'next'
import NavBar from './NavBar'

export const metadata: Metadata = {
  title: 'Quiniela Eliminatorias 2026',
  description: 'Quiniela oficial de la fase eliminatoria del Mundial 2026',
}

export default function EliminatoriasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
