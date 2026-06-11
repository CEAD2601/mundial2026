import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRegistrationOpen } from '@/lib/deadline'
import type { PoolStatus, PublicPoolInfo } from '@/lib/pool-status'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await prisma.setting.findFirst()

    const dbStatus = (settings?.poolStatus ?? 'OPEN') as PoolStatus
    // If DB says OPEN but the deadline has passed, effective status is CLOSED
    const effectiveStatus: PoolStatus =
      dbStatus === 'OPEN' && !isRegistrationOpen() ? 'CLOSED' : dbStatus

    const info: PublicPoolInfo = {
      status: effectiveStatus,
      poolName:       settings?.poolName       ?? 'Quiniela Mundial 2026 - Fase de Grupos',
      poolPhase:      settings?.poolPhase      ?? 'GROUP_STAGE',
      nextPhaseLabel: settings?.nextPhaseLabel ?? 'Eliminación Directa',
      registrationOpen: effectiveStatus === 'OPEN',
    }

    return NextResponse.json(info)
  } catch {
    return NextResponse.json({
      status: isRegistrationOpen() ? 'OPEN' : 'CLOSED',
      poolName: 'Quiniela Mundial 2026 - Fase de Grupos',
      poolPhase: 'GROUP_STAGE',
      nextPhaseLabel: 'Octavos · Cuartos · Semifinales · Final',
      registrationOpen: isRegistrationOpen(),
    } satisfies PublicPoolInfo)
  }
}
