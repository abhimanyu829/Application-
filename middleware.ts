import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require terms acceptance
const PROTECTED_ROUTES = ['/admin', '/dashboard', '/services'];
const PUBLIC_ROUTES = ['/accept-terms', '/privacy-policy', '/terms-of-service', '/careers', '/blog', '/departments'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes, root, and static files
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Check if accessing protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Middleware cannot access cookies directly for Appwrite session
    // This will be handled by layout-based protection using AuthContext
    return NextResponse.next();
  }

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
