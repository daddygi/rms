// components/AccountRequestModal.tsx
"use client";

import { useState } from "react";

export default function AccountRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ email: "", password: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/account-request", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Request an Account</h2>
        {submitted ? (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded text-green-600"
          >
            Request submitted. Admin will review it shortly. Click here to go
            back.
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
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
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
