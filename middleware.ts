import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/forgot-password', '/privacy', '/terms', '/support'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For dashboard routes, check authentication
  if (pathname.startsWith('/dashboard')) {
    // In a real app, you'd check for a valid JWT token or session
    // For this demo, we'll check localStorage on the client side
    // This is a simplified approach - in production, use proper server-side session management
    
    // Since we can't access localStorage in middleware, we'll let the dashboard handle auth
    // and redirect from there if needed
    return NextResponse.next();
  }

  // For the root path, redirect to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
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