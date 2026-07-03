import { NextRequest, NextResponse } from 'next/server'
import { isRoundOf32Complete, closeRoundOf32AndOpenR16Final } from '@/lib/ko/phaseTransition'
import { revalidatePath } from 'next/cache'

export const dynamic  = 'force-dynamic'
export const revalidate = 0

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_session')?.value === 'authenticated'
}

// GET — estado de completitud de R32
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const status = await isRoundOf32Complete()
  return NextResponse.json(status)
}

// POST — ejecutar transición (idempotente)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const result = await closeRoundOf32AndOpenR16Final()

  if (result.success) {
    revalidatePath('/')
    revalidatePath('/eliminatorias/ranking')
    revalidatePath('/eliminatorias/stats')
    revalidatePath('/eliminatorias/resultados')
    revalidatePath('/eliminatorias/cuadro')
    revalidatePath('/admin')
    revalidatePath('/octavos/registro')
  }

  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}
