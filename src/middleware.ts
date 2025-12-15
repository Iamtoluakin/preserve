import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/login'];

// Routes that require specific roles
const roleBasedRoutes: Record<string, string[]> = {
  '/dashboard': ['bank_admin', 'bank_user'],
  '/vendor': ['vendor_admin', 'field_tech'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For now, just allow all routes through
  // The actual authentication check happens in the AuthContext
  // This middleware can be enhanced later to check cookies/tokens
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
