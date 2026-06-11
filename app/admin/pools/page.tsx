'use client'

import { useState, useEffect } from 'react'
import { Layers, CheckCircle, AlertCircle, Clock, Trophy, Pause } from 'lucide-react'
import type { PoolStatus } from '@/lib/pool-status'
import { POOL_STATUS_LABELS, POOL_STATUS_COLORS } from '@/lib/pool-status'
import { REGISTRATION_DEADLINE } from '@/lib/deadline'

interface PoolInfo {
  dbStatus: PoolStatus
  effectiveStatus: PoolStatus
  poolName: string
  poolPhase: string
  nextPhaseLabel: string
  registrationOpen: boolean
  deadlinePassed: boolean
}

const STATUS_ICONS: Record<PoolStatus, string> = {
  OPEN:               '🟢',
  CLOSED:             '🔒',
  IN_PROGRESS:        '⚽',
  FINISHED:           '🏁',
  WAITING_NEXT_ROUND: '⏳',
}

const STATUS_ACTIONS: Array<{
  status: PoolStatus
  label: string
  description: string
  color: string
}> = [
  { status: 'OPEN',               label: 'Abrir inscripciones',           description: 'Permite nuevos registros y predicciones',        color: 'bg-green-600 hover:bg-green-700' },
  { status: 'CLOSED',             label: 'Cerrar inscripciones',          description: 'Cierra nuevos registros. Solo lectura pública',   color: 'bg-slate-600 hover:bg-slate-700' },
  { status: 'IN_PROGRESS',        label: 'Activar: En curso',             description: 'Partidos en juego. Ranking y resultados activos', color: 'bg-blue-600 hover:bg-blue-700' },
  { status: 'WAITING_NEXT_ROUND', label: 'Activar: Espera próxima ronda', description: 'Fase cerrada. Próximamente nueva quiniela',       color: 'bg-amber-600 hover:bg-amber-700' },
  { status: 'FINISHED',           label: 'Marcar fase como finalizada',   description: 'La fase de grupos terminó completamente',         color: 'bg-purple-600 hover:bg-purple-700' },
]

export default function PoolsPage() {
  const [info, setInfo] = useState<PoolInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<PoolStatus | null>(null)
  const [nextPhaseLabel, setNextPhaseLabel] = useState('')
  const [saved, setSaved] = useState(false)

  const deadlineStr = REGISTRATION_DEADLINE.toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    dateStyle: 'long',
    timeStyle: 'short',
  })

  useEffect(() => {
    fetch('/api/admin/pool-status')
      .then(r => r.json())
      .then((d: PoolInfo) => {
        setInfo(d)
        setNextPhaseLabel(d.nextPhaseLabel)
      })
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (status: PoolStatus) => {
    setSaving(status)
    const res = await fetch('/api/admin/pool-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poolStatus: status }),
    })
    if (res.ok) {
      setInfo(prev => prev ? { ...prev, dbStatus: status, effectiveStatus: status, registrationOpen: status === 'OPEN' } : prev)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(null)
  }

  const saveNextPhase = async () => {
    setSaving('OPEN') // reuse saving indicator
    await fetch('/api/admin/pool-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nextPhaseLabel }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(null)
  }

  if (loading) return <div className="p-6 text-slate-500">Cargando...</div>
  if (!info) return <div className="p-6 text-red-500">Error al cargar</div>

  const current = info.effectiveStatus

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="text-green-600" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estado de la Quiniela</h1>
          <p className="text-slate-500 text-sm">Controla el estado y fase de la quiniela actual</p>
        </div>
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-800 text-sm">
          <CheckCircle size={16} /> Guardado correctamente
        </div>
      )}

      {/* Current status card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-700">Estado actual</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${POOL_STATUS_COLORS[current]}`}>
            {STATUS_ICONS[current]} {POOL_STATUS_LABELS[current]}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Quiniela</p>
            <p className="font-semibold text-slate-800 text-xs leading-snug">{info.poolName}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Fase</p>
            <p className="font-semibold text-slate-800 text-xs">{info.poolPhase}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Inscripciones</p>
            <p className={`font-bold text-xs ${info.registrationOpen ? 'text-green-600' : 'text-red-600'}`}>
              {info.registrationOpen ? '🟢 Abiertas' : '🔒 Cerradas'}
            </p>
          </div>
        </div>
        <div className={`mt-3 rounded-lg p-2.5 text-xs flex items-center gap-2 ${info.deadlinePassed ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
          <Clock size={13} className="shrink-0" />
          {info.deadlinePassed
            ? `Cierre automático: ${deadlineStr} (ya pasó)`
            : `Cierre automático programado: ${deadlineStr}`}
        </div>
      </div>

      {/* Change status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          Cambiar estado manualmente
        </h2>
        <div className="space-y-2">
          {STATUS_ACTIONS.map((action) => {
            const isActive = current === action.status
            return (
              <div key={action.status} className={`flex items-center justify-between rounded-xl border p-3 ${isActive ? 'border-green-300 bg-green-50' : 'border-slate-100'}`}>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {STATUS_ICONS[action.status]} {action.label}
                    {isActive && <span className="ml-2 text-xs text-green-600 font-bold">← Actual</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                </div>
                <button
                  onClick={() => changeStatus(action.status)}
                  disabled={isActive || saving !== null}
                  className={`shrink-0 ml-3 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${action.color}`}
                >
                  {saving === action.status ? '...' : 'Aplicar'}
                </button>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          El cambio es inmediato. El cierre automático por fecha límite sigue activo independientemente.
        </p>
      </div>

      {/* Next phase label */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-yellow-500" />
          Próxima fase (texto público)
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          Este texto aparece en la landing cuando las inscripciones están cerradas.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nextPhaseLabel}
            onChange={e => setNextPhaseLabel(e.target.value)}
            placeholder="Ej: Octavos de final"
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
          />
          <button
            onClick={saveNextPhase}
            disabled={saving !== null}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
        <p className="font-semibold text-blue-800 mb-2 flex items-center gap-1"><Pause size={13} /> Efectos por estado:</p>
        <p><strong>OPEN:</strong> Landing muestra "Crear mi quiniela". Registros y predicciones aceptados.</p>
        <p><strong>CLOSED:</strong> Landing muestra "Inscripciones cerradas". APIs rechazan nuevos registros.</p>
        <p><strong>IN_PROGRESS:</strong> Igual que CLOSED + banner "fase en curso" con próxima quiniela.</p>
        <p><strong>WAITING_NEXT_ROUND:</strong> Landing destaca "próxima quiniela" prominentemente.</p>
        <p><strong>FINISHED:</strong> Banner de fase terminada + invitación a próxima ronda.</p>
      </div>
    </div>
  )
}
