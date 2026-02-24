import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin routes (except login/signup)
  if (path.startsWith('/admin') && !path.startsWith('/admin-login') && !path.startsWith('/admin-signup')) {
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    
    try {
      const session = JSON.parse(token);
      if (session.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  // Redirect to /admin if already logged in as admin and trying to access /admin-login or /admin-signup
  if (path === '/admin-login' || path === '/admin-signup' || path === '/') {
    const token = request.cookies.get('authToken')?.value;
    if (token) {
      try {
        const session = JSON.parse(token);
        if (session.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch (e) {
        // Ignore invalid token, let them proceed normally
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/admin-login', '/admin-signup'],
};
