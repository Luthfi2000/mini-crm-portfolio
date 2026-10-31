import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("mini_crm_session")?.value;

  // Static assets & internal Next.js files
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".jpg");

  if (isStatic) {
    return NextResponse.next();
  }

  // Public authentication & public lead ingestion API endpoints
  const isPublicApi =
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/logout" ||
    pathname === "/api/leads/capture";

  if (isPublicApi) {
    return NextResponse.next();
  }

  // Public Marketing Landing Page
  if (pathname === "/landing" || pathname.startsWith("/landing/")) {
    return NextResponse.next();
  }

  // Public registration is disabled; only administrators can provision accounts
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/login?notice=admin_only", request.url));
  }

  // Handle protected API routes
  if (pathname.startsWith("/api/")) {
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Handle Login Page
  if (pathname === "/login") {
    if (sessionToken) {
      // Already authenticated, redirect to Dashboard
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected App Pages (/, /contacts, /pipeline, /team, etc.)
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
