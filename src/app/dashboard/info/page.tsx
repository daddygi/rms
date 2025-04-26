"use client";

import { useState } from "react";
import { useUser } from "@/lib/AuthProvider";
import Link from "next/link";
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

  // const handleBinaryRadioChange = (
  //   name: string,
  //   value: boolean,
  //   input?: string
  // ) => {
  //   const inputMap: { [key: string]: string } = {
  //     has_witnesses: "witness_info",
  //     reported_to_authorities: "authorities_info",
  //     damages_or_injuries: "damages_description",
  //     has_evidence: "evidence_description",
  //   };

  //   const inputField = inputMap[name];
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //     ...(inputField && { [inputField]: input || "" }),
  //   }));
  // };

  // const handleOtherRadioChange = (
  //   name: string,
  //   value: string,
  //   other?: string
  // ) => {
  //   if (name === "type") {
  //     setOtherType(other || "");
  //   }

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //     ...(name === "preferred_action" && value === "Other"
  //       ? { preferred_action_detail: other || "" }
  //       : { preferred_action_detail: "" }),
  //   }));
  // };

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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/dashboard"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">Information Sheet</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Unit No.
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded "
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Lease Period
            </label>
            <div className="flex items-center gap-2">
              <input
                name="lease_start"
                type="date"
                value=""
                onChange={handleChange}
                placeholder="Start Date"
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                name="lease_end"
                type="date"
                value=""
                onChange={handleChange}
                placeholder="End Date"
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Tenant's Name
              </label>
              <input
                name="datetime"
                type="text"
                value={form.datetime}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Status
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Birthday
            </label>
            <input
              name="datetime"
              type="text"
              value={form.datetime}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Gender
            </label>
            <select
              name="status"
              value=""
              className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
            >
              <option value=""></option>
              <option value="Pending">Male</option>
              <option value="Ongoing">Female</option>
            </select>
          </div>

          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Occupation
            </label>
            <input
              name="datetime"
              type="text"
              value={form.datetime}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Mobile No.
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>

          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Citizenship
            </label>
            <input
              name="datetime"
              type="text"
              value={form.datetime}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Email Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>

          <div className="w-full flex flex-col col-span-1 sm:col-span-2">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Home/School Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>

          <div className="w-full flex flex-col col-span-1 sm:col-span-2">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Mailing Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>

          <div className="sm:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Guardian's Name
              </label>
              <input
                name="datetime"
                type="text"
                value={form.datetime}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Relationship with the Tenant
              </label>
              <select
                name="status"
                value=""
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              >
                <option value=""></option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col col-span-1 sm:col-span-2">
            <label className="font-medium mb-1 text-sm sm:text-base">
              Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 shadow-md  px-3 py-2 rounded"
            />
          </div>
          <div className="sm:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Guardian's Contact No.
              </label>
              <input
                name="datetime"
                type="text"
                value={form.datetime}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Email Address
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Contact Person in case of Emergency
              </label>
              <input
                name="datetime"
                type="text"
                value={form.datetime}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <label className="font-medium mb-1 text-sm sm:text-base">
                Contact No.
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 shadow-md px-3 py-2 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-5 bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Submit Report
          </button>
        </div>
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
