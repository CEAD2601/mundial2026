import Link from 'next/link'

const sections = [
  {
    title: '1. Inscripción',
    icon: '📝',
    rules: [
      'Cada participante debe registrarse con su nombre completo, cédula de identidad y número de teléfono.',
      'Solo se permite una participación por cédula de identidad.',
      'El código de participación es único, personal e intransferible.',
      'El costo de inscripción es de $20 USD por participante.',
    ],
  },
  {
    title: '2. Pronósticos',
    icon: '⚽',
    rules: [
      'Debes pronosticar los 72 partidos de la fase de grupos del Mundial FIFA 2026.',
      'Para cada partido debes elegir: 1 (gana el equipo local), X (empate) o 2 (gana el equipo visitante).',
      'Los pronósticos solo se evalúan en el resultado final del tiempo reglamentario (90 minutos). No se considera tiempo extra ni penales.',
      'Puedes guardar tus pronósticos parcialmente y continuarlos después.',
      'Una vez confirmada la quiniela, NO se pueden modificar los pronósticos.',
      'La fecha límite para confirmar es antes del inicio del primer partido del torneo.',
    ],
  },
  {
    title: '3. Sistema de puntos',
    icon: '🏆',
    rules: [
      'Cada pronóstico correcto otorga 3 puntos.',
      'Los pronósticos incorrectos no suman ni restan puntos.',
      'En caso de empate en puntos, se clasifica primero quien tenga mayor porcentaje de efectividad (aciertos / partidos jugados).',
    ],
  },
  {
    title: '4. Pagos',
    icon: '💳',
    rules: [
      'El pago se realiza por transferencia o pago móvil en bolívares a la tasa del día.',
      'El participante debe reportar su referencia de pago indicando: banco emisor, número de referencia y fecha.',
      'El pago es verificado manualmente por el administrador.',
      'Solo los participantes con pago verificado son elegibles para premios y aparecen en el ranking oficial.',
      'No se hacen devoluciones una vez verificado el pago.',
    ],
  },
  {
    title: '5. Premios',
    icon: '🎁',
    rules: [
      '1er lugar: 50% del fondo total recaudado.',
      '2do lugar: 30% del fondo total recaudado.',
      '20% restante cubre los gastos de organización.',
      'El fondo se calcula únicamente con los pagos verificados.',
      'Los premios se entregan al finalizar la fase de grupos y se calcula el ranking final.',
    ],
  },
  {
    title: '6. Conducta y fair play',
    icon: '🤝',
    rules: [
      'Está prohibido el uso de múltiples cuentas o cédulas falsas.',
      'El administrador se reserva el derecho de descalificar participantes que incumplan las reglas.',
      'Las decisiones del administrador son definitivas.',
      'En caso de partidos cancelados o reprogramados, se aplicarán las reglas vigentes en ese momento.',
    ],
  },
]

export default function ReglasPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">📋 Reglamento</h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          Lee con atención el reglamento antes de participar. Al registrarte y confirmar tu quiniela, aceptas todas estas reglas.
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-slate-800 text-white rounded-xl p-5 text-center">
          <p className="text-sm mb-4">¿Listo para participar?</p>
          <Link
            href="/registro"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Registrarme ahora
          </Link>
        </div>
      </div>
    </div>
  )
}
