// src/app/dashboard/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import { format } from "date-fns";
import Link from "next/link";

type IncidentReport = {
  id: string;
  created_at: string;
  type: string;
  location: string;
  datetime: string;
};

export default function ReportsPage() {
  const { user, isLoading } = useUser();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      const res = await fetch(`/api/incident?user_id=${user.id}`);
      const data = await res.json();
      setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  if (isLoading || loading)
    return <p className="text-center mt-10">Loading reports...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Submitted Reports</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <Link href={`/dashboard/reports/${report.id}`}>
                <div className="cursor-pointer">
                  <div className="text-sm text-gray-500 mb-1">
                    Submitted: {format(new Date(report.created_at), "PPPpp")}
                  </div>
                  <div className="text-lg font-semibold">{report.type}</div>
                  <div className="text-sm text-gray-700">{report.location}</div>
                  <div className="text-sm text-gray-600">
                    Incident: {format(new Date(report.datetime), "PPPpp")}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
