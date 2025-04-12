// src/lib/middlewareSupabase.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { type NextRequest, NextResponse } from "next/server";

export function createSupabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse
) {
  return createMiddlewareClient({ req, res });
}
