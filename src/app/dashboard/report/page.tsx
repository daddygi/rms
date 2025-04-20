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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Full Name of Complainant
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Contact Number
            </label>
            <input
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Date and Time of Incident
            </label>
            <input
              name="datetime"
              type="datetime-local"
              value={form.datetime}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <h2 className="text-m font-bold mb-2">Incident Details</h2>
            <fieldset>
              <legend className="block font-normal mb-1">
                Type of Incident
              </legend>
              <div className="grid grid-cols-2 gap-y-2">
                {[
                  "Theft",
                  "Noise Disturbance",
                  "Harassment",
                  "Vandalism",
                  "Physical Assault",
                  "Verbal Abuse/Threats",
                  "Domestic Dispute",
                  "Trespassing",
                  "Property Damage",
                  "Public Disturbance",
                  "Other",
                ].map((incident) => (
                  <label
                    key={incident}
                    className="flex items-start space-x-2 min-w-[12rem] whitespace-normal"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={incident}
                      checked={form.type === incident}
                      onChange={handleChange}
                      className="accent-blue-600 mt-1"
                      required
                    />
                    <span>{incident}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Briefly Describe the Incident
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 rounded"
            />
          </div>{" "}
          {/* Additional fields to follow after confirming structure is working */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Submit Report
          </button>
        </div>
      </form>
    </main>
  );
}
