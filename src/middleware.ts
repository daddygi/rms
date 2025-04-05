// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token");

  console.log("Middleware check – token:", token?.value);

  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    if (!token) {
      // Comment this temporarily
      // return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next();
}
