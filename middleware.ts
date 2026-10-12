import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight middleware: checks presence of `token` cookie for protected routes.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPaths = ['/overview', '/dashboard', '/ondersteuning'];

  const needsAuth = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get('token');
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/overview/:path*', '/dashboard/:path*', '/ondersteuning/:path*', '/overview'],
};
