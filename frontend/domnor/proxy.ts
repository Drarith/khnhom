import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Define routes that do NOT need protection (public routes)
const publicRoutes = ["/"];

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the token in cookies
  const token = request.cookies.get("auth_token")?.value;

  // Extract the path without locale prefix (e.g., /en/dashboard -> /dashboard)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  // Check if the current path is protected
  const isPublicRoute =
    publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale === "";

  // Auth redirect logic
  // If no token and trying to access a protected route -> Go to Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user HAS token and tries to go to Login -> Go to Dashboard
  if (token && (pathWithoutLocale === "/" || pathWithoutLocale === "")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Apply next-intl middleware for internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - trpc (tRPC routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel files)
     * - Files with extensions (e.g., .ico, .png)
     */
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
