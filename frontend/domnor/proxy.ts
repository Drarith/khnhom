import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Define routes that NEED protection (require authentication)
const protectedRoutes = ["/dashboard", "/create-profile"];

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest, res: Response) {
  const { pathname } = request.nextUrl;

  // Always run intlMiddleware first to handle locale redirection
  const localeMatch = pathname.match(/^\/[a-z]{2}(\/|$)/);
  if (!localeMatch) {
    // This will redirect /about to /en/about
    return intlMiddleware(request);
  }

  // extract the path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const token = request.cookies.get("access_token")?.value;
  const isLoggedIn = request.cookies.get("logged_in")?.value === "true";
  const isProtectedRoute = protectedRoutes.includes(pathWithoutLocale);

  // Auth redirect logic
  if (!token && !isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log(res);

  if (token && (pathWithoutLocale === "/" || pathWithoutLocale === "")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other cases, continue with intlMiddleware
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
