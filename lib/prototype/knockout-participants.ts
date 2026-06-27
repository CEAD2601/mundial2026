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

// ── Participantes previos de la Fase de Grupos ───────────────────────────────
// Estos se pueden "encontrar" cuando alguien busca por cédula o WhatsApp

// En producción esta lista se reemplaza por una consulta a la tabla Participant de Prisma
// (solo lectura, sin modificar datos reales).
export const PREV_PARTICIPANTS: KOParticipant[] = [
  // Participante confirmado de Fase de Grupos — cédula y WA usados como prueba de búsqueda
  { cedula: '24974565', nombre: 'Participante Fase de Grupos',    displayName: 'Participante FG',  whatsapp: '04265205461', ciudad: null,         email: null,               previousRound: 'grupos', registeredAt: '2026-05-01T09:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '12345678', nombre: 'Carlos Eduardo Acosta Delgado', displayName: 'Carlos Acosta',    whatsapp: '04141234567', ciudad: 'Caracas',    email: 'carlos@demo.com',  previousRound: 'grupos', registeredAt: '2026-05-01T10:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '8765432',  nombre: 'María Fernanda López Ríos',     displayName: 'María López',      whatsapp: '04241112233', ciudad: 'Valencia',   email: null,               previousRound: 'grupos', registeredAt: '2026-05-02T11:30:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '15234567', nombre: 'José Antonio Ramírez Blanco',   displayName: 'José Ramírez',     whatsapp: '04121234567', ciudad: 'Maracaibo',  email: null,               previousRound: 'grupos', registeredAt: '2026-05-03T09:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '11987654', nombre: 'Luisa Margarita Torres Cruz',   displayName: 'Luisa Torres',     whatsapp: '04161234567', ciudad: 'Barquisimeto',email: null,              previousRound: 'grupos', registeredAt: '2026-05-04T14:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '9876543',  nombre: 'Andrés Felipe Morales Vega',    displayName: 'Andrés Morales',   whatsapp: '04241234567', ciudad: 'Caracas',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-05T16:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '14321987', nombre: 'Valentina Díaz Hernández',      displayName: 'Valentina Díaz',   whatsapp: '04261234567', ciudad: 'Mérida',     email: null,               previousRound: 'grupos', registeredAt: '2026-05-06T10:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '6789012',  nombre: 'Roberto Carlos Jiménez Pinto',  displayName: 'Roberto Jiménez',  whatsapp: '04141123456', ciudad: 'Caracas',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-07T09:30:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '13456789', nombre: 'Gabriela Elena Suárez Montoya', displayName: 'Gabriela Suárez',  whatsapp: '04121323456', ciudad: 'Valencia',   email: null,               previousRound: 'grupos', registeredAt: '2026-05-08T11:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '20123456', nombre: 'Daniel Eduardo Pérez Ávila',    displayName: 'Daniel Pérez',     whatsapp: '04241453456', ciudad: 'Maracay',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-09T12:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '18765432', nombre: 'Sofía Alejandra Castillo Ruiz', displayName: 'Sofía Castillo',   whatsapp: '04141823456', ciudad: 'Caracas',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-10T15:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '7654321',  nombre: 'Miguel Ángel Herrera Soto',     displayName: 'Miguel Herrera',   whatsapp: '04261353456', ciudad: 'Barinas',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-11T10:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
  { cedula: '16543210', nombre: 'Paola Andrea Rojas Mendoza',    displayName: 'Paola Rojas',      whatsapp: '04141453256', ciudad: 'Maturín',    email: null,               previousRound: 'grupos', registeredAt: '2026-05-12T09:00:00-04:00', paymentStatus: 'verified', enrolledInKO: false },
]

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

// Busca en lista previa (Fase de Grupos) por cédula o WhatsApp
// Producción: conectaría a la tabla real de Participant/PoolEntry de Prisma.
export function lookupPrevParticipant(query: string): KOParticipant | null {
  const qCed   = normalizeCedula(query)
  const qPhone = normalizePhone(query)
  return PREV_PARTICIPANTS.find(p =>
    normalizeCedula(p.cedula) === qCed ||
    normalizePhone(p.whatsapp) === qPhone
  ) ?? null
}

// Busca en inscritos de Eliminatorias por cédula (solo dígitos)
export function findEnrolled(cedula: string, enrolled: KOParticipant[]): KOParticipant | null {
  const norm = normalizeCedula(cedula)
  return enrolled.find(p => normalizeCedula(p.cedula) === norm) ?? null
}
