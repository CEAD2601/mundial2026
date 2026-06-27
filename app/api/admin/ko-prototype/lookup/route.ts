/**
 * GET /api/admin/ko-prototype/lookup
 * Busca un participante real de la Fase de Grupos por cédula o teléfono.
 * Solo lectura — nunca modifica la base de datos.
 * Protegido por cookie admin_session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

// Strips dots, dashes, spaces, and leading V/v to get bare digits.
function normalizeCedula(value: string): string {
  return value.trim()
    .replace(/\./g, '')
    .replace(/[\s\-]/g, '')
    .replace(/^[Vv]/, '')
}

// Returns last 10 digits to normalize any Venezuelan phone format.
function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.slice(-10)
}

function mapPaymentStatus(
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | undefined
): 'pending' | 'verified' | 'rejected' {
  if (status === 'VERIFIED') return 'verified'
  if (status === 'REJECTED') return 'rejected'
  return 'pending'
}

export async function GET(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const cedula = searchParams.get('cedula') ?? ''
  const phone  = searchParams.get('phone') ?? ''

  if (!cedula && !phone) {
    return NextResponse.json({ error: 'Se requiere cedula o phone' }, { status: 400 })
  }

  let participant: Awaited<ReturnType<typeof prisma.participant.findFirst>> = null

  if (cedula) {
    const norm = normalizeCedula(cedula)
    participant = await prisma.participant.findFirst({
      where: { nationalId: norm },
      include: { payment: true },
    })
  } else {
    // Match last 10 digits so any Venezuelan format works
    const last10 = normalizePhone(phone)
    participant = await prisma.participant.findFirst({
      where: { phone: { endsWith: last10 } },
      include: { payment: true },
    })
  }

  if (!participant) {
    return NextResponse.json({ found: false, dataSource: 'real-db-readonly' })
  }

  // Derive a short display name: first name + first surname
  const nameParts = participant.fullName.trim().split(/\s+/)
  const displayName = nameParts.length >= 2
    ? `${nameParts[0]} ${nameParts[1]}`
    : nameParts[0] ?? participant.fullName

  // @ts-expect-error payment is included via include
  const paymentStatus = mapPaymentStatus(participant.payment?.paymentStatus)

  return NextResponse.json({
    found: true,
    dataSource: 'real-db-readonly',
    participant: {
      cedula:        participant.nationalId,
      nombre:        participant.fullName,
      displayName,
      whatsapp:      participant.phone,
      ciudad:        participant.city ?? null,   // null if not provided
      email:         participant.email ?? null,  // null if not provided
      previousRound: 'grupos' as const,
      paymentStatus,
      enrolledInKO:  false,
      registeredAt:  participant.createdAt.toISOString(),
    },
  })
}
