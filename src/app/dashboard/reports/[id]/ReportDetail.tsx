"use client";

import { useRef } from "react";
import { format } from "date-fns";
// @ts-expect-error
import html2pdf from "html2pdf.js";
import Link from "next/link";

export default function ReportDetail({ report }: { report: any }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (typeof window === "undefined" || !printRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `incident-report-${report.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/reports"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to My Reports
      </Link>

      <h1 className="text-2xl font-bold mb-4">Incident Report Details</h1>

      <div className="mb-4">
        <button
          onClick={handleDownload}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={printRef}
        className="space-y-3 bg-white border rounded-lg p-6 shadow-sm text-sm"
      >
        <p>
          <strong>Submitted At:</strong>{" "}
          {report.created_at
            ? format(new Date(report.created_at), "PPPpp")
            : "N/A"}
        </p>
        <p>
          <strong>Type:</strong> {report.type}
        </p>
        <p>
          <strong>Location:</strong> {report.location}
        </p>
        <p>
          <strong>Incident Date/Time:</strong>{" "}
          {report.datetime ? format(new Date(report.datetime), "PPPpp") : "N/A"}
        </p>
        <p>
          <strong>Full Name:</strong> {report.full_name}
        </p>
        <p>
          <strong>Address:</strong> {report.address}
        </p>
        <p>
          <strong>Contact Number:</strong> {report.contact_number}
        </p>
        <p>
          <strong>Description:</strong> {report.description}
        </p>
        <p>
          <strong>Suspects:</strong> {report.suspects || "N/A"}
        </p>
        <p>
          <strong>Has Witnesses:</strong> {report.has_witnesses ? "Yes" : "No"}
        </p>
        <p>
          <strong>Witness Info:</strong> {report.witness_info || "N/A"}
        </p>
        <p>
          <strong>Reported to Authorities:</strong>{" "}
          {report.reported_to_authorities ? "Yes" : "No"}
        </p>
        <p>
          <strong>Authorities Info:</strong> {report.authorities_info || "N/A"}
        </p>
        <p>
          <strong>Damages/Injuries:</strong>{" "}
          {report.damages_or_injuries ? "Yes" : "No"}
        </p>
        <p>
          <strong>Damage Description:</strong>{" "}
          {report.damages_description || "N/A"}
        </p>
        <p>
          <strong>Evidence Provided:</strong>{" "}
          {report.has_evidence ? "Yes" : "No"}
        </p>
        <p>
          <strong>Evidence Info:</strong> {report.evidence_description || "N/A"}
        </p>
        <p>
          <strong>Preferred Action:</strong> {report.preferred_action}
        </p>
      </div>
    </main>
  );
}
