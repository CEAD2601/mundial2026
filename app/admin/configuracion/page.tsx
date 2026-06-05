'use client'

import { useState, useEffect } from 'react'

interface Settings {
  appName: string
  entryPriceUsd: number
  fixedExchangeRate: number
  paymentPhone: string
  paymentNationalId: string
  paymentBank: string
  firstPrizePercent: number
  secondPrizePercent: number
  organizationPercent: number
  deadline: string | null
  rankingVisible: boolean
  showOnlyPaidParticipants: boolean
  allowPublicPredictionViewAfterDeadline: boolean
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<Settings>({
    appName: 'Quiniela Mundial 2026',
    entryPriceUsd: 20,
    fixedExchangeRate: 700,
    paymentPhone: '04143043337',
    paymentNationalId: '4561947',
    paymentBank: 'Banesco',
    firstPrizePercent: 65,
    secondPrizePercent: 20,
    organizationPercent: 15,
    deadline: null,
    rankingVisible: true,
    showOnlyPaidParticipants: true,
    allowPublicPredictionViewAfterDeadline: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const res = await fetch('/api/settings')
    if (res.ok) {
      const data = await res.json()
      if (data.settings) setSettings(data.settings)
    }
    setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const totalPct = settings.firstPrizePercent + settings.secondPrizePercent + settings.organizationPercent

  if (loading) return <div className="p-6 text-slate-400">Cargando...</div>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configuración</h1>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la app</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio de entrada (USD)</label>
              <input
                type="number"
                min="1"
                value={settings.entryPriceUsd}
                onChange={(e) => setSettings({ ...settings, entryPriceUsd: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tasa fija (Bs/USD)</label>
              <input
                type="number"
                min="1"
                value={settings.fixedExchangeRate}
                onChange={(e) => setSettings({ ...settings, fixedExchangeRate: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Monto en Bs: {Math.round((settings.entryPriceUsd || 0) * (settings.fixedExchangeRate || 0)).toLocaleString('es-VE')} Bs
                · Los pagos ya registrados conservan la tasa del momento.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha límite de registro</label>
              <input
                type="datetime-local"
                value={settings.deadline ? new Date(settings.deadline).toISOString().slice(0, 16) : ''}
                onChange={(e) => setSettings({ ...settings, deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">Datos de pago</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Banco</label>
              <input
                type="text"
                value={settings.paymentBank}
                onChange={(e) => setSettings({ ...settings, paymentBank: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono de pago</label>
              <input
                type="text"
                value={settings.paymentPhone}
                onChange={(e) => setSettings({ ...settings, paymentPhone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cédula del receptor</label>
              <input
                type="text"
                value={settings.paymentNationalId}
                onChange={(e) => setSettings({ ...settings, paymentNationalId: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">Distribución de premios</h2>
          {totalPct !== 100 && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              La suma debe ser 100%. Actual: {totalPct}%
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">1er premio (%)</label>
              <input
                type="number"
                value={settings.firstPrizePercent}
                onChange={(e) => setSettings({ ...settings, firstPrizePercent: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">2do premio (%)</label>
              <input
                type="number"
                value={settings.secondPrizePercent}
                onChange={(e) => setSettings({ ...settings, secondPrizePercent: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organización (%)</label>
              <input
                type="number"
                value={settings.organizationPercent}
                onChange={(e) => setSettings({ ...settings, organizationPercent: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-700 mb-4">Visibilidad</h2>
          <div className="space-y-3">
            {[
              { key: 'rankingVisible', label: 'Ranking público visible' },
              { key: 'showOnlyPaidParticipants', label: 'Mostrar solo participantes con pago verificado en ranking' },
              { key: 'allowPublicPredictionViewAfterDeadline', label: 'Permitir ver pronósticos públicos después de la fecha límite' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof Settings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="w-4 h-4 rounded accent-green-600"
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || totalPct !== 100}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {saving ? 'Guardando...' : success ? '¡Configuración guardada!' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}
