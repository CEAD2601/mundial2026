'use client'

import { useState } from 'react'
import { Download, Database, Users, CreditCard, BarChart2, Settings, FileText, CheckCircle } from 'lucide-react'
import { REGISTRATION_DEADLINE, isRegistrationOpen } from '@/lib/deadline'

interface ExportItem {
  key: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const EXPORTS: ExportItem[] = [
  { key: 'all',          label: 'Backup completo',   description: 'Todos los datos críticos en un solo archivo JSON',        icon: <Database size={20} />,  color: 'bg-green-600 hover:bg-green-700' },
  { key: 'participants', label: 'Participantes',      description: 'Nombres, cédulas, teléfonos, correos, estados de pago',   icon: <Users size={20} />,     color: 'bg-blue-600 hover:bg-blue-700' },
  { key: 'predictions',  label: 'Pronósticos',        description: 'Todos los marcadores predichos por todos los participantes', icon: <FileText size={20} />, color: 'bg-purple-600 hover:bg-purple-700' },
  { key: 'matches',      label: 'Partidos',           description: 'Fixture completo con equipos y resultados reales',         icon: <BarChart2 size={20} />, color: 'bg-amber-600 hover:bg-amber-700' },
  { key: 'rankings',     label: 'Ranking',            description: 'Posiciones y puntos de todos los participantes',           icon: <BarChart2 size={20} />, color: 'bg-yellow-600 hover:bg-yellow-700' },
  { key: 'settings',     label: 'Configuración',      description: 'Settings de la plataforma (tasa, premios, etc.)',          icon: <Settings size={20} />,  color: 'bg-slate-600 hover:bg-slate-700' },
  { key: 'auditLogs',    label: 'Logs de auditoría', description: 'Últimas 1000 acciones de administración',                  icon: <FileText size={20} />,  color: 'bg-slate-500 hover:bg-slate-600' },
]

export default function BackupsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [lastDownloaded, setLastDownloaded] = useState<Record<string, string>>({})

  const registrationOpen = isRegistrationOpen()
  const deadlineStr = REGISTRATION_DEADLINE.toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const downloadBackup = async (table: string) => {
    if (downloading) return
    setDownloading(table)
    try {
      const res = await fetch(`/api/admin/backup?table=${table}`)
      if (!res.ok) {
        alert('Error al generar backup: ' + (await res.json()).error)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const cd = res.headers.get('Content-Disposition') ?? ''
      const match = cd.match(/filename="([^"]+)"/)
      a.download = match?.[1] ?? `backup-${table}.json`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
      setLastDownloaded(prev => ({ ...prev, [table]: new Date().toLocaleTimeString('es-VE') }))
    } catch {
      alert('Error de conexión al descargar backup')
    }
    setDownloading(null)
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-green-600" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Backups y Exportación</h1>
          <p className="text-slate-500 text-sm">Descarga copias de seguridad de todos los datos</p>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-xl border p-4 mb-6 flex items-start gap-3 ${registrationOpen ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <span className="text-2xl">{registrationOpen ? '🟢' : '🔒'}</span>
        <div>
          <p className={`font-semibold text-sm ${registrationOpen ? 'text-green-800' : 'text-blue-800'}`}>
            Estado de inscripción: <strong>{registrationOpen ? 'Abierta' : 'Cerrada'}</strong>
          </p>
          <p className={`text-xs mt-0.5 ${registrationOpen ? 'text-green-600' : 'text-blue-600'}`}>
            {registrationOpen
              ? `Cierra automáticamente el ${deadlineStr} (hora Venezuela)`
              : `Cerró el ${deadlineStr} (hora Venezuela). Solo lectura para participantes.`}
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
        <CreditCard size={16} className="shrink-0 mt-0.5" />
        <span>
          <strong>Antes de cualquier acción masiva</strong> (reset, migración, actualización masiva) descarga el backup completo.
        </span>
      </div>

      {/* Export buttons */}
      <div className="space-y-3">
        {EXPORTS.map((item) => (
          <div key={item.key} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 truncate">{item.description}</p>
                {lastDownloaded[item.key] && (
                  <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle size={10} /> Descargado a las {lastDownloaded[item.key]}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => downloadBackup(item.key)}
              disabled={downloading === item.key}
              className={`shrink-0 ${item.color} text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {downloading === item.key ? (
                <span className="animate-spin text-base">⏳</span>
              ) : (
                <Download size={15} />
              )}
              {downloading === item.key ? 'Generando...' : 'Descargar'}
            </button>
          </div>
        ))}
      </div>

      {/* Format info */}
      <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
        <p><strong className="text-slate-700">Formato:</strong> JSON · UTF-8 · Incluye fecha de exportación</p>
        <p><strong className="text-slate-700">Nombre del archivo:</strong> backup-quiniela-mundial-2026-[fecha].json</p>
        <p><strong className="text-slate-700">Retención recomendada:</strong> Guardar backups diarios durante el Mundial (al menos 60 días)</p>
        <p><strong className="text-slate-700">Almacenamiento:</strong> Google Drive, Dropbox o disco local</p>
      </div>
    </div>
  )
}
