import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

function detectDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/Chrome\//i.test(ua)) return 'Chrome'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Safari\//i.test(ua)) return 'Safari'
  return 'Otro'
}

function generateId(): string {
  return `an_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      eventType,
      path,
      visitorId,
      participantId,
      matchId,
      metadata,
    } = body

    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') ?? ''
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? ''

    const country = req.headers.get('x-vercel-ip-country') ?? null
    const region  = req.headers.get('x-vercel-ip-country-region') ?? null
    const city    = req.headers.get('x-vercel-ip-city') ?? null

    await prisma.analyticsEvent.create({
      data: {
        id: generateId(),
        eventType: String(eventType).slice(0, 64),
        path: String(path ?? '/').slice(0, 256),
        visitorId: visitorId ? String(visitorId).slice(0, 64) : null,
        participantId: participantId ? String(participantId).slice(0, 64) : null,
        matchId: matchId ? String(matchId).slice(0, 64) : null,
        country,
        region,
        city: city ? decodeURIComponent(city) : null,
        deviceType: detectDevice(ua),
        browser: detectBrowser(ua),
        ipHash: ip ? hashIp(ip) : null,
        metadata: metadata ? JSON.stringify(metadata).slice(0, 1024) : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never crash the client experience — silently swallow analytics errors
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
