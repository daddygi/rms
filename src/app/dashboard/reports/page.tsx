"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import { format } from "date-fns";
import Link from "next/link";
import PaginatedTable, { Column } from "@/components/PaginatedTable";

import NoData from "@/components/Nodata";

// Base type from backend
type IncidentReport = {
  id: string;
  type: string;
  location: string;
  created_at: string;
};

// Extended type for formatted values
type ExtendedIncidentReport = IncidentReport & {
  raw_created_at: string;
};

const columns: Column<ExtendedIncidentReport>[] = [
  { label: "Report ID", accessor: "id" },
  { label: "Type", accessor: "type" },
  { label: "Location", accessor: "location" },
  { label: "Date Submitted", accessor: "created_at" },
];

export default function ReportsPage() {
  const { user } = useUser();

  const [filteredReports, setFilteredReports] = useState<
    ExtendedIncidentReport[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      const res = await fetch(`/api/incident?user_id=${user.id}`);
      const data = await res.json();

      const formatted: ExtendedIncidentReport[] = data.map((r: any) => ({
        id: r.id,
        type: r.type,
        location: r.location,
        raw_created_at: r.created_at,
        created_at: format(new Date(r.created_at), "PPPpp"),
      }));

      setFilteredReports(formatted);
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  return (
    <main className="max-w-5xl mx-auto px-2 sm:px-6 py-6">
      <Link
        href="/dashboard"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4">My Submitted Reports</h1>

      {!loading && filteredReports.length === 0 ? (
        <NoData message="No reports found." imageSrc="/assets/noRecords.svg" />
      ) : (
        <PaginatedTable
          data={filteredReports}
          columns={columns}
          rowsPerPage={10}
          dateField="raw_created_at"
          isLoading={loading}
        />
      )}
    </main>
  );
}
