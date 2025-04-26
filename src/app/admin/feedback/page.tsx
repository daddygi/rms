"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import PaginationControls from "@/components/PaginationControls";
import { Trash, Calendar, Mail, FileDown } from "lucide-react";

interface Feedback {
  id: string;
  message: string;
  email?: string;
  created_at: string;
}

const FEEDBACKS_PER_PAGE = 6;

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching feedback:", error.message);
        return;
      }

      setFeedback(data ?? []);
    } catch (err) {
      console.error(
        "An unexpected error occurred while fetching feedback:",
        err
      );
    } finally {
      setLoading(false);
    }
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

  const totalPages = Math.ceil(feedback.length / FEEDBACKS_PER_PAGE);
  const currentFeedback = feedback.slice(
    (currentPage - 1) * FEEDBACKS_PER_PAGE,
    currentPage * FEEDBACKS_PER_PAGE
  );

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">User Feedback</h1>
        {feedback.length > 0 && (
          <button
            onClick={() => downloadCSV(feedback)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FileDown className="w-4 h-4" />
            Download CSV
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white border rounded shadow-sm">
          <p className="text-lg font-medium">No feedback submitted yet.</p>
        </div>
      ) : (
        <>
          <ul className="grid gap-6 md:grid-cols-2">
            {currentFeedback.map((item) => (
              <li
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(item.created_at), "PPPpp")}
                    </div>
                    {item.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {item.email}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-800 text-sm whitespace-pre-line mb-4 border-t pt-3">
                  {item.message}
                </p>

                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center text-red-600 text-sm hover:underline"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
}
