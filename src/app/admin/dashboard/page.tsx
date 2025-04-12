"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [reportCount, setReportCount] = useState(0);
  const [typeBreakdown, setTypeBreakdown] = useState<Record<string, number>>(
    {}
  );
  const [latestFeedback, setLatestFeedback] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
    "#d88884",
  ];

  useEffect(() => {
    const loadStats = async () => {
      const { data: reports, error: reportErr } = await supabase
        .from("incident_reports")
        .select("type");

      if (!reportErr && reports) {
        setReportCount(reports.length);

        const breakdown: Record<string, number> = {};
        reports.forEach((r) => {
          breakdown[r.type] = (breakdown[r.type] || 0) + 1;
        });

        setTypeBreakdown(breakdown);
        const chartData = Object.entries(breakdown).map(([type, count]) => ({
          name: type,
          value: count,
        }));

        setChartData(chartData);
      }

      const { data: feedback, error: feedbackErr } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!feedbackErr) {
        setLatestFeedback(feedback ?? []);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-sm text-gray-500">Total Reports</h2>
          <p className="text-3xl font-bold">{reportCount}</p>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm col-span-2">
          <h2 className="text-sm text-gray-500 mb-2">Reports by Type</h2>
          <ul className="text-sm space-y-1">
            {Object.entries(typeBreakdown).map(([type, count]) => (
              <li key={type} className="flex justify-between">
                <span>{type}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
        <h2 className="text-sm text-gray-500 mb-2">Latest Feedback</h2>
        {latestFeedback.length === 0 ? (
          <p className="text-sm text-gray-600">No feedback submitted yet.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {latestFeedback.map((f) => (
              <li key={f.id} className="border-b pb-2">
                <p className="text-gray-800">{f.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  From: {f.full_name ?? "Anonymous"} —{" "}
                  {new Date(f.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white border rounded-lg p-4 shadow-sm col-span-2">
        <h2 className="text-sm text-gray-500 mb-2">Reports by Type</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
