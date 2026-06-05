'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatMatchDate, formatMatchTime } from '@/lib/timezone'
import { AlertCircle, Save, ArrowRight, CheckCircle, Minus, Plus } from 'lucide-react'
import TeamFlag from '@/components/TeamFlag'

interface Team {
  id: string
  displayName: string
  flagEmoji: string
  isoCode: string
  shortName: string
}

interface Match {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  team1: Team
  team2: Team
  status: string
}

interface ScorePick {
  team1Goals: number
  team2Goals: number
}

type Picks = Record<string, ScorePick>

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function GoalStepper({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled: boolean
}) {
  const handleManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (!isNaN(n) && n >= 0 && n <= 20) onChange(n)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled || value === 0}
        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-slate-700 transition-colors"
        type="button"
      >
        <Minus size={12} />
      </button>
      <input
        type="number"
        min={0}
        max={20}
        value={value}
        onChange={handleManual}
        disabled={disabled}
        className="w-9 h-8 text-center text-lg font-bold text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-green-500 disabled:bg-slate-50 disabled:text-slate-400"
      />
      <button
        onClick={() => !disabled && onChange(Math.min(20, value + 1))}
        disabled={disabled || value === 20}
        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-slate-700 transition-colors"
        type="button"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

function MatchCard({
  match,
  pick,
  onPick,
  locked,
}: {
  match: Match
  pick: ScorePick | undefined
  onPick: (matchId: string, score: ScorePick) => void
  locked: boolean
}) {
  const kickoff = new Date(match.kickoffUtc)
  const dateStr = formatMatchDate(kickoff)
  const timeStr = formatMatchTime(kickoff)

  const current = pick ?? { team1Goals: 0, team2Goals: 0 }
  const hasPick = pick !== undefined

  const result =
    current.team1Goals > current.team2Goals ? '1' :
    current.team1Goals < current.team2Goals ? '2' : 'X'

  const resultColor =
    result === '1' ? 'text-green-600' :
    result === '2' ? 'text-blue-600' : 'text-amber-600'

  return (
    <div className={`bg-white rounded-xl border p-3 transition-all ${hasPick ? 'border-green-300 shadow-sm' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-slate-400">Partido #{match.matchNumber}</span>
        <span className="text-xs text-slate-500">{dateStr} · {timeStr} VET</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Team 1 */}
        <div className="flex-1 min-w-0">
          <div className="mb-1.5">
            <TeamFlag isoCode={match.team1.isoCode} displayName={match.team1.displayName} size="md" side="left" />
          </div>
          <GoalStepper
            value={current.team1Goals}
            onChange={(v) => onPick(match.id, { ...current, team1Goals: v })}
            disabled={locked}
          />
        </div>

        {/* VS / Result indicator */}
        <div className="flex flex-col items-center shrink-0 px-1">
          <span className="text-xs text-slate-400 mb-1">vs</span>
          {hasPick && (
            <span className={`text-xs font-bold ${resultColor}`}>
              {result === '1' ? match.team1.shortName : result === '2' ? match.team2.shortName : 'Empate'}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <div className="mb-1.5 flex justify-end">
            <TeamFlag isoCode={match.team2.isoCode} displayName={match.team2.displayName} size="md" side="right" />
          </div>
          <GoalStepper
            value={current.team2Goals}
            onChange={(v) => onPick(match.id, { ...current, team2Goals: v })}
            disabled={locked}
          />
        </div>
      </div>

      {/* Score preview */}
      {hasPick && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Pronóstico:</span>
          <span className="text-sm font-bold text-slate-700">
            {match.team1.shortName} {current.team1Goals} – {current.team2Goals} {match.team2.shortName}
          </span>
        </div>
      )}
    </div>
  )
}

export default function QuinielaPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [picks, setPicks] = useState<Picks>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [activeGroup, setActiveGroup] = useState('A')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const loadData = async () => {
    try {
      const [predRes, matchRes] = await Promise.all([
        fetch(`/api/predictions?code=${code}`),
        fetch('/api/results'),
      ])

      if (!predRes.ok) {
        setError('Código de participación inválido')
        setLoading(false)
        return
      }

      const predData = await predRes.json()
      const matchData = await matchRes.json()

      setMatches(matchData.matches ?? [])
      setIsLocked(predData.isComplete)

      const existingPicks: Picks = {}
      for (const pred of (predData.predictions ?? [])) {
        existingPicks[pred.matchId] = {
          team1Goals: pred.predictedTeam1Goals,
          team2Goals: pred.predictedTeam2Goals,
        }
      }

      const stored = localStorage.getItem(`picks_${code}`)
      if (stored && !predData.isComplete) {
        const storedPicks = JSON.parse(stored)
        setPicks({ ...existingPicks, ...storedPicks })
      } else {
        setPicks(existingPicks)
      }

      const pRes = await fetch(`/api/participants?code=${code}`)
      if (pRes.ok) {
        const pData = await pRes.json()
        setParticipantName(pData.participant?.fullName ?? '')
      }
    } catch {
      setError('Error al cargar los datos')
    }
    setLoading(false)
  }

  const handlePick = (matchId: string, score: ScorePick) => {
    const newPicks = { ...picks, [matchId]: score }
    setPicks(newPicks)
    localStorage.setItem(`picks_${code}`, JSON.stringify(newPicks))
  }

  const savePicks = async () => {
    setSaving(true)
    try {
      const predictionsArr = Object.entries(picks).map(([matchId, score]) => ({
        matchId,
        predictedTeam1Goals: score.team1Goals,
        predictedTeam2Goals: score.team2Goals,
      }))
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationCode: code, predictions: predictionsArr }),
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      }
    } catch {
      setError('Error al guardar')
    }
    setSaving(false)
  }

  const goToRevision = async () => {
    if (completedCount < matches.length) {
      alert(`Debes completar todos los partidos. Te faltan ${matches.length - completedCount} pronósticos.`)
      return
    }
    await savePicks()
    router.push(`/revision/${code}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚽</div>
          <p className="text-slate-600">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm w-full">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Link href="/registro" className="text-green-600 hover:underline">Ir al registro</Link>
        </div>
      </div>
    )
  }

  const completedCount = Object.keys(picks).length
  const totalMatches = matches.length
  const pct = totalMatches > 0 ? Math.round((completedCount / totalMatches) * 100) : 0

  const groupMatches = (group: string) => matches.filter((m) => m.group === group)

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-green-200">Quiniela de</p>
              <p className="font-bold text-sm truncate max-w-[160px]">{participantName || code}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-200">Marcadores</p>
              <p className="font-bold text-lg text-yellow-300">{completedCount}/{totalMatches}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-green-100 mt-1 text-right">{pct}% completado</p>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">✓</span>
            <span className="text-slate-400">Registro</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span className="font-medium text-green-700">Pronósticos</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            {[3, 4, 5].map((n) => (
              <span key={n} className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">{n}</span>
            ))}
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-amber-800 text-sm">
            <CheckCircle size={16} />
            <span>Tu quiniela está confirmada y bloqueada. <Link href={`/mi-quiniela/${code}`} className="underline font-medium">Ver mi quiniela →</Link></span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 mt-4">
        {/* Scoring info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-blue-800 mb-1.5">Sistema de puntuación:</p>
          <div className="flex gap-4 text-xs text-blue-700">
            <span>🎯 <strong>3 pts</strong> — Marcador exacto</span>
            <span>✅ <strong>1 pt</strong> — Resultado correcto</span>
            <span>❌ <strong>0 pts</strong> — Incorrecto</span>
          </div>
        </div>

        {/* Group tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {GROUPS.map((g) => {
            const gMatches = groupMatches(g)
            const gCompleted = gMatches.filter((m) => picks[m.id] !== undefined).length
            const allDone = gCompleted === gMatches.length && gMatches.length > 0
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  activeGroup === g
                    ? 'bg-green-600 text-white shadow-sm'
                    : allDone
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {g}
                {allDone && activeGroup !== g && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-white text-[8px] flex items-center justify-center">✓</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Matches for active group */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-700">Grupo {activeGroup}</h3>
            <span className="text-xs text-slate-400">
              {groupMatches(activeGroup).filter((m) => picks[m.id] !== undefined).length} / {groupMatches(activeGroup).length} completados
            </span>
          </div>
          {groupMatches(activeGroup).map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              pick={picks[match.id]}
              onPick={handlePick}
              locked={isLocked}
            />
          ))}
        </div>

        {/* Scoring legend */}
        <div className="mt-6 bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-600 mb-2">Desempate (en caso de igualdad de puntos):</p>
          <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
            <li>Mayor cantidad de marcadores exactos</li>
            <li>Mayor cantidad de resultados correctos</li>
            <li>Menor error acumulado de goles</li>
          </ol>
        </div>
      </div>

      {/* Bottom action bar */}
      {!isLocked && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-20">
          <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
            <button
              onClick={savePicks}
              disabled={saving || completedCount === 0}
              className="flex-1 border border-green-600 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Save size={16} />
              {saving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar'}
            </button>
            <button
              onClick={goToRevision}
              disabled={saving}
              className={`flex-1 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                completedCount === totalMatches
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              Revisar <ArrowRight size={16} />
              {completedCount < totalMatches && (
                <span className="text-xs ml-1">({totalMatches - completedCount} faltantes)</span>
              )}
            </button>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-20">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <Link
              href={`/pago/${code}`}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Ir al pago <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
