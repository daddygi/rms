"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
// @ts-expect-error
import html2pdf from "html2pdf.js";

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data, error } = await supabase
          .from("incident_reports")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching report:", error.message);
          return;
        }

        setReport(data);
      } catch (err) {
        console.error("An unexpected error occurred:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this report?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("incident_reports")
      .delete()
      .eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      alert("Report deleted successfully.");
      router.push("/dashboard/admin/reports");
    }
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `incident-report-${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!report) return <p className="p-6">Report not found.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Reports
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
          >
            Download PDF
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="printable bg-white border rounded-lg p-6 text-sm space-y-3"
      >
        {/* Header */}
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Subdivision Incident Report</h2>
          <p className="text-gray-600 text-sm">
            Subdivision RMS • Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Body */}
        <p>
          <strong>Submitted:</strong>{" "}
          {format(new Date(report.created_at), "PPPpp")}
        </p>
        <p>
          <strong>Full Name:</strong> {report.full_name}
        </p>
        <p>
          <strong>Type:</strong> {report.type}
        </p>
        <p>
          <strong>Location:</strong> {report.location}
        </p>
        <p>
          <strong>Date/Time:</strong>{" "}
          {format(new Date(report.datetime), "PPPpp")}
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

        {/* Footer */}
        <div className="border-t pt-4 mt-6 text-xs text-gray-500 text-center">
          Powered by Subdivision RMS System
        </div>
      </div>
    </main>
  );
}
