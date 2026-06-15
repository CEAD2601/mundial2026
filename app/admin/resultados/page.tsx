'use client'

import { useState, useEffect, useCallback } from 'react'

interface Team {
  displayName: string
  flagEmoji: string
  shortName: string
}

interface Match {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  status: string
  team1Goals: number | null
  team2Goals: number | null
  result: string | null
  team1: Team
  team2: Team
}

interface PendingAutoMatch {
  id: string
  matchNumber: number
  group: string
  kickoffUtc: string
  team1: { displayName: string; flagEmoji: string }
  team2: { displayName: string; flagEmoji: string }
  currentStatus: string
  currentTeam1Goals: number | null
  currentTeam2Goals: number | null
  autoDetectedTeam1Goals: number | null
  autoDetectedTeam2Goals: number | null
  autoDetectedResult: string | null
  autoDetectedSource: string | null
  autoDetectionConfidence: string | null
  autoDetectedAt: string | null
}

interface LiveStatus {
  enabled: boolean
  source: string
  autoApply: boolean
  lastRunAt: string | null
  lastRunMessage: string | null
}

interface UpcomingCheck {
  id: string
  matchNumber: number
  team1: { displayName: string; flagEmoji: string }
  team2: { displayName: string; flagEmoji: string }
  kickoffUtc: string
  firstCheckAt: string
  lastAutoCheckAt: string | null
  autoCheckAttempts: number
  status: 'WAITING' | 'CHECKING' | 'REQUIRES_MANUAL'
}

