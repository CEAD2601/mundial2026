'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Stats = { total: number; verified: number; inReview: number; finished: number; pool: number }

export default function AdminKOPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/ko/participants')
      .then(r => r.json())
      .then(d => {
        const p = d.participants ?? []
        const verified = p.filter((x: { payment?: { paymentStatus: string } }) => x.payment?.paymentStatus === 'VERIFIED').length
        const inReview = p.filter((x: { payment?: { paymentStatus: string } }) => x.payment?.paymentStatus === 'IN_REVIEW').length
        setStats({ total: p.length, verified, inReview, finished: 0, pool: verified * 20 })
      })
  }, [])

  const s = stats ?? { total: 0, verified: 0, inReview: 0, finished: 0, pool: 0 }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Eliminatorias 2026</h1>
        <p className="text-slate-500 text-sm">Panel de administración — Dieciseisavos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
          <div className="text-2xl font-extrabold text-blue-700">{s.total}</div>
          <div className="text-xs text-blue-500 mt-0.5">Inscritos</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-4">
          <div className="text-2xl font-extrabold text-green-700">{s.verified}</div>
          <div className="text-xs text-green-500 mt-0.5">Verificados</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4">
          <div className="text-2xl font-extrabold text-amber-700">{s.inReview}</div>
          <div className="text-xs text-amber-500 mt-0.5">En revisión</div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-4">
          <div className="text-2xl font-extrabold text-purple-700">${s.pool}</div>
          <div className="text-xs text-purple-500 mt-0.5">Premio total</div>
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { href: '/admin/eliminatorias/pagos',         label: '💳 Verificar pagos',    desc: `${s.inReview} en revisión` },
          { href: '/admin/eliminatorias/participantes', label: '👥 Participantes',       desc: `${s.total} inscritos` },
          { href: '/admin/eliminatorias/resultados',    label: '⚽ Ingresar resultados', desc: 'Actualiza picks y ranking' },
          { href: '/admin/eliminatorias/ranking',       label: '🏆 Ranking KO',         desc: `${s.verified} verificados` },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 hover:shadow-md transition-shadow">
            <div className="font-bold text-slate-800">{label}</div>
            <div className="text-sm text-slate-500 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
          ← Volver al admin principal (Fase de Grupos)
        </Link>
        <span className="mx-3 text-slate-200">·</span>
        <a href="/eliminatorias" target="_blank" className="text-sm text-green-600 hover:underline">
          Ver sitio público →
        </a>
      </div>
    </div>
  )
}
