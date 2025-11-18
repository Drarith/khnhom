// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/create-profile', '/settings'];
const AUTH_COOKIE_NAME = 'auth_token'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the current route is protected
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    
    // 2. Read the HttpOnly cookie
    const token = request.cookies.get(AUTH_COOKIE_NAME);

    // 3. If the token is missing, redirect to the login page
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Optional: Add a 'from' query param to redirect back later
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: Add basic JWT validation here (signature check) without hitting the DB
    // If validation fails, redirect to login and clear the cookie.
  }

  // Allow the request to proceed if not protected or if authenticated
  return NextResponse.next();
}

// Configuration to define which paths the middleware should run on
export const config = {
  matcher: [
    // Include all routes you want to protect, and exclude static assets/public files
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};