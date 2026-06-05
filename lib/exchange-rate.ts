/**
 * Exchange rate utilities — Quiniela Mundial 2026
 *
 * Uses a FIXED exchange rate configured by the admin (default: 700 Bs/USD).
 * This replaces the previous volatile BCV EUR rate approach.
 */

import { prisma } from './prisma'

export interface ExchangeRateResult {
  rate: number
  currency: string
  date: Date
  source: string
}

const DEFAULT_FIXED_RATE = 700

/**
 * Returns the fixed exchange rate from admin settings.
 * Default: 700 Bs per USD.
 */
export async function getCurrentExchangeRate(): Promise<ExchangeRateResult> {
  try {
    const settings = await prisma.setting.findFirst()
    const rate = settings?.fixedExchangeRate ?? DEFAULT_FIXED_RATE
    return {
      rate,
      currency: 'USD',
      date: new Date(),
      source: 'Tasa fija',
    }
  } catch {
    return {
      rate: DEFAULT_FIXED_RATE,
      currency: 'USD',
      date: new Date(),
      source: 'Tasa fija (default)',
    }
  }
}

/**
 * Format Bs amount with dot thousands separator.
 * e.g. 14000 → "14.000"
 */
export function formatVes(amount: number): string {
  return amount.toLocaleString('es-VE', { maximumFractionDigits: 0 })
}

/**
 * Calculate Bs equivalent for a USD amount at a given fixed rate.
 */
export function usdToVes(amountUsd: number, fixedRate: number): number {
  return Math.round(amountUsd * fixedRate)
}

/**
 * @deprecated Not used in main flow. Kept for reference only.
 */
export async function getBcvEuroRate(): Promise<number | null> {
  return null
}
