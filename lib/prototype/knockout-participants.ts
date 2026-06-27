/**
 * Participantes mock — Quiniela Eliminatorias 2026
 * Prototipo privado. No conecta con DB real ni Prisma.
 * Fuente: sessionStorage + datos hardcodeados de la fase anterior.
 */

export type PreviousRound = 'grupos' | null

export interface KOParticipant {
  cedula: string        // identificador principal
  nombre: string
  displayName: string   // primer nombre + primer apellido
  whatsapp: string
  ciudad: string | null
  email: string | null
  previousRound: PreviousRound   // viene de fase de grupos?
  registeredAt: string           // ISO timestamp
  paymentStatus: 'pending' | 'verified' | 'rejected'
  enrolledInKO: boolean
}

export interface KORankingEntry {
  cedula: string
  displayName: string
  ciudad: string | null
  totalPoints: number
  exactScores: number
  correctResults: number
  wrongPredictions: number
  playedMatches: number
  previousPosition: number | null
  movement: number
  paymentStatus: 'pending' | 'verified' | 'rejected'
}

// ── Participantes previos ─────────────────────────────────────────────────────
// ATENCIÓN: Este array es SOLO para datos de demo del ranking y UI del prototipo.
// NO se usa para el flujo "Ya participé antes" — ese flujo consulta la DB real
// a través de /api/admin/ko-prototype/lookup (solo lectura, nunca modifica datos).
//
// Las cédulas y nombres aquí son ficticios. No representan participantes reales.
export const PREV_PARTICIPANTS: KOParticipant[] = []

// ── Ranking mock para Eliminatorias ──────────────────────────────────────────
// Con movimientos de posición (demo con 0 partidos jugados = todos empatan)

export const KO_DEMO_RANKING: KORankingEntry[] = [
  { cedula: '12345678', displayName: 'Carlos Acosta',    ciudad: 'Caracas',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '8765432',  displayName: 'María López',      ciudad: 'Valencia',    totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '15234567', displayName: 'José Ramírez',     ciudad: 'Maracaibo',   totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '11987654', displayName: 'Luisa Torres',     ciudad: 'Barquisimeto',totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '9876543',  displayName: 'Andrés Morales',   ciudad: 'Caracas',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '14321987', displayName: 'Valentina Díaz',   ciudad: 'Mérida',      totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '6789012',  displayName: 'Roberto Jiménez',  ciudad: 'Caracas',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '13456789', displayName: 'Gabriela Suárez',  ciudad: 'Valencia',    totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '20123456', displayName: 'Daniel Pérez',     ciudad: 'Maracay',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '18765432', displayName: 'Sofía Castillo',   ciudad: 'Caracas',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '7654321',  displayName: 'Miguel Herrera',   ciudad: 'Barinas',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
  { cedula: '16543210', displayName: 'Paola Rojas',      ciudad: 'Maturín',     totalPoints: 0, exactScores: 0, correctResults: 0, wrongPredictions: 0, playedMatches: 0, previousPosition: null, movement: 0, paymentStatus: 'verified' },
]

// Storage keys para el prototipo
export const KO_PARTICIPANTS_KEY = 'ko-proto-v3-participants'
export const KO_ENROLLED_KEY     = 'ko-proto-v3-enrolled'

// ── Storage helpers ──────────────────────────────────────────────────────────

export function loadKOEnrolled(): KOParticipant[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(sessionStorage.getItem(KO_ENROLLED_KEY) || '[]') } catch { return [] }
}

export function saveKOEnrolled(list: KOParticipant[]) {
  sessionStorage.setItem(KO_ENROLLED_KEY, JSON.stringify(list))
}

// ── Normalización ────────────────────────────────────────────────────────────

// Normaliza cédula venezolana a solo dígitos.
// Acepta: 12345678 · V12345678 · V-12345678 · v-12345678 · 12.345.678 · V-12.345.678
export function normalizeCedula(value: string): string {
  return value.trim()
    .toUpperCase()
    .replace(/\./g, '')    // quitar puntos
    .replace(/[\s\-]/g, '') // quitar espacios y guiones
    .replace(/^V/i, '')    // quitar prefijo V
}

// Normaliza número de teléfono a últimos 10 dígitos.
// Acepta: 04141234567 · +584141234567 · 58 414 1234567 · 0414-123-4567 · 4141234567
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('58') && digits.length === 12) return digits.slice(2)
  if (digits.startsWith('0') && digits.length === 11) return digits.slice(1)
  return digits.slice(-10)
}

// Busca en inscritos de Eliminatorias por cédula (solo dígitos)
export function findEnrolled(cedula: string, enrolled: KOParticipant[]): KOParticipant | null {
  const norm = normalizeCedula(cedula)
  return enrolled.find(p => normalizeCedula(p.cedula) === norm) ?? null
}
