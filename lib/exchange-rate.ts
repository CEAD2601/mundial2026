import { prisma } from './prisma'

export interface ExchangeRateResult {
  rate: number
  currency: string
  date: Date
  source: string
}

export async function getBcvEuroRate(): Promise<number | null> {
  try {
    // BCV API - try to fetch EUR rate
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/euro', {
      next: { revalidate: 3600 }, // cache for 1 hour
      signal: AbortSignal.timeout(5000),
    })
    if (response.ok) {
      const data = await response.json()
      if (data?.promedio) return parseFloat(data.promedio)
      if (data?.venta) return parseFloat(data.venta)
    }
  } catch {
    // fallback
  }
  return null
}

export async function getCurrentExchangeRate(): Promise<ExchangeRateResult> {
  const settings = await prisma.setting.findFirst()

  // Try to get live rate
  const liveRate = await getBcvEuroRate()
  if (liveRate && liveRate > 0) {
    return { rate: liveRate, currency: 'EUR', date: new Date(), source: 'BCV (live)' }
  }

  // Fall back to manual rate from settings
  if (settings?.manualExchangeRate && settings.manualExchangeRate > 0) {
    return {
      rate: settings.manualExchangeRate,
      currency: settings.exchangeRateCurrency,
      date: settings.manualExchangeRateDate ?? new Date(),
      source: 'Manual (admin)',
    }
  }

  // Default fallback rate
  return { rate: 55.0, currency: 'EUR', date: new Date(), source: 'Estimado' }
}
