'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Phone, CreditCard, MapPin, Mail, ArrowRight, AlertCircle, Lock } from 'lucide-react'
import { isRegistrationOpen } from '@/lib/deadline'

const schema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  nationalId: z.string().min(6, 'Cédula inválida (mínimo 6 dígitos)').max(10, 'Cédula inválida').regex(/^\d+$/, 'Solo números'),
  phone: z.string().min(10, 'Teléfono inválido (mínimo 10 dígitos)').max(15),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  city: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const registrationOpen = isRegistrationOpen()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (res.status === 409) {
        // Duplicate CI - offer to redirect
        const go = confirm(`Ya existe un participante con esa cédula.\n\n¿Deseas ir a tu quiniela existente?\nCódigo: ${json.code}`)
        if (go) router.push(`/quiniela/${json.code}`)
        setLoading(false)
        return
      }
      if (!res.ok) {
        setServerError(json.error ?? 'Error al registrar')
        setLoading(false)
        return
      }

      router.push(`/quiniela/${json.participant.participationCode}`)
    } catch {
      setServerError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <header className="bg-gradient-to-r from-slate-700 to-blue-800 text-white py-4 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/" className="text-slate-300 text-sm hover:text-white transition-colors">← Inicio</Link>
            <h1 className="font-bold text-lg">Quiniela Mundial 2026</h1>
            <div className="w-16" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-slate-500" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Inscripciones cerradas</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              El plazo para registrarse y llenar la quiniela termin{'ó'} al iniciar el primer partido.
              Puedes seguir el ranking y los resultados durante el Mundial.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/ranking"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {'🏆'} Ver ranking
              </Link>
              <Link
                href="/resultados"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {'⚽'} Ver resultados
              </Link>
              <Link
                href="/mi-quiniela"
                className="w-full border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Ver mi quiniela
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-4 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-green-200 text-sm hover:text-white transition-colors">← Inicio</Link>
          <h1 className="font-bold text-lg">Quiniela Mundial 2026</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span className="font-medium text-green-700">Registro</span>
            <div className="flex-1 h-0.5 bg-slate-200" />
            {[2, 3, 4, 5].map((n) => (
              <span key={n} className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">{n}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚽</div>
            <h2 className="text-2xl font-bold text-slate-800">Crea tu quiniela</h2>
            <p className="text-slate-500 text-sm mt-1">Paso 1 de 5 · Información personal</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm mb-4">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><User size={14} /> Nombre completo *</span>
              </label>
              <input
                {...register('fullName')}
                placeholder="Ej: Carlos Rodríguez García"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><CreditCard size={14} /> Cédula de Identidad *</span>
              </label>
              <input
                {...register('nationalId')}
                placeholder="Ej: 12345678"
                inputMode="numeric"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.nationalId && <p className="text-red-500 text-xs mt-1">{errors.nationalId.message}</p>}
              <p className="text-slate-400 text-xs mt-1">Solo el número, sin V- o E-</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><Phone size={14} /> Celular / WhatsApp *</span>
              </label>
              <input
                {...register('phone')}
                placeholder="Ej: 04141234567"
                inputMode="tel"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> Ciudad (opcional)</span>
              </label>
              <input
                {...register('city')}
                placeholder="Ej: Caracas"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><Mail size={14} /> Email (opcional)</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="Ej: usuario@email.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Importante:</strong> Asegúrate de que tu cédula sea correcta. No podrás cambiarla una vez registrado.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>Continuar a mi quiniela <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-400">
              ¿Ya registrado?{' '}
              <Link href="/mi-quiniela" className="text-green-600 hover:underline">
                Ver mi quiniela
              </Link>
            </p>
            <Link
              href="/admin"
              className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
            >
              Administrador
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
          <strong>¿Qué sigue después?</strong>
          <ol className="mt-2 space-y-1 text-xs list-decimal list-inside text-blue-700">
            <li>Completa los 72 pronósticos (puedes guardar y continuar)</li>
            <li>Revisa y confirma tu quiniela</li>
            <li>Realiza el pago por Pago Móvil Banesco</li>
            <li>Reporta tu referencia de pago</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
