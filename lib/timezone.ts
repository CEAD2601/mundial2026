import { format, toZonedTime } from 'date-fns-tz'
import { es } from 'date-fns/locale'

export const VET_TIMEZONE = 'America/Caracas'

export function toVenezuelaTime(utcDate: Date): Date {
  return toZonedTime(utcDate, VET_TIMEZONE)
}

export function formatVenezuelaTime(utcDate: Date, fmt: string): string {
  const vetDate = toZonedTime(utcDate, VET_TIMEZONE)
  return format(vetDate, fmt, { timeZone: VET_TIMEZONE, locale: es })
}

export function formatMatchDate(utcDate: Date): string {
  return formatVenezuelaTime(utcDate, "EEEE d 'de' MMMM")
}

export function formatMatchTime(utcDate: Date): string {
  return formatVenezuelaTime(utcDate, 'HH:mm')
}

export function formatMatchTimePublic(utcDate: Date): string {
  return formatVenezuelaTime(utcDate, 'h:mm a')
}

export function formatMatchDateTime(utcDate: Date): string {
  return formatVenezuelaTime(utcDate, 'd MMM, HH:mm')
}
