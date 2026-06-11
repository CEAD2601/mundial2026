// Shared prize pool calculation utility — used by landing page API and admin dashboard

export interface PrizePoolInput {
  verifiedPaymentsCount: number
  entryPriceUsd: number
  fixedExchangeRate: number
  firstPrizePercent: number
  secondPrizePercent: number
  organizationPercent: number
}

export interface PrizePoolStats {
  verifiedPaymentsCount: number
  entryPriceUsd: number
  fixedExchangeRate: number
  firstPrizePercent: number
  secondPrizePercent: number
  organizationPercent: number
  totalPoolUsd: number
  totalPoolVes: number
  firstPrizeUsd: number
  firstPrizeVes: number
  secondPrizeUsd: number
  secondPrizeVes: number
  organizationUsd: number
  organizationVes: number
}

export function calculatePrizePool(input: PrizePoolInput): PrizePoolStats {
  const { verifiedPaymentsCount, entryPriceUsd, fixedExchangeRate, firstPrizePercent, secondPrizePercent, organizationPercent } = input
  const totalPoolUsd = verifiedPaymentsCount * entryPriceUsd
  const totalPoolVes = Math.round(totalPoolUsd * fixedExchangeRate)
  const firstPrizeUsd = Math.round((totalPoolUsd * firstPrizePercent) / 100)
  const firstPrizeVes = Math.round(firstPrizeUsd * fixedExchangeRate)
  const secondPrizeUsd = Math.round((totalPoolUsd * secondPrizePercent) / 100)
  const secondPrizeVes = Math.round(secondPrizeUsd * fixedExchangeRate)
  const organizationUsd = Math.round((totalPoolUsd * organizationPercent) / 100)
  const organizationVes = Math.round(organizationUsd * fixedExchangeRate)
  return {
    verifiedPaymentsCount,
    entryPriceUsd,
    fixedExchangeRate,
    firstPrizePercent,
    secondPrizePercent,
    organizationPercent,
    totalPoolUsd,
    totalPoolVes,
    firstPrizeUsd,
    firstPrizeVes,
    secondPrizeUsd,
    secondPrizeVes,
    organizationUsd,
    organizationVes,
  }
}

export function fmtUsd(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`
}

export function fmtVes(n: number): string {
  return `${n.toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs`
}

// Default settings fallback (matches DB defaults)
export const DEFAULT_PRIZE_SETTINGS = {
  entryPriceUsd: 20,
  fixedExchangeRate: 730,
  firstPrizePercent: 65,
  secondPrizePercent: 20,
  organizationPercent: 15,
} as const
