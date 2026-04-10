import { NextRequest, NextResponse } from 'next/server';

const APP_PASSWORD = process.env.APP_PASSWORD || '';

export function middleware(request: NextRequest) {
  // If no password is set, allow all requests
  if (!APP_PASSWORD) {
    return NextResponse.next();
  }

  // Allow the login page and health check (needed for Render/Docker health probes)
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/api/v1/health') {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('rm_auth')?.value;
  if (authCookie === APP_PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to login for pages, return 401 for API calls
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
