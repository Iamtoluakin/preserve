import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'preserve-auth';

export function middleware(request: NextRequest) {
  const isSignedIn = request.cookies.get(AUTH_COOKIE)?.value === '1';

  if (!isSignedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/vendor/:path*'],
};
