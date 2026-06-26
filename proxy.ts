import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL ?? '',
  'http://localhost:3000',
].filter(Boolean)

function isAdminRoute(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
}

function isAdminAuthRoute(pathname: string) {
  return pathname === '/api/admin/auth' || pathname === '/api/admin/auth/check'
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const origin = req.headers.get('origin') ?? ''

  // ── CORS ──────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const isAllowedOrigin =
      !origin ||
      ALLOWED_ORIGINS.includes(origin)

    if (!isAllowedOrigin) {
      return new NextResponse(null, { status: 403, statusText: 'Forbidden' })
    }

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
  }

  // ── ROLE-BASED ACCESS CONTROL ─────────────────────────────────────────────
  if (isAdminRoute(pathname) && !isAdminAuthRoute(pathname)) {
    const session = req.cookies.get('admin_session')?.value

    if (session !== 'authenticated') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'No autorizado. Inicia sesión como administrador.' },
          { status: 401 }
        )
      }
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const res = NextResponse.next()

  // ── CORS HEADERS on allowed API responses ─────────────────────────────────
  if (pathname.startsWith('/api/') && origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Vary', 'Origin')
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
