import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Get user info from account_requests table
  const { data: requestData, error: fetchError } = await supabaseAdmin
    .from("account_requests")
    .select("*")
    .eq("email", email)
    .single();

  if (fetchError || !requestData) {
    console.error("[FETCH ACCOUNT REQUEST ERROR]", fetchError);
    return NextResponse.json(
      { error: "Account request not found." },
      { status: 404 }
    );
  }

  const { id, firstName, middleInitial, lastName, address, contactNumber } =
    requestData;

  // Create user in Supabase Auth
  const { data: user, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: String(contactNumber),
      email_confirm: true,
      user_metadata: {
        firstName,
        middleInitial,
        lastName,
        address,
        role: "user",
      },
    });

  if (createError || !user?.user?.id) {
    console.error("[CREATE USER ERROR]", createError);
    return NextResponse.json(
      { error: createError?.message ?? "User creation failed" },
      { status: 500 }
    );
  }

  // Send magic link
  const { error: otpError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (otpError) {
    console.error("[SEND MAGIC LINK ERROR]", otpError);
    return NextResponse.json({ error: otpError.message }, { status: 500 });
  }

  // Delete the account request by ID
  const { error: deleteError } = await supabaseAdmin
    .from("account_requests")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("[DELETE REQUEST ERROR]", deleteError);
    return NextResponse.json(
      { error: "Failed to delete request." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
