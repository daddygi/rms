"use client";

import { useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import Link from "next/link";
import { RadioWithInput } from "@/components/inputs/RadioWithInput";
import Modal from "@/components/Modal";

export default function IncidentReportPage() {
  const { user } = useUser();

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

  const [otherType, setOtherType] = useState("");

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setModal({ open: false, title: "", message: "", onConfirm: undefined });
    }, 5000);
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

  const handleFormSubmit = async () => {
    try {
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
        setModal({
          open: true,
          title: "Success",
          message: "Incident submitted successfully!",
        });

        setForm({
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

        setOtherType("");
      } else {
        setModal({
          open: true,
          title: "Error",
          message: result.error || "Something went wrong.",
        });
      }
    } catch (error) {
      setModal({
        open: true,
        title: "Error",
        message: "An unexpected error occurred." + error,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setModal({
      open: true,
      title: "Submit Incident Report?",
      message: "Are you sure you want to submit this report?",
      onConfirm: () => {
        handleModalClose();
        handleFormSubmit();
      },
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Barangay Incident Report
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Basic Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-1">
            Your Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name of Complainant
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="Juan Dela Cruz"
                className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Complete Address"
                className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Section: Incident Details */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-1">
            Incident Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date and Time of Incident
              </label>
              <input
                name="datetime"
                type="datetime-local"
                value={form.datetime}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location of Incident"
                className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">
              Briefly Describe the Incident
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what happened..."
              className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Suspect(s)</label>
            <textarea
              name="suspects"
              value={form.suspects}
              onChange={handleChange}
              rows={3}
              placeholder="Name or description of the suspect(s), if known."
              className="w-full bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Section: Additional Details */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-1">
            Additional Information
          </h2>

          <RadioWithInput
            label="Were there any witnesses?"
            name="has_witnesses"
            value={form.has_witnesses}
            inputLabel="Provide names and contact details"
            inputValue={form.witness_info}
            onChange={handleBinaryRadioChange}
          />
          <RadioWithInput
            label="Did you report this to authorities?"
            name="reported_to_authorities"
            value={form.reported_to_authorities}
            inputLabel="Specify whom"
            inputValue={form.authorities_info}
            onChange={handleBinaryRadioChange}
          />
          <RadioWithInput
            label="Were there any damages or injuries?"
            name="damages_or_injuries"
            value={form.damages_or_injuries}
            inputLabel="Describe"
            inputValue={form.damages_description}
            onChange={handleBinaryRadioChange}
          />
          <RadioWithInput
            label="Do you have any evidence (e.g., photos, recordings)?"
            name="has_evidence"
            value={form.has_evidence}
            inputLabel="Specify"
            inputValue={form.evidence_description}
            onChange={handleBinaryRadioChange}
          />
        </section>

        {/* Section: Preferred Action */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-1">
            Requested Action
          </h2>
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
        </section>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 rounded-md transition duration-150"
        >
          Submit Incident Report
        </button>
      </form>

      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={modal.onConfirm}
        confirmLabel="Yes, proceed."
        cancelLabel="Cancel"
      />
    </main>
  );
}
