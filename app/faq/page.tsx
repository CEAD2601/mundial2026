import Link from 'next/link'

const faqs = [
  {
    q: '¿Cómo me registro?',
    a: 'Ve a la página de registro, ingresa tus datos personales (nombre, cédula, teléfono) y recibirás un código de participación único de 6 caracteres.',
  },
  {
    q: '\u{BF}Cu\u{E1}nto cuesta participar?',
    a: 'La inscripci\u{F3}n cuesta 20 USD. Puedes pagar por Pago M\u{F3}vil Banesco (14.600 Bs a tasa fija 730 Bs/USD) o directamente por Zelle (20 USD).',
  },
  {
    q: '\u{BF}C\u{F3}mo funciona el sistema de pron\u{F3}sticos?',
    a: 'Debes predecir el marcador exacto (goles de cada equipo) para cada uno de los 72 partidos. Marcador exacto = 3 puntos, ganador/empate correcto = 1 punto, resultado incorrecto = 0 puntos.',
  },
  {
    q: '¿Puedo cambiar mis pronósticos?',
    a: 'Puedes guardar y modificar tus pronósticos hasta que los confirmes. Una vez confirmados, no se pueden cambiar.',
  },
  {
    q: '¿Cuándo es la fecha límite?',
    a: 'Debes registrarte y confirmar tu quiniela antes del inicio del primer partido del Mundial. Las fechas exactas se publican en la configuración del torneo.',
  },
  {
    q: '¿Cómo se distribuyen los premios?',
    a: 'El 65% del fondo va al primer lugar, el 20% al segundo lugar y el 15% restante cubre los gastos de organizaci\u{F3}n.',
  },
  {
    q: '¿Cómo se realiza el pago?',
    a: 'Puedes pagar por Pago M\u{F3}vil Banesco o por Zelle.\n\nPago M\u{F3}vil: Banesco · Tel\u{E9}fono 04143043337 · CI 4561947 · Monto 14.600 Bs (tasa fija 730 Bs/USD).\n\nZelle: kissigloxxi@hotmail.com · Monto 20 USD.\n\nDespu\u{E9}s de pagar, reporta la referencia o comprobante para que el administrador verifique tu participaci\u{F3}n.',
  },
  {
    q: '¿Cuándo se verifica mi pago?',
    a: 'Los pagos son verificados manualmente por el administrador. Generalmente en menos de 24 horas hábiles. Puedes ver el estado de tu pago en tu comprobante.',
  },
  {
    q: '¿Qué pasa si no pago?',
    a: 'Puedes completar tu quiniela sin pagar, pero solo los participantes con pago verificado aparecen en el ranking oficial y son elegibles para los premios.',
  },
  {
    q: '¿Cómo veo mi posición en el ranking?',
    a: 'El ranking público se actualiza automáticamente después de cada partido. Puedes verlo en la sección "Ranking" del menú principal.',
  },
  {
    q: '¿Puedo participar desde fuera de Venezuela?',
    a: 'S\u{ED}. Puedes participar desde cualquier pa\u{ED}s. Si est\u{E1}s en Venezuela o prefieres pagar en bol\u{ED}vares, usa Pago M\u{F3}vil Banesco (14.600 Bs). Si prefieres pagar en d\u{F3}lares, usa Zelle (kissigloxxi@hotmail.com · 20 USD).',
  },
  {
    q: '¿Qué pasa si pierdo mi código?',
    a: 'Puedes recuperar tu código ingresando tu número de cédula en la página principal. También puedes buscar el correo de confirmación si registraste un email.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link href="/" className="text-green-200 text-xs hover:text-white mb-1 block">← Inicio</Link>
          <h1 className="font-bold text-2xl">❓ Preguntas Frecuentes</h1>
          <p className="text-green-200 text-sm">Quiniela Mundial 2026</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 group">
            <summary className="px-5 py-4 cursor-pointer font-semibold text-slate-700 flex items-center justify-between select-none list-none">
              <span>{faq.q}</span>
              <span className="text-slate-400 text-lg group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {faq.a}
            </div>
          </details>
        ))}

        <div className="bg-green-50 border border-green-100 rounded-xl p-5 mt-6 text-center">
          <p className="text-slate-600 text-sm mb-3">¿Tienes más preguntas?</p>
          <Link
            href="https://wa.me/584143043337"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            📲 Contáctanos por WhatsApp
          </Link>
        </div>
      </div>
    </div>
  )
}
