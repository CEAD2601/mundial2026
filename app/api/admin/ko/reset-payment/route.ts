import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'CEAD2601'

// GET /api/admin/ko/reset-payment?secret=CEAD2601&code=KO26-XXXXX
// Resetea el pago de un participante KO a PENDING (para correcciones de testing)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const code   = searchParams.get('code')

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!code) {
    return NextResponse.json({ error: 'code requerido' }, { status: 400 })
  }

  const participant = await prisma.kOParticipant.findUnique({
    where: { participationCode: code },
    include: { payment: true },
  })
  if (!participant) {
    return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })
  }
  if (!participant.payment) {
    return NextResponse.json({ error: 'Sin registro de pago' }, { status: 404 })
  }

  await prisma.kOPayment.update({
    where: { participantId: participant.id },
    data: {
      paymentStatus:    'PENDING',
      adminNotes:       null,
      verifiedAt:       null,
      rejectedAt:       null,
      paymentReference: null,
    },
  })

  return NextResponse.json({
    ok:   true,
    code: participant.participationCode,
    name: participant.fullName,
    status: 'PENDING',
  })
}
