import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyResultToDb } from '@/lib/liveResultsService'
import { z } from 'zod'

const updateResultSchema = z.object({
  matchId: z.string(),
  team1Goals: z.number().int().min(0),
  team2Goals: z.number().int().min(0),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = updateResultSchema.parse(body)

    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: { team1: true, team2: true },
    })
    if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

    const actualResult: 'G1' | 'E' | 'G2' =
      data.team1Goals > data.team2Goals ? 'G1' :
      data.team1Goals < data.team2Goals ? 'G2' : 'E'

    // Use the shared applyResultToDb which correctly captures position snapshots
    await applyResultToDb(data.matchId, data.team1Goals, data.team2Goals, 'manual')

    // Audit log
    const resultLabel =
      actualResult === 'G1' ? `Gana ${match.team1.shortName}` :
      actualResult === 'G2' ? `Gana ${match.team2.shortName}` : 'Empate'
    await prisma.auditLog.create({
      data: {
        action: `Resultado: ${match.team1.displayName} ${data.team1Goals}-${data.team2Goals} ${match.team2.displayName} (${resultLabel}) · Partido #${match.matchNumber}`,
        entityType: 'Match',
        entityId: data.matchId,
        newValue: `${data.team1Goals}-${data.team2Goals}`,
      },
    }).catch(() => {})

    return NextResponse.json({ success: true, result: actualResult, matchNumber: match.matchNumber })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const matches = await prisma.match.findMany({
    include: { team1: true, team2: true },
    orderBy: { kickoffUtc: 'asc' },
  })
  return NextResponse.json({ matches })
}
