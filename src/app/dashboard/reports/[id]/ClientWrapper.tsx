// src/app/dashboard/reports/[id]/ClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the component that uses html2pdf.js
const ReportDetail = dynamic(() => import("./ReportDetail"), { ssr: false });

export default function ClientWrapper({ report }: { report: any }) {
  return <ReportDetail report={report} />;
}
