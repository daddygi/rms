"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import Link from "next/link";

interface IncidentReport {
  id: string;
  full_name: string;
  type: string;
  location: string;
  datetime: string;
  created_at: string;
}

export default function AdminIncidentReportsPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [filteredReports, setFilteredReports] = useState<IncidentReport[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  useEffect(() => {
    let filtered = reports;

    if (search) {
      filtered = filtered.filter((r) =>
        r.full_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (r) => new Date(r.datetime) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        (r) => new Date(r.datetime) <= new Date(dateTo)
      );
    }

    setFilteredReports(filtered);
  }, [reports, search, typeFilter, dateFrom, dateTo]);

  const downloadCSV = (data: any[]) => {
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

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Incident Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No incident reports submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-2">
            <div>
              <label className="text-sm font-medium block mb-1">
                Search Name
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Incident Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">All</option>
                <option value="Theft">Theft</option>
                <option value="Noise Disturbance">Noise Disturbance</option>
                <option value="Harassment">Harassment</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Physical Assault">Physical Assault</option>
                <option value="Verbal Abuse/Threats">
                  Verbal Abuse/Threats
                </option>
                <option value="Domestic Dispute">Domestic Dispute</option>
                <option value="Trespassing">Trespassing</option>
                <option value="Property Damage">Property Damage</option>
                <option value="Public Disturbance">Public Disturbance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <button
            onClick={() => downloadCSV(reports)}
            className="mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Download CSV
          </button>

          {filteredReports.map((report) => (
            <li
              key={report.id}
              className="border p-4 rounded bg-white shadow-sm"
            >
              <div className="text-sm text-gray-500">
                Submitted: {format(new Date(report.created_at), "PPPpp")}
              </div>
              <div className="mt-1 font-medium">
                <span className="text-gray-700">Name:</span> {report.full_name}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Type:</strong> {report.type}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Location:</strong> {report.location}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Incident:</strong>{" "}
                {format(new Date(report.datetime), "PPPpp")}
              </div>
              <Link
                href={`/admin/reports/${report.id}`}
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
