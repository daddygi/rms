import { NextResponse } from "next/server";
import { db } from "@/db";
import { incidentReports } from "@/db/schema";

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

    const result = await db.insert(incidentReports).values({
      user_id,
      full_name,
      address,
      contact_number,
      datetime: new Date(datetime),
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
    });

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (err) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