interface LogEntry {
  type: string
  message: string
  matchId: string | null
  source: string | null
  confidence: string | null
  detectedGoals1: number | null
  detectedGoals2: number | null
  adminAction: string | null
  createdAt: string
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function ResultadosAdminPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')
  const [scores, setScores] = useState<Record<string, { g1: string; g2: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [recalculating, setRecalculating] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual')

  // Live results state
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null)
  const [pendingMatches, setPendingMatches] = useState<PendingAutoMatch[]>([])
  const [upcomingChecks, setUpcomingChecks] = useState<UpcomingCheck[]>([])
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editingMatch, setEditingMatch] = useState<string | null>(null)
  const [editScores, setEditScores] = useState<{ g1: string; g2: string }>({ g1: '', g2: '' })
  const [triggeringCron, setTriggeringCron] = useState(false)
  const [cronSummary, setCronSummary] = useState<{
    matchesChecked: number
    resultsDetected: number
    resultsAutoApplied: number
    resultsPendingReview: number
    errors: string[]
    timestamp: string
  } | null>(null)

  const loadMatches = useCallback(async () => {
    const res = await fetch('/api/results')
    if (res.ok) {
      const data = await res.json()
      setMatches(data.matches ?? [])
      const initScores: Record<string, { g1: string; g2: string }> = {}
      for (const m of data.matches ?? []) {
        initScores[m.id] = {
          g1: m.team1Goals !== null ? String(m.team1Goals) : '',
          g2: m.team2Goals !== null ? String(m.team2Goals) : '',
        }
      }
      setScores(initScores)
    }
    setLoading(false)
  }, [])

  const loadLiveResults = useCallback(async () => {
    setLiveLoading(true)
    const res = await fetch('/api/admin/live-results')
    if (res.ok) {
      const data = await res.json()
      setLiveStatus(data.status)
      setPendingMatches(data.pendingMatches ?? [])
      setUpcomingChecks(data.upcomingChecks ?? [])
      setRecentLogs(data.recentLogs ?? [])
    }
    setLiveLoading(false)
  }, [])

  useEffect(() => {
    loadMatches()
    loadLiveResults()
  }, [loadMatches, loadLiveResults])

  const saveResult = async (matchId: string) => {
    const s = scores[matchId]
    if (s.g1 === '' || s.g2 === '') return
    const match = matches.find(m => m.id === matchId)
    const label = match
      ? `${match.team1.flagEmoji} ${match.team1.displayName} ${s.g1} — ${s.g2} ${match.team2.displayName} ${match.team2.flagEmoji}`
      : `${s.g1} — ${s.g2}`
    const confirmed = window.confirm(
      `¿Confirmar resultado?\n\n${label}\n\nEsto actualizará los puntos y el ranking de todos los participantes.`
    )
    if (!confirmed) return
    setSaving(matchId)
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, team1Goals: parseInt(s.g1), team2Goals: parseInt(s.g2) }),
    })
    if (res.ok) {
      await loadMatches()
      alert('✅ Resultado guardado. Ranking actualizado automáticamente.')
    } else {
      const data = await res.json().catch(() => ({}))
      alert('❌ Error: ' + (data.error ?? 'No se pudo guardar el resultado'))
    }
    setSaving(null)
  }

  const recalculate = async () => {
    setRecalculating(true)
    await fetch('/api/ranking', { method: 'POST' })
    setRecalculating(false)
    alert('Ranking recalculado correctamente')
  }

  const handleLiveAction = async (
    action: 'confirm' | 'reject' | 'edit',
    matchId: string,
    team1Goals?: number,
    team2Goals?: number
  ) => {
    setActionLoading(matchId)
    const body: Record<string, unknown> = { action, matchId }
    if (action === 'edit') {
      body.team1Goals = team1Goals
      body.team2Goals = team2Goals
    }
    const res = await fetch('/api/admin/live-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) {
      await Promise.all([loadMatches(), loadLiveResults()])
      setEditingMatch(null)
    } else {
      alert(data.error ?? 'Error al procesar acción')
    }
    setActionLoading(null)
  }

  const triggerCronManually = async () => {
    setTriggeringCron(true)
    setCronSummary(null)
    try {
      const res = await fetch('/api/admin/live-results/update', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.summary) {
        setCronSummary(data.summary)
        await Promise.all([loadMatches(), loadLiveResults()])
      } else {
        setCronSummary(null)
        alert(data.error ?? 'Error al ejecutar la actualización')
      }
    } catch {
      alert('Error de conexión al ejecutar la actualización')
    } finally {
      setTriggeringCron(false)
    }
  }

  const groupMatches = matches.filter((m) => m.group === activeGroup)

  const confidenceBadge = (c: string | null) => {
    if (c === 'HIGH') return 'bg-green-100 text-green-700'
    if (c === 'MEDIUM') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const logTypeBadge = (t: string) => {
    if (t === 'RESULT_CONFIRMED') return 'bg-green-100 text-green-700'
    if (t === 'RESULT_DETECTED') return 'bg-blue-100 text-blue-700'
    if (t === 'RESULT_REJECTED') return 'bg-red-100 text-red-700'
    if (t === 'ERROR') return 'bg-red-100 text-red-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Resultados</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={recalculate}
            disabled={recalculating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {recalculating ? 'Recalculando...' : '🔄 Recalcular ranking'}
          </button>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'manual'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          ✍️ Carga manual
        </button>
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'auto'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🤖 Resultados automáticos
          {pendingMatches.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingMatches.length}
            </span>
          )}
        </button>
      </div>

      {/* ── MANUAL TAB ──────────────────────────────────────────────── */}
      {activeTab === 'manual' && (
        <>
          {/* Group tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeGroup === g
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando...</div>
          ) : (
            <div className="space-y-3">
              {groupMatches.map((match) => {
                const s = scores[match.id] ?? { g1: '', g2: '' }
                const isFinished = match.status === 'FINISHED'
                return (
                  <div
                    key={match.id}
                    className={`bg-white rounded-xl border p-4 shadow-sm ${
                      isFinished ? 'border-green-200' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Partido #{match.matchNumber}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isFinished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isFinished ? 'Finalizado' : 'Programado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xl">{match.team1.flagEmoji}</span>
                        <span className="font-semibold text-slate-800 text-sm">{match.team1.displayName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={s.g1}
                          onChange={(e) =>
                            setScores({ ...scores, [match.id]: { ...s, g1: e.target.value } })
                          }
                          className="w-12 text-center border border-slate-300 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-slate-400 font-bold">—</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={s.g2}
                          onChange={(e) =>
                            setScores({ ...scores, [match.id]: { ...s, g2: e.target.value } })
                          }
                          className="w-12 text-center border border-slate-300 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={() => saveResult(match.id)}
                          disabled={saving === match.id || s.g1 === '' || s.g2 === ''}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ml-1"
                        >
                          {saving === match.id ? '...' : 'Guardar'}
                        </button>
                      </div>
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        <span className="font-semibold text-slate-800 text-sm text-right">
                          {match.team2.displayName}
                        </span>
                        <span className="text-xl">{match.team2.flagEmoji}</span>
                      </div>
                    </div>
                    {isFinished && match.result && (
                      <div className="mt-2 text-center text-xs text-green-600 font-medium">
                        Resultado:{' '}
                        {match.result === 'G1'
                          ? `Gana ${match.team1.shortName}`
                          : match.result === 'G2'
                          ? `Gana ${match.team2.shortName}`
                          : 'Empate'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── AUTO RESULTS TAB ──────────────────────────────────────── */}
      {activeTab === 'auto' && (
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-lg">Estado de automatización</h2>
              <button
                onClick={triggerCronManually}
                disabled={triggeringCron}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {triggeringCron ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Buscando resultados…
                  </>
                ) : '▶ Actualizar ahora'}
              </button>
            </div>

            {liveStatus && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <span
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      liveStatus.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <div className="text-xs text-slate-500">Automatización</div>
                    <div className="font-semibold text-sm text-slate-800">
                      {liveStatus.enabled ? 'Activada' : 'Desactivada'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <span className="text-lg">🌐</span>
                  <div>
                    <div className="text-xs text-slate-500">Fuente</div>
                    <div className="font-semibold text-sm text-slate-800">{liveStatus.source}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <span className="text-lg">🤖</span>
                  <div>
                    <div className="text-xs text-slate-500">Auto-aplicar confianza alta</div>
                    <div className="font-semibold text-sm text-slate-800">
                      {liveStatus.autoApply ? 'Sí' : 'No (requiere revisión)'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <span className="text-lg">🕐</span>
                  <div>
                    <div className="text-xs text-slate-500">Última ejecución</div>
                    <div className="font-semibold text-sm text-slate-800">
                      {liveStatus.lastRunAt
                        ? new Date(liveStatus.lastRunAt).toLocaleString('es-VE')
                        : 'Nunca'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {liveStatus && !liveStatus.enabled && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                <strong>⚠️ Automatización desactivada.</strong> Configura{' '}
                <code className="bg-amber-100 px-1 rounded">LIVE_RESULTS_ENABLED=true</code> en
                Vercel y vuelve a desplegar. El modo manual siempre está disponible.
              </div>
            )}
            {liveStatus && liveStatus.enabled && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 space-y-1">
                <p>✅ <strong>Automatización activada.</strong> Los resultados finales confiables se aplican automáticamente y actualizan el ranking. Solo los resultados dudosos quedan pendientes de revisión.</p>
                <p className="text-green-700">ℹ️ Los resultados finales con confianza alta se aplican automáticamente. Los resultados con confianza media o baja requieren revisión. El cron corre cada 10 minutos.</p>
              </div>
            )}

            {/* Summary after running */}
            {cronSummary && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Resultado de la última actualización
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Partidos consultados', value: cronSummary.matchesChecked, color: 'text-slate-700' },
                    { label: 'Resultados detectados', value: cronSummary.resultsDetected, color: 'text-blue-700' },
                    { label: 'Pendientes revisión', value: cronSummary.resultsPendingReview, color: 'text-amber-700' },
                    { label: 'Aplicados automát.', value: cronSummary.resultsAutoApplied, color: 'text-green-700' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                      <div className={`text-2xl font-bold ${color}`}>{value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                {cronSummary.resultsDetected === 0 && (
                  <p className="text-sm text-slate-500 text-center mt-3">
                    No se encontraron resultados nuevos en este momento.
                  </p>
                )}
                {cronSummary.errors.length > 0 && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2">
                    <p className="text-xs font-bold text-red-700 mb-1">Errores:</p>
                    {cronSummary.errors.map((e, i) => (
                      <p key={i} className="text-xs text-red-600">{e}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 text-center mt-2">
                  {new Date(cronSummary.timestamp).toLocaleString('es-VE')}
                </p>
              </div>
            )}
          </div>

          {/* Upcoming auto-checks */}
          {upcomingChecks.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Próximas revisiones automáticas</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada partido se revisa automáticamente 105 minutos después de su inicio.
                </p>
              </div>
              <div className="divide-y divide-slate-50">
                {upcomingChecks.map((m) => {
                  const kickoffVet = new Date(m.kickoffUtc).toLocaleString('es-VE', {
                    timeZone: 'America/Caracas',
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                  const firstCheckVet = new Date(m.firstCheckAt).toLocaleString('es-VE', {
                    timeZone: 'America/Caracas',
                    hour: '2-digit', minute: '2-digit',
                  })
                  const statusConfig = {
                    WAITING: { label: 'Esperando inicio', color: 'bg-slate-100 text-slate-600' },
                    CHECKING: { label: 'En revisión', color: 'bg-blue-100 text-blue-700' },
                    REQUIRES_MANUAL: { label: 'Rev. manual', color: 'bg-red-100 text-red-700' },
                  }[m.status]
                  return (
                    <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {m.team1.flagEmoji} {m.team1.displayName} vs {m.team2.displayName} {m.team2.flagEmoji}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Inicio: {kickoffVet} · Primera revisión: {firstCheckVet}
                          {m.autoCheckAttempts > 0 && ` · Intentos: ${m.autoCheckAttempts}`}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pending confirmation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">
                Pendientes de confirmación
                {pendingMatches.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingMatches.length}
                  </span>
                )}
              </h2>
              <button
                onClick={loadLiveResults}
                disabled={liveLoading}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                {liveLoading ? '⏳' : '🔄'} Actualizar
              </button>
            </div>

            {pendingMatches.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No hay resultados pendientes de confirmación
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pendingMatches.map((m) => (
                  <div key={m.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          Partido #{m.matchNumber} · Grupo {m.group}
                        </div>
                        <div className="font-semibold text-slate-800 text-sm">
                          {m.team1.flagEmoji} {m.team1.displayName} vs {m.team2.displayName}{' '}
                          {m.team2.flagEmoji}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${confidenceBadge(
                          m.autoDetectionConfidence
                        )}`}
                      >
                        {m.autoDetectionConfidence ?? 'N/A'}
                      </span>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
                      <div className="text-xs text-blue-600 mb-1">Resultado detectado automáticamente</div>
                      <div className="text-lg font-extrabold text-blue-800">
                        {m.autoDetectedTeam1Goals} — {m.autoDetectedTeam2Goals}
                      </div>
                      <div className="text-xs text-blue-500 mt-1">
                        Fuente: {m.autoDetectedSource ?? 'desconocida'} ·{' '}
                        {m.autoDetectedAt
                          ? new Date(m.autoDetectedAt).toLocaleString('es-VE')
                          : ''}
                      </div>
                    </div>

                    {editingMatch === m.id ? (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-slate-600">Editar marcador:</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editScores.g1}
                          onChange={(e) => setEditScores({ ...editScores, g1: e.target.value })}
                          className="w-12 text-center border border-slate-300 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-slate-400">—</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={editScores.g2}
                          onChange={(e) => setEditScores({ ...editScores, g2: e.target.value })}
                          className="w-12 text-center border border-slate-300 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() =>
                            handleLiveAction(
                              'edit',
                              m.id,
                              parseInt(editScores.g1),
                              parseInt(editScores.g2)
                            )
                          }
                          disabled={
                            actionLoading === m.id ||
                            editScores.g1 === '' ||
                            editScores.g2 === ''
                          }
                          className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingMatch(null)}
                          className="text-slate-400 text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : null}

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleLiveAction('confirm', m.id)}
                        disabled={actionLoading === m.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoading === m.id ? '...' : '✓ Confirmar'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingMatch(m.id)
                          setEditScores({
                            g1: String(m.autoDetectedTeam1Goals ?? ''),
                            g2: String(m.autoDetectedTeam2Goals ?? ''),
                          })
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleLiveAction('reject', m.id)}
                        disabled={actionLoading === m.id}
                        className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Registro de actividad reciente</h2>
            </div>
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">Sin registros</div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {recentLogs.map((log, i) => (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${logTypeBadge(
                        log.type
                      )}`}
                    >
                      {log.type.replace('_', ' ')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-700 truncate">{log.message}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString('es-VE')}
                        {log.source && ` · ${log.source}`}
                        {log.confidence && ` · ${log.confidence}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
