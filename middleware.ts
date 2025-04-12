// middleware.ts (must be in root of your project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const role = session?.user?.user_metadata?.role;
  const path = request.nextUrl.pathname;

  console.log("🔐 Middleware role:", role);

  if (path === "/login" && session) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Restrict admin dashboard to admins only
  if (path.startsWith("/admin/dashboard") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect unauthenticated users from dashboard
  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
