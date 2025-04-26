// src/app/api/incident/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      full_name,
      address,
      contact_number,
      datetime,
      location,
      type,
      description,
      suspects,
      has_witnesses,
      witness_info,
      reported_to_authorities,
      authorities_info,
      damages_or_injuries,
      damages_description,
      has_evidence,
      evidence_description,
      preferred_action,
    } = body;

    const { error } = await supabase.rpc("insert_incident_report", {
      _user_id: user_id,
      _full_name: full_name,
      _address: address,
      _contact_number: contact_number,
      _datetime: new Date(datetime).toISOString(),
      _location: location,
      _type: type,
      _description: description,
      _suspects: suspects,
      _has_witnesses: has_witnesses,
      _witness_info: witness_info,
      _reported_to_authorities: reported_to_authorities,
      _authorities_info: authorities_info,
      _damages_or_injuries: damages_or_injuries,
      _damages_description: damages_description,
      _has_evidence: has_evidence,
      _evidence_description: evidence_description,
      _preferred_action: preferred_action,
    });

    if (error) {
      console.error("[RPC INSERT ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[API INSERT ERROR]", err);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc("get_incident_reports_by_user", {
      _user_id: user_id,
    });

    if (error) {
      console.error("[RPC FETCH ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[API FETCH ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
