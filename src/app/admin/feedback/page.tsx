"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Feedback {
  id: string;
  message: string;
  email?: string;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error.message);
    } else {
      setFeedback(data ?? []);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this feedback?");
    if (!confirmed) return;

    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      setFeedback((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const downloadCSV = (data: Feedback[]) => {
    const header = ["ID", "Message", "Email", "Created At"];
    const rows = data.map((f) => [
      f.id,
      `"${f.message.replace(/"/g, '""')}"`, // Escape quotes
      f.email || "",
      f.created_at,
    ]);

    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "feedback.csv");
    link.click();
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Feedback</h1>

      {loading ? (
        <p>Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <>
          <button
            onClick={() => downloadCSV(feedback)}
            className="mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Download CSV
          </button>

          <ul className="space-y-4">
            {feedback.map((item) => (
              <li
                key={item.id}
                className="border rounded p-4 bg-white shadow-sm"
              >
                <div className="text-sm text-gray-500">
                  {format(new Date(item.created_at), "PPPpp")}
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-line">
                  {item.message}
                </p>
                {item.email && (
                  <p className="text-sm text-gray-600 mt-2">
                    From: {item.email}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:underline text-sm mt-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
