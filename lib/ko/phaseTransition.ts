import { prisma } from '@/lib/prisma'
import { KNOCKOUT_MATCHES } from '@/lib/prototype/knockout-data'

export const R32_MATCH_IDS  = KNOCKOUT_MATCHES.filter(m => m.stage === 'R32').map(m => m.id)
export const ACTIVE_PHASE_R32      = 'R32'
export const ACTIVE_PHASE_R16_FINAL = 'knockout_round_16_to_final'

// ── Helper: fase KO activa ────────────────────────────────────────────────────
export async function getActiveKOPhase(): Promise<string> {
  try {
    // Usar query raw para evitar error si la columna activeKOPhase no existe aún en DB
    const rows = await prisma.$queryRaw<Array<{ activeKOPhase?: string }>>`
      SELECT "activeKOPhase" FROM "Setting" LIMIT 1
    `
    return rows[0]?.activeKOPhase ?? ACTIVE_PHASE_R32
  } catch {
    // Columna no existe todavía (prisma db push pendiente) → fase por defecto R32
    return ACTIVE_PHASE_R32
  }
}

// ── ¿Están todos los partidos de R32 finalizados? ────────────────────────────
export async function isRoundOf32Complete(): Promise<{
  complete:  boolean
  finished:  number
  total:     number
  missing:   { id: string; label: string }[]
}> {
  const results = await prisma.kOMatchResult.findMany({
    where: { id: { in: R32_MATCH_IDS }, status: 'FINISHED' },
  })
  const finishedSet = new Set(results.map(r => r.id))
  const missing = KNOCKOUT_MATCHES
    .filter(m => m.stage === 'R32' && !finishedSet.has(m.id))
    .map(m => ({
      id:    m.id,
      label: `#${m.fifaMatchNumber} ${m.home.name ?? m.home.placeholder} vs ${m.away.name ?? m.away.placeholder}`,
    }))
  return {
    complete:  missing.length === 0,
    finished:  results.length,
    total:     R32_MATCH_IDS.length,
    missing,
  }
}

// ── Transición idempotente: cierra R32, abre R16-Final ───────────────────────
export async function closeRoundOf32AndOpenR16Final(): Promise<{
  success:     boolean
  message:     string
  alreadyDone: boolean
}> {
  const { complete, finished, total, missing } = await isRoundOf32Complete()
  if (!complete) {
    const names = missing.map(m => m.label).join(' · ')
    return {
      success:     false,
      alreadyDone: false,
      message:     `Faltan ${total - finished}/${total} partidos por finalizar: ${names}`,
    }
  }

  // Idempotencia: si ya está en la fase correcta, no hacer nada
  const settings = await prisma.setting.findFirst()
  if (settings?.activeKOPhase === ACTIVE_PHASE_R16_FINAL) {
    return { success: true, alreadyDone: true, message: 'La transición ya fue realizada anteriormente.' }
  }

  // Snapshot histórico — solo si no existe (idempotente)
  const existingSnapshot = await (prisma as any).kOPhaseSnapshot.findUnique({
    where: { phase: ACTIVE_PHASE_R32 },
  }).catch(() => null)

  if (!existingSnapshot) {
    const participants = await prisma.kOParticipant.findMany({
      where:   { phase: ACTIVE_PHASE_R32 },
      include: { ranking: true, payment: true },
    })

    const ranked = participants
      .map(p => ({
        position:          p.ranking?.currentPosition ?? 0,
        participantId:     p.id,
        name:              p.fullName,
        code:              p.participationCode,
        points:            p.ranking?.totalPoints        ?? 0,
        exactScores:       p.ranking?.exactScores        ?? 0,
        classifiedCorrect: p.ranking?.classifiedCorrect  ?? 0,
        penaltyBonuses:    p.ranking?.penaltyBonus       ?? 0,
        playedMatches:     p.ranking?.playedMatches      ?? 0,
        paymentStatus:     p.payment?.paymentStatus      ?? 'PENDING',
      }))
      .sort((a, b) => (a.position || 999) - (b.position || 999) || b.points - a.points)

    await (prisma as any).kOPhaseSnapshot.create({
      data: {
        phase:             ACTIVE_PHASE_R32,
        title:             'Ranking Final — Dieciseisavos',
        totalParticipants: participants.length,
        dataJson:          JSON.stringify({
          phase:             ACTIVE_PHASE_R32,
          title:             'Ranking Final — Dieciseisavos',
          finalizedAt:       new Date().toISOString(),
          totalParticipants: participants.length,
          participants:      ranked,
        }),
      },
    })
  }

  // Cambiar fase activa
  if (settings) {
    await prisma.setting.update({
      where: { id: settings.id },
      data:  { activeKOPhase: ACTIVE_PHASE_R16_FINAL },
    })
  } else {
    await prisma.setting.create({ data: { activeKOPhase: ACTIVE_PHASE_R16_FINAL } })
  }

  return {
    success:     true,
    alreadyDone: false,
    message:     '✅ Dieciseisavos cerrado. Octavos a Final está ahora activa.',
  }
}
