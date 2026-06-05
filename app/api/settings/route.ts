import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.setting.findFirst()
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const existing = await prisma.setting.findFirst()

    if (existing) {
      const updated = await prisma.setting.update({
        where: { id: existing.id },
        data: body,
      })
      return NextResponse.json({ settings: updated })
    } else {
      const created = await prisma.setting.create({ data: { ...body, id: 'default' } })
      return NextResponse.json({ settings: created })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
