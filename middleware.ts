import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 🛠 Attach Supabase session cookie correctly
  const supabase = createMiddlewareClient({ req: request, res: response });

  // ✅ This ensures Supabase updates response with proper cookie headers
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const role = session?.user?.user_metadata?.role;
  const path = request.nextUrl.pathname;

  console.log("🔐 Middleware - Path:", path, "| Role:", role);

  // Redirect authenticated users away from login
  if (path === "/login" && session) {
    if (role === "admin" || role === "super_admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Require login for protected routes
  if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin-only routes
    if (
      path.startsWith("/admin") &&
      role !== "admin" &&
      role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}
