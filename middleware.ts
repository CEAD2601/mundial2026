import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /admin/* routes
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Login page is always accessible — never redirect from here
  if (pathname === '/admin/login') return NextResponse.next()

  // Check cookie server-side
  const session = req.cookies.get('admin_session')?.value
  if (session !== 'authenticated') {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
