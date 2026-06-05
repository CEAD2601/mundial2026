/**
 * WhatsApp utilities — Quiniela Mundial 2026
 */

/**
 * Converts a Venezuelan phone number to WhatsApp international format.
 * 04143043337  →  584143043337
 * +58414...    →  58414...
 */
export function formatVenezuelanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('58')) return digits
  if (digits.startsWith('0')) return '58' + digits.slice(1)
  return '58' + digits
}

export interface PaymentProofParams {
  adminPhone: string          // e.g. 04143043337
  name: string
  nationalId: string
  phone: string
  participationCode: string
  amountVes: number
  amountUsd: number
  fixedExchangeRate: number
  senderBank?: string
  paymentReference?: string
  paymentDate?: string
}

/**
 * Builds a wa.me URL pre-filled with payment proof details.
 */
export function getPaymentProofWhatsAppUrl(params: PaymentProofParams): string {
  const {
    adminPhone,
    name,
    nationalId,
    phone,
    participationCode,
    amountVes,
    amountUsd,
    fixedExchangeRate,
    senderBank,
    paymentReference,
    paymentDate,
  } = params

  const waPhone = formatVenezuelanPhoneForWhatsApp(adminPhone)

  const vesFormatted = amountVes.toLocaleString('es-VE', { maximumFractionDigits: 0 })

  const message = `Hola, ya realicé el pago de la Quiniela Mundial 2026.

Nombre: ${name}
Cédula: ${nationalId}
WhatsApp: ${phone}
Código: ${participationCode}
Monto: ${vesFormatted} Bs
Equivalente: ${amountUsd} USD
Tasa fija: ${fixedExchangeRate} Bs/USD
Banco emisor: ${senderBank || '[coloca aquí tu banco]'}
Referencia: ${paymentReference || '[coloca aquí la referencia]'}
Fecha de pago: ${paymentDate || '[coloca aquí la fecha]'}

Adjunto comprobante de pago.`

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
}
