'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FlagIcon } from '@/components/TeamFlag'

type MatchResult = 'G1' | 'E' | 'G2'

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
  isoCode: string
}

interface Prediction {
  id: string
  matchId: string
  predictedTeam1Goals: number
  predictedTeam2Goals: number
  predictedResult: MatchResult
  match: {
    id: string
    matchNumber: number
    group: string
    kickoffUtc: string
    team1: Team
    team2: Team
  }
}

const RESULT_LABEL: Record<MatchResult, string> = { G1: 'Gana local', E: 'Empate', G2: 'Gana visitante' }
const RESULT_COLOR: Record<MatchResult, string> = {
  G1: 'text-green-600',
  E: 'text-amber-600',
  G2: 'text-blue-600',
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function RevisionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    loadData()
  }, [code])

  const loadData = async () => {
    const [predRes, pRes] = await Promise.all([
      fetch(`/api/predictions?code=${code}`),
      fetch(`/api/participants?code=${code}`),
    ])
    if (predRes.ok) {
      const data = await predRes.json()
      setPredictions(data.predictions ?? [])
      setIsComplete(data.isComplete)
    }
    if (pRes.ok) {
      const data = await pRes.json()
      setParticipantName(data.participant?.fullName ?? '')
    }
    setLoading(false)
  }

  const handleConfirm = async () => {
    setConfirming(true)
    setError('')
    try {
      const predictionsArr = predictions.map((p) => ({
        matchId: p.matchId,
        predictedTeam1Goals: p.predictedTeam1Goals,
        predictedTeam2Goals: p.predictedTeam2Goals,
      }))
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationCode: code, predictions: predictionsArr, confirm: true }),
      })
      if (res.ok) {
        router.push(`/pago/${code}`)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Error al confirmar')
      }
    } catch {
      setError('Error de conexión')
    }
    setConfirming(false)
    setShowModal(false)
  }

  const grouped = GROUPS.map((g) => ({
    group: g,
    preds: predictions.filter((p) => p.match.group === g),
  })).filter((g) => g.preds.length > 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚽</div>
          <p className="text-slate-600">Cargando revisión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-200">Revisión de quiniela</p>
              <p className="font-bold text-sm">{participantName || code}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-200">Pronósticos</p>
              <p className="font-bold text-lg text-yellow-300">{predictions.length}/72</p>
            </div>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {[1, 2].map((n) => (
              <span key={n} className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">✓</span>
            ))}
            <div className="flex-1 h-0.5 bg-green-300" />
            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</span>
            <span className="font-medium text-green-700">Revisión</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            {[4, 5].map((n) => (
              <span key={n} className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">{n}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4">
        {isComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-amber-800 text-sm">
            Tu quiniela ya fue confirmada y no puede modificarse.
            <Link href={`/pago/${code}`} className="ml-2 underline font-medium">Ir al pago →</Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-blue-800">
          Revisa todos tus pronósticos antes de confirmar. <strong>Una vez confirmados no podrás cambiarlos.</strong>
        </div>

        {grouped.map(({ group, preds }) => (
          <div key={group} className="mb-4">
            <h3 className="font-bold text-slate-700 mb-2">Grupo {group}</h3>
            <div className="space-y-2">
              {preds.map((pred) => (
                <div key={pred.id} className="bg-white rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-6 text-center shrink-0">#{pred.match.matchNumber}</span>
                    <div className="flex-1 flex items-center gap-1.5 min-w-0">
                      <FlagIcon isoCode={pred.match.team1.isoCode} size="md" />
                      <span className="text-sm font-semibold text-slate-700 truncate">{pred.match.team1.displayName}</span>
                    </div>
                    <span className="font-bold text-slate-800 text-base shrink-0">
                      {pred.predictedTeam1Goals} – {pred.predictedTeam2Goals}
                    </span>
                    <div className="flex-1 flex items-center gap-1.5 justify-end min-w-0">
                      <span className="text-sm font-semibold text-slate-700 truncate text-right">{pred.match.team2.displayName}</span>
                      <FlagIcon isoCode={pred.match.team2.isoCode} size="md" />
                    </div>
                  </div>
                  <div className="mt-1 text-center">
                    <span className={`text-xs font-medium ${RESULT_COLOR[pred.predictedResult]}`}>
                      {RESULT_LABEL[pred.predictedResult]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      {!isComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-20">
          <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
            <Link
              href={`/quiniela/${code}`}
              className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl text-center hover:bg-slate-50 transition-colors text-sm"
            >
              ← Editar
            </Link>
            <button
              onClick={() => setShowModal(true)}
              disabled={predictions.length < 72}
              className={`flex-1 font-bold py-3 rounded-xl transition-colors text-sm ${
                predictions.length >= 72
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              Confirmar quiniela ✓
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl mb-4 sm:mb-0">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="font-bold text-lg text-slate-800">¿Confirmar quiniela?</h3>
              <p className="text-slate-500 text-sm mt-2">
                Una vez confirmada, <strong>no podrás modificar tus pronósticos</strong>. ¿Estás seguro?
              </p>
            </div>
            {error && <div className="text-red-600 text-sm mb-3 text-center">{error}</div>}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60"
              >
                {confirming ? 'Confirmando...' : 'Sí, confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
