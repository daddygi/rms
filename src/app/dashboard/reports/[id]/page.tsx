import { db } from "@/db";

// Keep this type definition at the top
export interface IncidentReport {
  id: string;
  created_at: string;
  full_name: string;
  type: string;
  location: string;
  datetime: string;
  address: string;
  contact_number: string;
  description: string;
  suspects?: string;
  has_witnesses?: boolean;
  witness_info?: string;
  reported_to_authorities?: boolean;
  authorities_info?: string;
  damages_or_injuries?: boolean;
  damages_description?: string;
  has_evidence?: boolean;
  evidence_description?: string;
  preferred_action?: string;
}

import { incidentReports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

// DO NOT import IncidentReport from "./ClientWrapper" - use the one you defined above

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const [report] = await db
    .select()
    .from(incidentReports)
    .where(eq(incidentReports.id, params.id));

  if (!report) return notFound();

  // Normalize fields (null/undefined to "")
  const normalizedReport: IncidentReport = {
    id: report.id,
    full_name: report.full_name ?? "",
    address: report.address ?? "",
    contact_number: report.contact_number ?? "",
    datetime: report.datetime
      ? typeof report.datetime === "string"
        ? report.datetime
        : report.datetime.toISOString()
      : "",
    location: report.location ?? "",
    type: report.type ?? "",
    description: report.description ?? "",
    suspects: report.suspects ?? "",
    has_witnesses: !!report.has_witnesses,
    witness_info: report.witness_info ?? "",
    reported_to_authorities: !!report.reported_to_authorities,
    authorities_info: report.authorities_info ?? "",
    damages_or_injuries: !!report.damages_or_injuries,
    damages_description: report.damages_description ?? "",
    has_evidence: !!report.has_evidence,
    evidence_description: report.evidence_description ?? "",
    preferred_action: report.preferred_action ?? "",
    created_at: report.created_at
      ? typeof report.created_at === "string"
        ? report.created_at
        : report.created_at.toISOString()
      : "",
  };

  return <ClientWrapper report={normalizedReport} />;
}
