import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Require admin session cookie
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const table = searchParams.get('table') ?? 'all'

  try {
    const data: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      exportedBy: 'admin',
      version: '1.0',
    }

    if (table === 'all' || table === 'participants') {
      data.participants = await prisma.participant.findMany({
        include: { payment: true },
        orderBy: { createdAt: 'asc' },
      })
    }
    if (table === 'all' || table === 'predictions') {
      data.predictions = await prisma.prediction.findMany({
        include: { match: { select: { matchNumber: true, group: true } } },
        orderBy: { createdAt: 'asc' },
      })
    }
    if (table === 'all' || table === 'matches') {
      data.matches = await prisma.match.findMany({
        include: { team1: true, team2: true },
        orderBy: { matchNumber: 'asc' },
      })
    }
    if (table === 'all' || table === 'rankings') {
      data.rankings = await prisma.rankingSnapshot.findMany({
        include: { participant: { select: { fullName: true, participationCode: true } } },
        orderBy: { currentPosition: 'asc' },
      })
    }
    if (table === 'all' || table === 'settings') {
      data.settings = await prisma.setting.findFirst()
    }
    if (table === 'all' || table === 'auditLogs') {
      data.auditLogs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1000,
      })
    }

    // Log the backup action
    await prisma.auditLog.create({
      data: {
        action: `Backup exportado: ${table}`,
        entityType: 'Backup',
      },
    }).catch(() => { /* non-critical */ })

    const json = JSON.stringify(data, null, 2)
    const date = new Date().toISOString().split('T')[0]
    const filename = table === 'all'
      ? `backup-quiniela-mundial-2026-${date}.json`
      : `backup-${table}-mundial-2026-${date}.json`

    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
