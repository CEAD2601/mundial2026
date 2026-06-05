'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FlagIcon } from '@/components/TeamFlag'

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
  isoCode: string
}

interface Match {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  status: string
  result: string | null
  team1Goals: number | null
  team2Goals: number | null
  team1: Team
  team2: Team
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function ResultadosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  useEffect(() => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((data) => setMatches(data.matches ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = matches.filter((m) => {
    const groupOk = activeGroup === 'todos' || m.group === activeGroup
    const statusOk = statusFilter === 'todos' ||
      (statusFilter === 'FINISHED' && m.status === 'FINISHED') ||
      (statusFilter === 'upcoming' && m.status !== 'FINISHED')
    return groupOk && statusOk
  })

  const finishedCount = matches.filter((m) => m.status === 'FINISHED').length

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">⚽ Resultados</h1>
          <p className="text-green-200 text-sm">{finishedCount} de {matches.length} partidos jugados</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 mb-4">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {['todos', ...GROUPS].map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeGroup === g ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g === 'todos' ? 'Todos' : `Grupo ${g}`}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'FINISHED', label: 'Jugados' },
              { value: 'upcoming', label: 'Próximos' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  statusFilter === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando partidos...</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((match) => {
              const isFinished = match.status === 'FINISHED'
              const kickoff = new Date(match.kickoffUtc)
              return (
                <div
                  key={match.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 ${
                    isFinished ? 'border-green-100' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Grupo {match.group} · #{match.matchNumber}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isFinished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isFinished ? 'Finalizado' : kickoff.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <FlagIcon isoCode={match.team1.isoCode} size="lg" />
                      <span className="font-semibold text-slate-800 text-sm">{match.team1.displayName}</span>
                    </div>

                    {isFinished ? (
                      <div className="text-center shrink-0">
                        <div className="flex items-center gap-2 bg-slate-800 text-white rounded-lg px-4 py-1.5">
                          <span className="text-xl font-bold">{match.team1Goals}</span>
                          <span className="text-slate-400">—</span>
                          <span className="text-xl font-bold">{match.team2Goals}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {match.result === 'G1' ? `Gana ${match.team1.shortName}` :
                           match.result === 'G2' ? `Gana ${match.team2.shortName}` : 'Empate'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center shrink-0 px-4">
                        <div className="text-slate-400 font-bold">vs</div>
                        <div className="text-xs text-slate-400">
                          {kickoff.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <span className="font-semibold text-slate-800 text-sm text-right">{match.team2.displayName}</span>
                      <FlagIcon isoCode={match.team2.isoCode} size="lg" />
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No hay partidos con estos filtros
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
