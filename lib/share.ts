/**
 * Share utilities for Quiniela Mundial 2026
 */

/**
 * Returns the app's public URL, never localhost in production.
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to origin.
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: use NEXT_PUBLIC_APP_URL if set, otherwise current origin
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    if (envUrl && !envUrl.includes('localhost')) return envUrl
    return window.location.origin
  }
  // Server: use NEXT_PUBLIC_APP_URL
  return process.env.NEXT_PUBLIC_APP_URL ?? 'https://mundial2026-nine-psi.vercel.app'
}

/**
 * Builds a WhatsApp share URL with the given message.
 */
export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

/**
 * The default WhatsApp invitation message for the landing page.
 */
export function getInviteMessage(appUrl: string): string {
  return `⚽ Únete a la Quiniela Mundial 2026.

Predice los marcadores de los 72 partidos, compite con tus amigos y participa por el premio.

🏆 Entrada: 20 USD
📱 Pago Móvil disponible en Bs.

👉 ${appUrl}

¡Llena tu quiniela antes de que cierre la inscripción!`
}
