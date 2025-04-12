"use client";

import { useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import Link from "next/link";

export default function IncidentReportPage() {
  const { user, isLoading } = useUser();

  const [form, setForm] = useState({
    full_name: "",
    address: "",
    contact_number: "",
    datetime: "",
    location: "",
    type: "",
    description: "",
    suspects: "",
    has_witnesses: false,
    witness_info: "",
    reported_to_authorities: false,
    authorities_info: "",
    damages_or_injuries: false,
    damages_description: "",
    has_evidence: false,
    evidence_description: "",
    preferred_action: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Narrow down checkbox specifically
    const checked =
      type === "checkbox" && (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/incident", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        user_id: user?.id,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Incident submitted successfully!");
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/dashboard"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">Barangay Incident Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name of Complainant</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Date and Time of Incident</label>
          <input
            name="datetime"
            type="datetime-local"
            value={form.datetime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Type of Incident</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Type --</option>
            <option>Theft</option>
            <option>Noise Disturbance</option>
            <option>Harassment</option>
            <option>Vandalism</option>
            <option>Physical Assault</option>
            <option>Verbal Abuse/Threats</option>
            <option>Domestic Dispute</option>
            <option>Trespassing</option>
            <option>Property Damage</option>
            <option>Public Disturbance</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">
            Briefly Describe the Incident
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Additional fields to follow after confirming structure is working */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Submit Report
        </button>
      </form>
    </main>
  );
}
