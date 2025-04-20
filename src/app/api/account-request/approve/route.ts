import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // to delete request
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must use service_role
);

export async function POST(req: Request) {
  const { email, password, address } = await req.json();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { address, role: "user" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Optional: Delete the request from table
  await supabase.from("account_requests").delete().eq("email", email);

  return NextResponse.json({ success: true });
}
