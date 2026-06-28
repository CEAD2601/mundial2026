import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiniela Eliminatorias 2026',
  description: 'Quiniela oficial de la fase eliminatoria del Mundial 2026',
}

export default function EliminatoriasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
