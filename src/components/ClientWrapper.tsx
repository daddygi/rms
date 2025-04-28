// src/app/dashboard/reports/[id]/ClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Define what fields are actually in your incident report
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

// Dynamically import the component that uses html2pdf.js
const ReportDetail = dynamic(() => import("./ReportDetail"), { ssr: false });

export default function ClientWrapper({ report }: { report: IncidentReport }) {
  return <ReportDetail report={report} />;
}
