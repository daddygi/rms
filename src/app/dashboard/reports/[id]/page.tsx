import { db } from "@/db";
import { incidentReports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientWrapper from "../../../../components/ClientWrapper";

// This should match what ClientWrapper expects
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

  // Normalize all nullable fields and Dates to string
  const normalizedReport: IncidentReport = {
    id: report.id,
    created_at: report.created_at
      ? report.created_at instanceof Date
        ? report.created_at.toISOString()
        : String(report.created_at)
      : "",
    full_name: report.full_name ?? "",
    type: report.type ?? "",
    location: report.location ?? "",
    datetime: report.datetime
      ? report.datetime instanceof Date
        ? report.datetime.toISOString()
        : String(report.datetime)
      : "",
    address: report.address ?? "",
    contact_number: report.contact_number ?? "",
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
  };

  return <ClientWrapper report={normalizedReport} />;
}
