import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRegistrationOpen } from '@/lib/deadline'
import type { PoolStatus, PublicPoolInfo } from '@/lib/pool-status'

export const dynamic = 'force-dynamic'

const CORRECT_NEXT_PHASE = 'Octavos · Cuartos · Semifinales · Final'
const OLD_VALUES = ['Eliminación Directa', 'Eliminacion Directa', '']

export async function GET() {
  try {
    const settings = await prisma.setting.findFirst()

    const dbStatus = (settings?.poolStatus ?? 'OPEN') as PoolStatus
    const effectiveStatus: PoolStatus =
      dbStatus === 'OPEN' && !isRegistrationOpen() ? 'CLOSED' : dbStatus

    // Auto-fix stale nextPhaseLabel value in DB
    let nextPhaseLabel = settings?.nextPhaseLabel ?? CORRECT_NEXT_PHASE
    if (OLD_VALUES.includes(nextPhaseLabel) && settings?.id) {
      nextPhaseLabel = CORRECT_NEXT_PHASE
      await prisma.setting.update({
        where: { id: settings.id },
        data: { nextPhaseLabel: CORRECT_NEXT_PHASE },
      }).catch(() => {})
    }

    const info: PublicPoolInfo = {
      status: effectiveStatus,
      poolName:       settings?.poolName  ?? 'Quiniela Mundial 2026 - Fase de Grupos',
      poolPhase:      settings?.poolPhase ?? 'GROUP_STAGE',
      nextPhaseLabel,
      registrationOpen: effectiveStatus === 'OPEN',
    }

    return NextResponse.json(info)
  } catch {
    return NextResponse.json({
      status: isRegistrationOpen() ? 'OPEN' : 'CLOSED',
      poolName: 'Quiniela Mundial 2026 - Fase de Grupos',
      poolPhase: 'GROUP_STAGE',
      nextPhaseLabel: CORRECT_NEXT_PHASE,
      registrationOpen: isRegistrationOpen(),
    } satisfies PublicPoolInfo)
  }
}
