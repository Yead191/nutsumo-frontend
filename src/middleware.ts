import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  // Protect Artisan / Agent Dashboard (/pro and /pro/*)
  if (pathname === "/pro" || pathname.startsWith("/pro/")) {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // If user is logged in but role is explicitly not ARTISAN, redirect to user dashboard
    if (role && role !== "ARTISAN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Protect Client / User Dashboard (/account and /account/*)
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro", "/pro/:path*", "/account", "/account/:path*"],
};
