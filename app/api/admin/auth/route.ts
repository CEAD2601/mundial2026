import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code } = body

  // Support legacy username/password for backwards compat
  const { username, password } = body
  const adminUser = process.env.ADMIN_USERNAME ?? 'admin'
  const adminPass = process.env.ADMIN_PASSWORD ?? 'mundial2026admin'
  const accessCode = process.env.ADMIN_ACCESS_CODE ?? 'CEAD2601'

  const validCode = code === accessCode
  const validLegacy = username === adminUser && password === adminPass

  if (!validCode && !validLegacy) {
    return NextResponse.json({ error: 'Código incorrecto. Intenta nuevamente.' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}
