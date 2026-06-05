/**
 * Share utilities for Quiniela Mundial 2026
 */
import { getPublicAppUrl } from './app-url'

export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function getInviteMessage(appUrl?: string): string {
  const url = appUrl ?? getPublicAppUrl()
  return `⚽ Únete a la Quiniela Mundial 2026.

Predice los marcadores de los 72 partidos, compite con tus amigos y participa por el premio.

🏆 Entrada: 20 USD / 14.600 Bs
📱 Pago Móvil Banesco disponible.
📌 Tasa fija: 730 Bs/USD

👉 ${url}/

¡Llena tu quiniela antes de que cierre la inscripción!`
}

/** @deprecated Pass appUrl explicitly or omit; it now uses getPublicAppUrl() as default. */
export function getAppUrl(): string {
  return getPublicAppUrl()
}
