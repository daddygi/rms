"use client";

import { useState } from "react";

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
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your name (optional)"
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <select
          name="type"
          className="w-full border px-3 py-2 rounded"
          value={form.type}
          onChange={handleChange}
        >
          <option>Suggestion</option>
          <option>Complaint</option>
          <option>Compliment</option>
        </select>
        <textarea
          name="message"
          placeholder="Your feedback"
          className="w-full border px-3 py-2 rounded min-h-[120px]"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
