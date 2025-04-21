"use client";

import { useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import Link from "next/link";
import { RadioWithInput } from "@/components/inputs/RadioWithInput";

export default function IncidentReportPage() {
  const { user } = useUser();
  const [otherType, setOtherType] = useState("");
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
    preferred_action_detail: "",
  });

  const handleBinaryRadioChange = (
    name: string,
    value: boolean,
    input?: string
  ) => {
    const inputMap: { [key: string]: string } = {
      has_witnesses: "witness_info",
      reported_to_authorities: "authorities_info",
      damages_or_injuries: "damages_description",
      has_evidence: "evidence_description",
    };

    const inputField = inputMap[name];
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(inputField && { [inputField]: input || "" }),
    }));
  };

  const handleOtherRadioChange = (
    name: string,
    value: string,
    other?: string
  ) => {
    if (name === "type") {
      setOtherType(other || "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "preferred_action" && value === "Other"
        ? { preferred_action_detail: other || "" }
        : { preferred_action_detail: "" }),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
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
        type: form.type === "Other" ? otherType : form.type,
        preferred_action:
          form.preferred_action === "Other"
            ? form.preferred_action_detail
            : form.preferred_action,
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
          {/* Basic Info */}
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Full Name of Complainant
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded "
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
              placeholder="Contact Number"
              className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded "
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
              placeholder="Address"
              required
              className="col-span-2 bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
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
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
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
              placeholder="Location of Incident"
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>
          {/* Incident Type */}
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <div className="col-span-2 ">
              <RadioWithInput
                label="Type of Incident"
                name="type"
                value={form.type}
                options={[
                  "Theft",
                  "Noise Disturbance",
                  "Harassment",
                  "Vandalism",
                  "Physical Assault",
                  "Verbal Abuse/Threats",
                  "Domestic Dispute",
                  "Trespassing",
                  "Property Damage",
                ]}
                otherValue={otherType}
                onChange={handleOtherRadioChange}
              />
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Briefly Describe the Incident
            </label>
            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the incident..."
              className="col-span-2 bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Names or Descriptions of the Suspect(s) (if known)
            </label>
            <textarea
              name="suspects"
              value={form.suspects}
              onChange={handleChange}
              rows={3}
              placeholder="Suspect(s) details (if any)"
              className="col-span-2 bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
            />
          </div>

          {/* Binary Inputs */}
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <RadioWithInput
              label="Were there any witnesses?"
              name="has_witnesses"
              value={form.has_witnesses}
              inputLabel="Provide names and contact details"
              inputValue={form.witness_info}
              onChange={handleBinaryRadioChange}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <RadioWithInput
              label="Did you report this to authorities?"
              name="reported_to_authorities"
              value={form.reported_to_authorities}
              inputLabel="Specify whom"
              inputValue={form.authorities_info}
              onChange={handleBinaryRadioChange}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <RadioWithInput
              label="Were there any damages or injuries?"
              name="damages_or_injuries"
              value={form.damages_or_injuries}
              inputLabel="Describe"
              inputValue={form.damages_description}
              onChange={handleBinaryRadioChange}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <RadioWithInput
              label="Do you have any evidence (e.g., photos, recordings)?"
              name="has_evidence"
              value={form.has_evidence}
              inputLabel="Specify"
              inputValue={form.evidence_description}
              onChange={handleBinaryRadioChange}
            />
          </div>

          {/* Preferred Action */}
          <div className="col-span-1 sm:col-span-2 flex flex-col w-full">
            <RadioWithInput
              label="Preferred Action from Barangay"
              name="preferred_action"
              value={form.preferred_action}
              options={[
                "Mediation",
                "Formal Complaint",
                "Assistance in Filing a Police Report",
              ]}
              otherValue={form.preferred_action_detail}
              onChange={handleOtherRadioChange}
            />
          </div>

          <button
            type="submit"

            className="w-full mt-5 bg-black text-white py-2 rounded hover:bg-gray-800"

            

          >
            Submit Report
          </button>
        </div>
      </form>
    </main>
  );
}
