import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/vendor'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Supabase stores the session in a cookie starting with sb-
  const hasSession = [...request.cookies.getAll()].some(c => c.name.startsWith('sb-'));

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/vendor/:path*'],
};
