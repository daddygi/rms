"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import { format } from "date-fns";

// Base incident report
interface IncidentReport {
  id: string;
  full_name: string;
  type: string;
  location: string;
  datetime: string;
  created_at: string;
}

// Extended report for formatted values
interface ExtendedIncidentReport extends IncidentReport {
  raw_datetime: string;
  raw_created_at: string;
}

export default function AdminIncidentReportsPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("incident_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error.message);
    } else {
      setReports(data ?? []);
    }

    setLoading(false);
  };

  const downloadCSV = (data: IncidentReport[]) => {
    const header = [
      "ID",
      "Full Name",
      "Type",
      "Location",
      "Datetime",
      "Submitted At",
    ];
    const rows = data.map((r) => [
      r.id,
      `"${r.full_name}"`,
      r.type,
      r.location,
      r.datetime,
      r.created_at,
    ]);

    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "incident-reports.csv");
    link.click();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const columns: Column<ExtendedIncidentReport>[] = [
    { label: "Full Name", accessor: "full_name" },
    { label: "Type", accessor: "type" },
    { label: "Location", accessor: "location" },
    {
      label: "Incident",
      accessor: "datetime",
    },
    {
      label: "Submitted At",
      accessor: "created_at",
    },
  ];

  const formattedReports: ExtendedIncidentReport[] = reports.map((r) => ({
    ...r,
    raw_datetime: r.datetime,
    raw_created_at: r.created_at,
    datetime: format(new Date(r.datetime), "PPPpp"),
    created_at: format(new Date(r.created_at), "PPPpp"),
  }));

  return (
    <main className="max-w-6xl mx-auto  py-6">
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold">Incident Reports</h1>
        <button
          onClick={() => downloadCSV(reports)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No incident reports submitted yet.</p>
      ) : (
        <PaginatedTable
          data={formattedReports}
          columns={columns}
          rowsPerPage={5}
          dateField="raw_created_at"
        />
      )}
    </main>
  );
}
