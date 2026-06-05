'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { FlagIcon } from '@/components/TeamFlag'

type MatchResult = 'G1' | 'E' | 'G2'

interface Prediction {
  id: string
  matchId: string
  predictedTeam1Goals: number
  predictedTeam2Goals: number
  predictedResult: MatchResult
  isExactScore: boolean | null
  isCorrectResult: boolean | null
  points: number
  match: {
    id: string
    matchNumber: number
    group: string
    status: string
    result: MatchResult | null
    team1Goals: number | null
    team2Goals: number | null
    team1: { displayName: string; flagEmoji: string; shortName: string; isoCode: string }
    team2: { displayName: string; flagEmoji: string; shortName: string; isoCode: string }
  }
}

interface Participant {
  fullName: string
  participationCode: string
  isComplete: boolean
  payment: { paymentStatus: string } | null
  predictions: Prediction[]
  ranking: {
    totalPoints: number
    currentPosition: number
    exactScores: number
    correctResults: number
    pendingPredictions: number
  } | null
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const STATUS_COLOR: Record<string, string> = {
  VERIFIED: 'bg-green-100 text-green-700',
  IN_REVIEW: 'bg-orange-100 text-orange-700',
  PENDING: 'bg-slate-100 text-slate-500',
  REJECTED: 'bg-red-100 text-red-700',
}
const STATUS_LABEL: Record<string, string> = {
  VERIFIED: 'Verificado',
  IN_REVIEW: 'En revisión',
  PENDING: 'Pendiente',
  REJECTED: 'Rechazado',
}

function getPredStyle(pred: Prediction) {
  if (pred.match.status !== 'FINISHED') return { row: '', badge: 'bg-slate-100 text-slate-500', label: '—' }
  if (pred.isExactScore) return { row: 'bg-green-50', badge: 'bg-green-600 text-white', label: '🎯 +3' }
  if (pred.isCorrectResult) return { row: 'bg-emerald-50', badge: 'bg-emerald-400 text-white', label: '✅ +1' }
  return { row: 'bg-red-50', badge: 'bg-red-400 text-white', label: '❌ 0' }
}

export default function MiQuinielaPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')

  useEffect(() => {
    fetch(`/api/participants?code=${code}`)
      .then((r) => r.json())
      .then((data) => setParticipant(data.participant))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚽</div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">❌</div>
          <p className="text-slate-600 mb-3">Participante no encontrado</p>
          <Link href="/" className="text-green-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const { ranking, predictions } = participant
  const payStatus = participant.payment?.paymentStatus ?? 'PENDING'

  const groupPreds = (group: string) => predictions.filter((p) => p.match.group === group)

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-xs text-green-200">Mi quiniela</p>
          <h1 className="font-bold text-lg">{participant.fullName}</h1>
          <p className="text-green-200 text-sm font-mono">{participant.participationCode}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {ranking ? `#${ranking.currentPosition || '—'}` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Posición</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
            <div className="text-xl font-bold text-green-600">{ranking?.totalPoints ?? 0}</div>
            <div className="text-xs text-slate-400 mt-0.5">Puntos</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
            <div className="text-xl font-bold text-emerald-600">{ranking?.exactScores ?? 0}</div>
            <div className="text-xs text-slate-400 mt-0.5">🎯 Exactos</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{ranking?.correctResults ?? 0}</div>
            <div className="text-xs text-slate-400 mt-0.5">✅ Correctos</div>
          </div>
        </div>

        {/* Payment status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
          <span className="text-sm text-slate-600">Estado del pago</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[payStatus]}`}>
              {STATUS_LABEL[payStatus]}
            </span>
            <Link href={`/pago/${code}`} className="text-xs text-green-600 hover:underline">
              {payStatus === 'PENDING' ? 'Pagar →' : 'Ver →'}
            </Link>
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-700">Mis pronósticos</h2>
              <span className="text-xs text-slate-400">{predictions.length}/72</span>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-green-600 inline-block" />
                <span className="text-slate-500">Marcador exacto (+3)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-emerald-400 inline-block" />
                <span className="text-slate-500">Resultado correcto (+1)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-red-400 inline-block" />
                <span className="text-slate-500">Incorrecto (0)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-slate-100 inline-block" />
                <span className="text-slate-500">Pendiente</span>
              </div>
            </div>
          </div>

          {/* Group tabs */}
          <div className="flex gap-1 p-2 overflow-x-auto">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeGroup === g ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="p-3 space-y-2">
            {groupPreds(activeGroup).length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">No hay pronósticos en este grupo</p>
            ) : (
              groupPreds(activeGroup).map((pred) => {
                const style = getPredStyle(pred)
                const finished = pred.match.status === 'FINISHED'
                return (
                  <div key={pred.id} className={`rounded-lg px-3 py-2.5 border border-transparent transition-colors ${style.row}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-5 shrink-0">#{pred.match.matchNumber}</span>

                      {/* Team 1 */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <FlagIcon isoCode={pred.match.team1.isoCode} size="sm" />
                        <span className="text-xs font-medium text-slate-700 truncate">{pred.match.team1.shortName}</span>
                      </div>

                      {/* Predicted score */}
                      <div className="shrink-0 flex items-center gap-1">
                        <span className="font-bold text-slate-700 text-sm">
                          {pred.predictedTeam1Goals} – {pred.predictedTeam2Goals}
                        </span>
                        {finished && pred.match.team1Goals !== null && (
                          <>
                            <span className="text-slate-300 mx-1">|</span>
                            <span className="text-xs text-slate-500">
                              {pred.match.team1Goals}–{pred.match.team2Goals}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                        <span className="text-xs font-medium text-slate-700 truncate text-right">{pred.match.team2.shortName}</span>
                        <FlagIcon isoCode={pred.match.team2.isoCode} size="sm" />
                      </div>

                      {/* Points badge */}
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/comprobante/${code}`}
            className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl text-center hover:bg-slate-50 transition-colors text-sm"
          >
            Ver comprobante
          </Link>
          <Link
            href="/ranking"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-center transition-colors text-sm"
          >
            Ver ranking
          </Link>
        </div>
      </div>
    </div>
  )
}
