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
import { MessageCircle, User, Clock } from "lucide-react";
import { format } from "date-fns";
import LazyLoader from "@/components/LazyLoaders/Spinner";

export default function AdminDashboard() {
  const [reportCount, setReportCount] = useState(0);
  const [typeBreakdown, setTypeBreakdown] = useState<Record<string, number>>(
    {}
  );
  const [latestFeedback, setLatestFeedback] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

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
      setLoading(true);

      const { data: reports } = await supabase
        .from("incident_reports")
        .select("type");
      if (reports) {
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

      const { data: feedback } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setLatestFeedback(feedback ?? []);
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
        <LazyLoader />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Reports */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center min-h-[180px]">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Reports
          </h2>
          <p className="text-5xl font-bold text-indigo-600">{reportCount}</p>
        </div>

        {/* Reports by Type */}
        <div className="sm:col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-medium text-gray-600 mb-4">
            Reports by Type
          </h2>
          <div className="overflow-x-auto">
            <ul className="min-w-[300px] divide-y divide-gray-200 text-sm">
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <li
                  key={type}
                  className="py-3 flex justify-between text-gray-800"
                >
                  <span className="capitalize">{type}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md mb-8">
        <h2 className="text-lg font-medium text-gray-600 mb-4">
          Report Type Distribution
        </h2>
        <div className="w-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height={260}>
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
            </PieChart>
          </ResponsiveContainer>

          {/* Legend moved below */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-medium text-gray-600 mb-4">
          Latest Feedback
        </h2>

        {latestFeedback.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No feedback submitted yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {latestFeedback.map((f) => (
              <li
                key={f.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-shrink-0 text-indigo-600">
                    <MessageCircle className="w-5 h-5 mt-1 sm:mt-0" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm mb-1">{f.message}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {f.full_name ?? "Anonymous"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(f.created_at), "PPpp")}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
