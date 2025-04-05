// src/app/api/incident/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incidentReports } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const reports = await db
      .select({
        id: incidentReports.id,
        created_at: incidentReports.created_at,
        type: incidentReports.type,
        location: incidentReports.location,
        datetime: incidentReports.datetime,
      })
      .from(incidentReports)
      .where(eq(incidentReports.user_id, user_id));

    return NextResponse.json(reports);
  } catch (err) {
    console.error("[REPORT FETCH ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
