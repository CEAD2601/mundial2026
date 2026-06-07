/**
 * WhatsApp utilities — Quiniela Mundial 2026
 */

/**
 * Converts a Venezuelan phone number to WhatsApp international format.
 * 04143043337  →  584143043337
 */
export function formatVenezuelanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('58')) return digits
  if (digits.startsWith('0')) return '58' + digits.slice(1)
  return '58' + digits
}

// ── Pago Móvil ──────────────────────────────────────────────────────────────

export interface PagoMovilProofParams {
  adminPhone: string
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

export function getPagoMovilWhatsAppUrl(params: PagoMovilProofParams): string {
  const { adminPhone, name, nationalId, phone, participationCode,
          amountVes, amountUsd, fixedExchangeRate,
          senderBank, paymentReference, paymentDate } = params

  const waPhone = formatVenezuelanPhoneForWhatsApp(adminPhone)
  const vesFormatted = Math.round(amountVes).toLocaleString('es-VE', { maximumFractionDigits: 0 })

  const message =
    `Hola, ya realicé el pago de la Quiniela Mundial 2026.\n\n` +
    `Nombre: ${name}\n` +
    `Cédula: ${nationalId}\n` +
    `WhatsApp: ${phone}\n` +
    `Código: ${participationCode}\n` +
    `Método de pago: Pago Móvil\n` +
    `Monto: ${vesFormatted} Bs\n` +
    `Equivalente: ${amountUsd} USD\n` +
    `Tasa fija: ${fixedExchangeRate} Bs/USD\n` +
    `Banco emisor: ${senderBank || '[coloca aquí tu banco]'}\n` +
    `Referencia: ${paymentReference || '[coloca aquí la referencia]'}\n` +
    `Fecha de pago: ${paymentDate || '[coloca aquí la fecha]'}\n\n` +
    `Adjunto comprobante de pago.`

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
}

// ── Zelle ────────────────────────────────────────────────────────────────────

export interface ZelleProofParams {
  adminPhone: string
  name: string
  nationalId: string
  phone: string
  participationCode: string
  amountUsd: number
  zelleEmail: string
  senderName?: string
  senderContact?: string      // email or phone used to send Zelle
  paymentReference?: string
  paymentDate?: string
}

export function getZelleWhatsAppUrl(params: ZelleProofParams): string {
  const { adminPhone, name, nationalId, phone, participationCode,
          amountUsd, zelleEmail,
          senderName, senderContact, paymentReference, paymentDate } = params

  const waPhone = formatVenezuelanPhoneForWhatsApp(adminPhone)

  const message =
    `Hola, ya realicé el pago de la Quiniela Mundial 2026.\n\n` +
    `Nombre: ${name}\n` +
    `Cédula: ${nationalId}\n` +
    `WhatsApp: ${phone}\n` +
    `Código: ${participationCode}\n` +
    `Método de pago: Zelle\n` +
    `Monto: ${amountUsd} USD\n` +
    `Zelle enviado a: ${zelleEmail}\n` +
    `Nombre del emisor: ${senderName || '[coloca aquí tu nombre]'}\n` +
    `Correo/teléfono del emisor: ${senderContact || '[coloca aquí tu correo o teléfono]'}\n` +
    `Referencia: ${paymentReference || '[coloca aquí la referencia]'}\n` +
    `Fecha de pago: ${paymentDate || '[coloca aquí la fecha]'}\n\n` +
    `Adjunto comprobante de pago.`

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
}

// ── Legacy (backward compat) ─────────────────────────────────────────────────

export interface PaymentProofParams extends PagoMovilProofParams {}

export function getPaymentProofWhatsAppUrl(params: PaymentProofParams): string {
  return getPagoMovilWhatsAppUrl(params)
}
