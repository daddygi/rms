"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "Suggestion",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Thanks for your feedback!");
      setForm({ name: "", email: "", type: "Suggestion", message: "" });
    } else {
      alert("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        <Link
          href="/dashboard"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">Submit Feedback</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Name (optional)
            </label>
            <input
              name="name"
              placeholder="Your name"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Feedback Type
            </label>
            <select
              name="type"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.type}
              onChange={handleChange}
            >
              <option>Suggestion</option>
              <option>Complaint</option>
              <option>Compliment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              name="message"
              placeholder="Write your feedback here..."
              className="w-full border border-gray-300 px-3 py-2 rounded min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
