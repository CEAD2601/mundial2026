export type PoolStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'WAITING_NEXT_ROUND'

export const POOL_STATUS_LABELS: Record<PoolStatus, string> = {
  OPEN:               'Abierta — Inscripciones activas',
  CLOSED:             'Cerrada — Inscripciones cerradas',
  IN_PROGRESS:        'En curso — Partidos en juego',
  FINISHED:           'Finalizada — Fase terminada',
  WAITING_NEXT_ROUND: 'Esperando siguiente ronda',
}

export const POOL_STATUS_COLORS: Record<PoolStatus, string> = {
  OPEN:               'bg-green-100 text-green-800 border-green-200',
  CLOSED:             'bg-slate-100 text-slate-700 border-slate-200',
  IN_PROGRESS:        'bg-blue-100 text-blue-800 border-blue-200',
  FINISHED:           'bg-purple-100 text-purple-800 border-purple-200',
  WAITING_NEXT_ROUND: 'bg-amber-100 text-amber-800 border-amber-200',
}

export function isAcceptingRegistrations(status: PoolStatus): boolean {
  return status === 'OPEN'
}

export function isActivePhase(status: PoolStatus): boolean {
  return status === 'IN_PROGRESS' || status === 'FINISHED' || status === 'WAITING_NEXT_ROUND'
}

export interface PublicPoolInfo {
  status: PoolStatus
  poolName: string
  poolPhase: string
  nextPhaseLabel: string
  registrationOpen: boolean
}
