import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("aerocast_session") || request.cookies.get("cleanair_session");

  let user: { role?: string } | null = null;
  if (sessionCookie?.value) {
    try {
      user = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      user = null;
    }
  }

  // 1. Protected Citizen Routes (/dashboard)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protected Admin Routes (/admin)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "admin") {
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "admin_required");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3. Auth pages (/login, /signup) when already authenticated
  if (pathname === "/login" || pathname === "/signup") {
    if (user) {
      const redirectUrl = new URL(user.role === "admin" ? "/admin" : "/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
