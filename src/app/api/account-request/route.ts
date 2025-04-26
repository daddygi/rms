import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      middleInitial,
      lastName,
      contactNumber,
      email,
      password,
      address,
    } = body;

    const { error } = await supabase.from("account_requests").insert([
      {
        email,
        firstName,
        middleInitial,
        lastName,
        contactNumber,
        password,
        address,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("account_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch account requests." },
      { status: 500 }
    );
  }
}
