// src/app/api/feedback/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, type, message } = body;

    const { error } = await supabase
      .from("feedback")
      .insert([{ name, email, type, message }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[FEEDBACK ERROR]", err);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
