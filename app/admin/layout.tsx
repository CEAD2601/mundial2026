import Link from 'next/link'
import AdminLogoutButton from './LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col min-h-screen fixed top-0 left-0 bottom-0 z-30">
        <div className="p-4 border-b border-slate-700">
          <div className="text-lg font-bold">⚽ Admin</div>
          <div className="text-xs text-slate-400">Mundial 2026</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/admin/participantes" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            👥 Participantes
          </Link>
          <Link href="/admin/pagos" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            💳 Pagos
          </Link>
          <Link href="/admin/quinielas" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            📋 Quinielas
          </Link>
          <Link href="/admin/resultados" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            ⚽ Resultados
          </Link>
          <Link href="/admin/ranking" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            🏆 Ranking
          </Link>
          <Link href="/admin/configuracion" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            ⚙️ Configuración
          </Link>
          <div className="border-t border-slate-700 pt-2 mt-2">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400">
              🌐 Ver sitio
            </Link>
          </div>
        </nav>
        <div className="p-3 border-t border-slate-700">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
