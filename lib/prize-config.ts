/**
 * Official prize distribution for Quiniela Mundial 2026.
 * These are the defaults used when no database settings exist.
 * Admin can override via /admin/configuracion.
 */
export const DEFAULT_PRIZE_CONFIG = {
  firstPrizePercent:  65,  // 1er lugar
  secondPrizePercent: 20,  // 2do lugar
  organizationPercent: 15, // Organización
} as const

/** Official prize description string — use everywhere instead of inline text. */
export const PRIZE_DESCRIPTION =
  'El 65% del fondo va al primer lugar, el 20% al segundo lugar y el 15% restante cubre los gastos de organizaci\u{00F3}n.'
