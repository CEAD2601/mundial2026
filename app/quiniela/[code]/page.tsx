'use client'

import { useState, useEffect, useRef, use } from 'react'
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

// ── GoalStepper ────────────────────────────────────────────────────────────

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

// ── MatchCard ──────────────────────────────────────────────────────────────

function MatchCard({
  match,
  pick,
  onPick,
  locked,
  highlight,
}: {
  match: Match
  pick: ScorePick | undefined
  onPick: (matchId: string, score: ScorePick) => void
  locked: boolean
  highlight?: boolean
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
    <div
      className={`bg-white rounded-xl border p-3 transition-all ${
        highlight
          ? 'border-amber-400 shadow-md ring-2 ring-amber-300 ring-offset-1'
          : hasPick
          ? 'border-green-300 shadow-sm'
          : 'border-slate-200'
      }`}
    >
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
        {/* VS */}
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
      {hasPick && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Pron{'ó'}stico:</span>
          <span className="text-sm font-bold text-slate-700">
            {match.team1.shortName} {current.team1Goals} – {current.team2Goals} {match.team2.shortName}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

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
  const [highlightMatchId, setHighlightMatchId] = useState<string | null>(null)
  const [groupCompletedToast, setGroupCompletedToast] = useState<string | null>(null)

  // Ref to scroll to when switching groups
  const matchListRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // Auto-detect when a group just became complete and show toast
  const prevGroupCompleted = useRef<Record<string, boolean>>({})
  useEffect(() => {
    if (!matches.length) return
    for (const g of GROUPS) {
      const gMatches = matches.filter(m => m.group === g)
      const now = gMatches.length > 0 && gMatches.every(m => picks[m.id] !== undefined)
      const was = prevGroupCompleted.current[g] ?? false
      if (now && !was && activeGroup === g) {
        setGroupCompletedToast(g)
        setTimeout(() => setGroupCompletedToast(null), 4000)
      }
      prevGroupCompleted.current[g] = now
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picks, matches])

  const loadData = async () => {
    try {
      const [predRes, matchRes] = await Promise.all([
        fetch(`/api/predictions?code=${code}`),
        fetch('/api/results'),
      ])
      if (!predRes.ok) {
        setError('C\u{F3}digo de participaci\u{F3}n inv\u{E1}lido')
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
      // Initialize group-complete tracking
      prevGroupCompleted.current = {}
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

  const savePicks = async (silent = false) => {
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
      if (res.ok && !silent) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      }
    } catch {
      if (!silent) setError('Error al guardar')
    }
    setSaving(false)
  }

  // ── Group navigation helpers ─────────────────────────────────────────────

  const scrollToMatchList = () => {
    setTimeout(() => {
      matchListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const goToGroup = (group: string) => {
    setActiveGroup(group)
    scrollToMatchList()
  }

  const nextGroup = (g: string): string | null => {
    const idx = GROUPS.indexOf(g)
    return idx < GROUPS.length - 1 ? GROUPS[idx + 1] : null
  }

  const handleContinue = async (currentGroup: string) => {
    await savePicks(true)
    const next = nextGroup(currentGroup)
    if (next) {
      goToGroup(next)
    } else {
      // Last group done — go to revision
      goToRevision()
    }
  }

  // Jump to first match with no pick
  const goToFirstPending = () => {
    for (const g of GROUPS) {
      const gMatches = matches.filter(m => m.group === g)
      const first = gMatches.find(m => picks[m.id] === undefined)
      if (first) {
        setActiveGroup(g)
        setHighlightMatchId(first.id)
        setTimeout(() => {
          matchListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => {
            highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setTimeout(() => setHighlightMatchId(null), 2500)
          }, 400)
        }, 50)
        return
      }
    }
  }

  const goToRevision = async () => {
    if (completedCount < matches.length) {
      alert(`Debes completar todos los partidos. Te faltan ${matches.length - completedCount} pron\u{F3}sticos.`)
      return
    }
    await savePicks()
    router.push(`/revision/${code}`)
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">{'⚽'}</div>
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
  const groupCompleted = (group: string) => {
    const gm = groupMatches(group)
    return gm.length > 0 && gm.every(m => picks[m.id] !== undefined)
  }
  const groupPartial = (group: string) => {
    const gm = groupMatches(group)
    const done = gm.filter(m => picks[m.id] !== undefined).length
    return done > 0 && done < gm.length
  }

  const activeGroupMatches = groupMatches(activeGroup)
  const activeCompleted = activeGroupMatches.filter(m => picks[m.id] !== undefined).length
  const activeTotal = activeGroupMatches.length
  const activeGroupDone = activeCompleted === activeTotal && activeTotal > 0
  const activeMissing = activeTotal - activeCompleted
  const next = nextGroup(activeGroup)

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
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

      {/* ── Step indicator ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">{'✓'}</span>
            <span className="text-slate-400">Registro</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span className="font-medium text-green-700">Pron{'ó'}sticos</span>
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
            <span>Tu quiniela est{'á'} confirmada y bloqueada. <Link href={`/mi-quiniela/${code}`} className="underline font-medium">Ver mi quiniela →</Link></span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 mt-4">

        {/* ── Scoring hint ──────────────────────────────────────────────── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-blue-800 mb-1.5">Sistema de puntuaci{'ó'}n:</p>
          <div className="flex gap-4 text-xs text-blue-700">
            <span>{'🎯'} <strong>3 pts</strong> — Marcador exacto</span>
            <span>{'✅'} <strong>1 pt</strong> — Resultado correcto</span>
            <span>{'❌'} <strong>0 pts</strong> — Incorrecto</span>
          </div>
        </div>

        {/* ── Group tabs ────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {GROUPS.map((g) => {
            const done = groupCompleted(g)
            const partial = groupPartial(g)
            const active = activeGroup === g
            return (
              <button
                key={g}
                onClick={() => goToGroup(g)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  active
                    ? 'bg-green-600 text-white shadow-sm'
                    : done
                    ? 'bg-green-100 text-green-700'
                    : partial
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {g}
                {/* Complete checkmark dot */}
                {done && !active && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-white text-[8px] flex items-center justify-center">{'✓'}</span>
                )}
                {/* Partial amber dot */}
                {partial && !active && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Group header + matches ─────────────────────────────────────── */}
        {/* Scroll anchor */}
        <div ref={matchListRef} />

        {/* Group header row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-base">
            Grupo {activeGroup}
            {activeGroupDone && <span className="text-green-500">{'✅'}</span>}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {activeCompleted} / {activeTotal} completados
          </span>
        </div>

        {/* ── TOP CTA: shown immediately when group is complete ─────────── */}
        {!isLocked && activeGroupDone && (
          <div className="mb-4 bg-green-600 rounded-2xl p-4 shadow-lg">
            <p className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              {'✅'} {'¡'}Grupo {activeGroup} completado!
            </p>
            {next ? (
              <button
                onClick={() => handleContinue(activeGroup)}
                className="w-full bg-white text-green-700 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-colors hover:bg-green-50 shadow"
              >
                Continuar al Grupo {next} <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => goToRevision()}
                className="w-full bg-white text-green-700 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-colors hover:bg-green-50 shadow"
              >
                {'🏆'} Revisar mi quiniela <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}

        {/* ── Match list ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {activeGroupMatches.map((match) => (
            <div
              key={match.id}
              ref={highlightMatchId === match.id ? highlightRef : undefined}
            >
              <MatchCard
                match={match}
                pick={picks[match.id]}
                onPick={handlePick}
                locked={isLocked}
                highlight={highlightMatchId === match.id}
              />
            </div>
          ))}
        </div>

        {/* ── Group navigation footer ───────────────────────────────────── */}
        {!isLocked && (
          <div className="mt-5">
            {activeGroupDone ? (
              /* ── Group complete → show continue button ── */
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{'🎉'}</span>
                  <div>
                    <p className="font-bold text-green-800">
                      {'¡'}Listo! Ya completaste el Grupo {activeGroup}.
                    </p>
                    <p className="text-green-600 text-sm">
                      {activeTotal} de {activeTotal} partidos con pron{'ó'}stico.
                    </p>
                  </div>
                </div>
                {next ? (
                  <button
                    onClick={() => handleContinue(activeGroup)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2.5 text-base transition-colors shadow-lg"
                  >
                    Continuar al Grupo {next} <ArrowRight size={20} />
                  </button>
                ) : (
                  /* Last group complete */
                  <button
                    onClick={() => goToRevision()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2.5 text-base transition-colors shadow-lg"
                  >
                    {'🏆'} Revisar mi quiniela <ArrowRight size={20} />
                  </button>
                )}
              </div>
            ) : (
              /* ── Group incomplete → show pending info ── */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{'📝'}</span>
                  <div>
                    <p className="font-semibold text-slate-700">
                      {activeMissing === activeTotal
                        ? `Completa los ${activeTotal} partidos del Grupo ${activeGroup} para continuar.`
                        : `Te ${activeMissing === 1 ? 'falta 1 partido' : `faltan ${activeMissing} partidos`} en el Grupo ${activeGroup}.`}
                    </p>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Ingresa el marcador de cada partido.
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{activeCompleted}/{activeTotal} en este grupo</span>
                    <span>{Math.round((activeCompleted / activeTotal) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${(activeCompleted / activeTotal) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* Disabled continue */}
                  <button
                    disabled
                    className="flex-1 min-w-0 bg-slate-200 text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed"
                  >
                    {next
                      ? `Continuar al Grupo ${next}`
                      : 'Revisar quiniela'}
                    <ArrowRight size={16} />
                  </button>
                  {/* Go to first pending */}
                  {completedCount < totalMatches && (
                    <button
                      onClick={goToFirstPending}
                      className="flex-none bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
                    >
                      Ir al pendiente
                    </button>
                  )}
                </div>
                {next && (
                  <p className="text-center text-xs text-slate-400 mt-2">
                    Completa este grupo y aparecer{'á'} el bot{'ó'}n para avanzar al Grupo {next}.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Prev / Next compact nav ───────────────────────────────────── */}
        {!isLocked && (
          <div className="flex items-center justify-between mt-3 mb-2">
            <button
              onClick={() => {
                const idx = GROUPS.indexOf(activeGroup)
                if (idx > 0) goToGroup(GROUPS[idx - 1])
              }}
              disabled={activeGroup === 'A'}
              className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-30 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ← Grupo {GROUPS[GROUPS.indexOf(activeGroup) - 1] ?? ''}
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {GROUPS.indexOf(activeGroup) + 1} / {GROUPS.length}
            </span>
            <button
              onClick={() => {
                if (next) goToGroup(next)
              }}
              disabled={!next}
              className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-30 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Grupo {next ?? ''} →
            </button>
          </div>
        )}

        {/* ── Tiebreaker info ───────────────────────────────────────────── */}
        <div className="mt-4 mb-2 bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-600 mb-2">Desempate (en caso de igualdad de puntos):</p>
          <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
            <li>Mayor cantidad de marcadores exactos</li>
            <li>Mayor cantidad de resultados correctos</li>
            <li>Menor error acumulado de goles</li>
          </ol>
        </div>
      </div>

      {/* ── Group completed toast ────────────────────────────────────────── */}
      {groupCompletedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-700 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2">
            {'🎉'} {'¡'}Grupo {groupCompletedToast} completado{' '}
            {nextGroup(groupCompletedToast) && (
              <button
                onClick={() => { setGroupCompletedToast(null); goToGroup(nextGroup(groupCompletedToast)!) }}
                className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg text-xs font-bold"
              >
                Ir al {nextGroup(groupCompletedToast)} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom action bar ────────────────────────────────────────────── */}
      {!isLocked && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-30">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {activeGroupDone ? (
              /* Group is complete → primary action is always "Continuar" or "Revisar" */
              <div className="flex gap-2">
                <button
                  onClick={() => savePicks()}
                  disabled={saving}
                  className="shrink-0 border border-green-600 text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-40"
                >
                  <Save size={14} />
                  {saving ? '...' : saveSuccess ? '¡OK!' : 'Guardar'}
                </button>
                {next ? (
                  <button
                    onClick={() => handleContinue(activeGroup)}
                    className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-base transition-colors shadow-lg"
                  >
                    Continuar al Grupo {next} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => goToRevision()}
                    className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-base transition-colors shadow-lg"
                  >
                    {'🏆'} Revisar mi quiniela <ArrowRight size={18} />
                  </button>
                )}
              </div>
            ) : (
              /* Group incomplete → Guardar + go-to-pending */
              <div className="flex gap-2">
                <button
                  onClick={() => savePicks()}
                  disabled={saving || completedCount === 0}
                  className="shrink-0 border border-slate-300 text-slate-600 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-40"
                >
                  <Save size={14} />
                  {saving ? '...' : saveSuccess ? '¡OK!' : 'Guardar'}
                </button>
                {completedCount === totalMatches ? (
                  <button
                    onClick={() => goToRevision()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-base transition-colors"
                  >
                    Revisar quiniela <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={goToFirstPending}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    {'🔍'} Ir al primer pendiente
                    <span className="bg-amber-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {totalMatches - completedCount}
                    </span>
                  </button>
                )}
              </div>
            )}
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
