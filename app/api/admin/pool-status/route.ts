import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { isRegistrationOpen } from '@/lib/deadline'
import type { PoolStatus } from '@/lib/pool-status'

export const dynamic = 'force-dynamic'

const VALID_STATUSES: PoolStatus[] = [
  'OPEN', 'CLOSED', 'IN_PROGRESS', 'FINISHED', 'WAITING_NEXT_ROUND',
]

async function requireAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const settings = await prisma.setting.findFirst()
  const dbStatus = (settings?.poolStatus ?? 'OPEN') as PoolStatus
  const effectiveStatus: PoolStatus =
    dbStatus === 'OPEN' && !isRegistrationOpen() ? 'CLOSED' : dbStatus

  return NextResponse.json({
    dbStatus,
    effectiveStatus,
    poolName:       settings?.poolName       ?? 'Quiniela Mundial 2026 - Fase de Grupos',
    poolPhase:      settings?.poolPhase      ?? 'GROUP_STAGE',
    nextPhaseLabel: settings?.nextPhaseLabel ?? 'Eliminación Directa',
    registrationOpen: effectiveStatus === 'OPEN',
    deadlinePassed: !isRegistrationOpen(),
  })
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await req.json()
  const { poolStatus, poolName, nextPhaseLabel } = body

  if (poolStatus && !VALID_STATUSES.includes(poolStatus)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const existing = await prisma.setting.findFirst()
  const data: Record<string, unknown> = {}
  if (poolStatus)      data.poolStatus      = poolStatus
  if (poolName)        data.poolName        = poolName
  if (nextPhaseLabel)  data.nextPhaseLabel  = nextPhaseLabel

  if (existing) {
    await prisma.setting.update({ where: { id: existing.id }, data })
  } else {
    await prisma.setting.create({ data })
  }

  await prisma.auditLog.create({
    data: {
      action: `Pool status actualizado: ${JSON.stringify(data)}`,
      entityType: 'Setting',
    },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
