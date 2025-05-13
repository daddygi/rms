import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;
  const role = user?.user_metadata?.role;

  console.log("Middleware - User Data:", user);
  console.log("Middleware - Role:", role);
  console.log("Middleware - Error:", error);

  if (!user) {
    // No session found
    if (pathname.startsWith("/admin")) {
      console.log("🔒 No user found. Redirecting to /dashboard.");
      return redirectToDashboard(req);
    }
    return res;
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    console.log(`⛔ Unauthorized role (${role}). Redirecting to /dashboard.`);
    return redirectToDashboard(req);
  }

  if (!pathname.startsWith("/admin") && role === "admin") {
    console.log("👑 Admin detected. Redirecting to /admin/dashboard.");
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  console.log("✅ Access granted.");
  return res;
}

// Helper function to redirect to dashboard
function redirectToDashboard(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/dashboard";
  return NextResponse.redirect(url);
}

// Match all paths except static assets
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // match everything except _next static assets
};
