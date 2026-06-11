// Central registration deadline — single source of truth for all validation

// June 11 2026, 3:00 PM Venezuela time (VET = UTC-4) = 19:00:00 UTC
export const REGISTRATION_DEADLINE = new Date('2026-06-11T19:00:00.000Z')

/** Returns true while registrations are still open (before deadline) */
export function isRegistrationOpen(now: Date = new Date()): boolean {
  return now < REGISTRATION_DEADLINE
}

/** Server-side guard — throws a Response-compatible error if past deadline */
export function assertRegistrationOpen(now: Date = new Date()): void {
  if (!isRegistrationOpen(now)) {
    throw new RegistrationClosedError()
  }
}

export class RegistrationClosedError extends Error {
  constructor() {
    super('Las inscripciones ya cerraron.')
    this.name = 'RegistrationClosedError'
  }
}
