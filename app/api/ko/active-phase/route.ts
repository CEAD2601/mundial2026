import { NextResponse } from 'next/server'
import { getActiveKOPhase } from '@/lib/ko/phaseTransition'

export const dynamic  = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const phase = await getActiveKOPhase()
  return NextResponse.json({ phase })
}
