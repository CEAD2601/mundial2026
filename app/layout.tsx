import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'flag-icons/css/flag-icons.min.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Quiniela Mundial 2026 🏆',
    template: '%s | Quiniela Mundial 2026',
  },
  description: 'Predice los 72 partidos de la fase de grupos del Mundial FIFA 2026. Participa con solo 20 USD. Ranking en tiempo real. Pago Móvil Banesco.',
  keywords: ['quiniela', 'mundial 2026', 'FIFA', 'Venezuela', 'pago móvil', 'fútbol'],
  openGraph: {
    title: 'Quiniela Mundial 2026 🏆⚽',
    description: 'Predice los 72 partidos y gana el pozo acumulado. ¡Inscripción 20 USD en bolívares!',
    type: 'website',
    locale: 'es_VE',
    siteName: 'Quiniela Mundial 2026',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiniela Mundial 2026 🏆',
    description: 'Predice los 72 partidos y gana el pozo. ¡20 USD de inscripción!',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}
