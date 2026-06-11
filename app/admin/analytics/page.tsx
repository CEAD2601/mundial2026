'use client'

import { useEffect, useState, useCallback } from 'react'

interface AnalyticsData {
  summary: {
    totalEvents: number
    todayEvents: number
    uniqueVisitorsTotal: number
    uniqueVisitorsToday: number
  }
  eventsByType: { type: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
  browserBreakdown: { browser: string; count: number }[]
  countryBreakdown: { country: string; count: number }[]
  dailyActivity: { date: string; count: number }[]
  recentEvents: {
    id: string
    eventType: string
    path: string
    visitorId: string | null
    participantId: string | null
    matchId: string | null
    country: string | null
    city: string | null
    deviceType: string | null
    browser: string | null
    createdAt: string
  }[]
}

const EVENT_LABELS: Record<string, string> = {
  PAGE_VIEW: 'Vista de página',
  RANKING_VIEW: 'Ranking visto',
  MY_QUINIELA_VIEW: 'Mi quiniela visto',
  MATCH_PREDICTIONS_OPENED: 'Pronósticos abiertos',
  RESULTS_VIEW: 'Resultados vistos',
  PARTICIPANT_LOOKUP: 'Búsqueda de participante',
  ADMIN_LOGIN: 'Login admin',
  WHATSAPP_SHARE_CLICK: 'Compartir WhatsApp',
  BACKUP_DOWNLOADED: 'Backup descargado',
  TEST_EVENT: 'Evento de prueba',
  ADMIN_ACTION: 'Acción admin',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function downloadCsv(events: AnalyticsData['recentEvents']) {
  const header = 'fecha,evento,ruta,visitorId,participantId,matchId,pais,ciudad,dispositivo,navegador'
  const rows = events.map(e =>
    [
      formatTime(e.createdAt),
      e.eventType,
      e.path,
      e.visitorId ?? '',
      e.participantId ?? '',
      e.matchId ?? '',
      e.country ?? '',
      e.city ?? '',
      e.deviceType ?? '',
      e.browser ?? '',
    ]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<string[] | null>(null)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    fetch('/api/admin/analytics')
      .then(r => {
        if (r.status === 500) throw new Error('table_missing')
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e?.message === 'table_missing' ? 'table_missing' : 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const runMigration = async () => {
    setMigrating(true)
    setMigrationResult(null)
    try {
      const r = await fetch('/api/admin/run-analytics-migration', { method: 'POST' })
      const d = await r.json()
      setMigrationResult(d.results ?? ['Migración ejecutada.'])
      setTimeout(load, 1000)
    } catch {
      setMigrationResult(['Error ejecutando migración.'])
    } finally {
      setMigrating(false)
    }
  }

  const runTest = async () => {
    setTesting(true)
    setTestMsg('')
    try {
      const r = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'TEST_EVENT', path: '/admin/analytics', visitorId: 'admin-test' }),
      })
      if (r.ok) {
        setTestMsg('Evento de prueba registrado correctamente.')
        setTimeout(load, 800)
      } else {
        setTestMsg('Error registrando evento.')
      }
    } catch {
      setTestMsg('Error de red.')
    } finally {
      setTesting(false)
    }
  }

  // --- MIGRATION NEEDED STATE ---
  if (error === 'table_missing' || (error && !data)) {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Analíticas</h1>
        <p className="text-slate-400 text-sm mb-6">Actividad y comportamiento de los usuarios en la quiniela.</p>

        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <p className="text-slate-300">
            La tabla de analíticas aún no existe en la base de datos. Haz clic en el botón para crearla.
          </p>
          <button
            onClick={runMigration}
            disabled={migrating}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {migrating ? 'Activando...' : 'Activar analíticas'}
          </button>
          {migrationResult && (
            <div className="mt-4 space-y-1">
              {migrationResult.map((r, i) => (
                <p key={i} className="text-sm font-mono text-slate-300">{r}</p>
              ))}
              <p className="text-emerald-400 text-sm font-semibold mt-2">Analíticas activadas correctamente. Recargando...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Analíticas</h1>
      <p className="text-slate-400 text-sm mb-6">Actividad y comportamiento de los usuarios en la quiniela.</p>
      <p className="text-slate-400">Cargando datos...</p>
    </div>
  )

  if (!data) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Analíticas</h1>
      <p className="text-red-400 text-sm">Error cargando analíticas.</p>
    </div>
  )

  const { summary, eventsByType, deviceBreakdown, browserBreakdown, countryBreakdown, recentEvents } = data
  const noData = summary.totalEvents === 0

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analíticas</h1>
          <p className="text-slate-400 text-sm mt-0.5">Actividad y comportamiento de los usuarios en la quiniela.</p>
        </div>
        <div className="flex gap-2">
          {!noData && (
            <button
              onClick={() => downloadCsv(recentEvents)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
            >
              Exportar CSV
            </button>
          )}
          <button
            onClick={runMigration}
            disabled={migrating}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 text-xs rounded-lg transition-colors"
            title="Re-ejecutar migración si hay problemas"
          >
            {migrating ? 'Migrando...' : 'Re-migrar tabla'}
          </button>
        </div>
      </div>

      {migrationResult && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-1">
          {migrationResult.map((r, i) => <p key={i} className="text-sm font-mono text-slate-300">{r}</p>)}
        </div>
      )}

      {/* EMPTY STATE */}
      {noData ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center space-y-4">
          <p className="text-slate-300 text-lg">Todavía no hay eventos registrados.</p>
          <p className="text-slate-500 text-sm">Los eventos se registrarán automáticamente cuando los usuarios visiten la quiniela.</p>
          <button
            onClick={runTest}
            disabled={testing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {testing ? 'Enviando...' : 'Probar tracking'}
          </button>
          {testMsg && <p className="text-emerald-400 text-sm">{testMsg}</p>}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Visitas totales', value: summary.totalEvents },
              { label: 'Visitantes únicos', value: summary.uniqueVisitorsTotal },
              { label: 'Eventos hoy', value: summary.todayEvents },
              { label: 'Visitantes únicos hoy', value: summary.uniqueVisitorsToday },
              { label: 'Ranking visto', value: eventsByType.find(e => e.type === 'RANKING_VIEW')?.count ?? 0 },
              { label: 'Mi quiniela visto', value: eventsByType.find(e => e.type === 'MY_QUINIELA_VIEW')?.count ?? 0 },
              { label: 'Pronósticos abiertos', value: eventsByType.find(e => e.type === 'MATCH_PREDICTIONS_OPENED')?.count ?? 0 },
              { label: 'Resultados vistos', value: eventsByType.find(e => e.type === 'RESULTS_VIEW')?.count ?? 0 },
            ].map(card => (
              <div key={card.label} className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">{card.label}</p>
                <p className="text-white text-2xl font-bold">{card.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Events by type + Devices/Browsers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4">Secciones más visitadas</h2>
              <table className="w-full text-sm">
                <tbody>
                  {eventsByType.map(e => (
                    <tr key={e.type} className="border-t border-slate-700">
                      <td className="py-2 text-slate-300">{EVENT_LABELS[e.type] ?? e.type}</td>
                      <td className="py-2 text-right text-white font-medium">{e.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-6">
              {/* Devices */}
              <div className="bg-slate-800 rounded-xl p-5">
                <h2 className="text-white font-semibold mb-4">Dispositivos</h2>
                {deviceBreakdown.map(d => {
                  const total = deviceBreakdown.reduce((s, x) => s + x.count, 0)
                  const pct = total ? Math.round((d.count / total) * 100) : 0
                  return (
                    <div key={d.device} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{d.device}</span>
                        <span className="text-white">{d.count.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full">
                        <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Browsers */}
              <div className="bg-slate-800 rounded-xl p-5">
                <h2 className="text-white font-semibold mb-4">Navegadores</h2>
                {browserBreakdown.map(b => {
                  const total = browserBreakdown.reduce((s, x) => s + x.count, 0)
                  const pct = total ? Math.round((b.count / total) * 100) : 0
                  return (
                    <div key={b.browser} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{b.browser}</span>
                        <span className="text-white">{b.count.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full">
                        <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Country breakdown */}
          {countryBreakdown.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4">Ubicación aproximada</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {countryBreakdown.map(c => (
                  <div key={c.country} className="bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-white font-bold text-lg">{c.count}</p>
                    <p className="text-slate-400 text-xs">{c.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity */}
          <div className="bg-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Actividad reciente</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={runTest}
                  disabled={testing}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  {testing ? 'Enviando...' : 'Probar tracking'}
                </button>
                {testMsg && <span className="text-emerald-400 text-xs">{testMsg}</span>}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 pr-4">Hora (VET)</th>
                    <th className="text-left py-2 pr-4">Evento</th>
                    <th className="text-left py-2 pr-4">Ruta</th>
                    <th className="text-left py-2 pr-4">Visitante</th>
                    <th className="text-left py-2 pr-4">País / Ciudad</th>
                    <th className="text-left py-2">Dispositivo / Nav.</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map(e => (
                    <tr key={e.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="py-2 pr-4 text-slate-400 whitespace-nowrap">{formatTime(e.createdAt)}</td>
                      <td className="py-2 pr-4 text-emerald-400 whitespace-nowrap">{EVENT_LABELS[e.eventType] ?? e.eventType}</td>
                      <td className="py-2 pr-4 text-slate-300 max-w-[140px] truncate">{e.path}</td>
                      <td className="py-2 pr-4 text-slate-400 font-mono">{e.visitorId?.slice(-8) ?? '—'}</td>
                      <td className="py-2 pr-4 text-slate-300 whitespace-nowrap">{[e.country, e.city].filter(Boolean).join(' · ') || '—'}</td>
                      <td className="py-2 text-slate-400 whitespace-nowrap">{[e.deviceType, e.browser].filter(Boolean).join(' · ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
