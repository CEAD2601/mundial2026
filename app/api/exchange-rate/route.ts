import { NextResponse } from 'next/server'
import { getCurrentExchangeRate } from '@/lib/exchange-rate'

export async function GET() {
  const rate = await getCurrentExchangeRate()
  return NextResponse.json(rate)
}
