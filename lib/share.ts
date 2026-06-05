/**
 * Share utilities - Quiniela Mundial 2026
 *
 * Every non-ASCII character (emojis + accented letters) is a \u escape.
 * The file is therefore pure 7-bit ASCII — zero encoding/CRLF risk.
 */
import { getPublicAppUrl } from './app-url'

// Emojis (4-byte Unicode, safest as \u{...} escapes)
const ICO_BALL   = '\u{26BD}'    // =  ⚽
const ICO_TROPHY = '\u{1F3C6}'   // =  🏆
const ICO_PHONE  = '\u{1F4F1}'   // =  📱
const ICO_PIN    = '\u{1F4CC}'   // =  📌
const ICO_POINT  = '\u{1F449}'   // =  👉

// Accented / special Latin characters
const CH_U_CAP   = 'Ú'  // Ú
const CH_O_LOW   = 'ó'  // ó
const CH_EXCL_I  = '¡'  // ¡

export function getWhatsAppShareUrl(message: string): string {
  return 'https://wa.me/?text=' + encodeURIComponent(message)
}

export function getInviteMessage(appUrl?: string): string {
  const url = (appUrl ?? getPublicAppUrl()).replace(/\/$/, '')

  const lines = [
    ICO_BALL + ' ' + CH_U_CAP + 'nete a la Quiniela Mundial 2026.',
    '',
    'Predice los marcadores de los 72 partidos, compite con tus amigos y participa por el premio.',
    '',
    ICO_TROPHY + ' Entrada: 20 USD / 14.600 Bs',
    ICO_PHONE  + ' Pago M' + CH_O_LOW + 'vil Banesco disponible.',
    ICO_PIN    + ' Tasa fija: 730 Bs/USD',
    '',
    ICO_POINT  + ' ' + url + '/',
    '',
    CH_EXCL_I  + 'Llena tu quiniela antes de que cierre la inscripci' + CH_O_LOW + 'n!',
  ]

  return lines.join('\n')
}

/** Convenience: message + wa.me URL in one call. */
export function getInviteFriendsWhatsAppUrl(appUrl?: string): string {
  return getWhatsAppShareUrl(getInviteMessage(appUrl))
}

/** @deprecated */
export function getAppUrl(): string {
  return getPublicAppUrl()
}
