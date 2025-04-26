"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5); // <-- NEW for countdown

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...formData } = form;
    const res = await fetch("/api/account-request", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong.");
    }
  };

  // Handle the countdown and redirect after submit
  useEffect(() => {
    if (submitted) {
      if (countdown === 0) {
        router.push("https://localhost:3000/"); // Redirect to login page
      } else {
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000); // decrease every second
        return () => clearTimeout(timer);
      }
    }
  }, [submitted, countdown, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Request an Account</h2>
        {submitted ? (
          <div className="text-center space-y-2">
            <p className="text-green-600 text-lg font-medium">
              Request submitted successfully!
            </p>
            <p className="text-gray-600">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Middle Initial</label>
                <input
                  name="middleInitial"
                  maxLength={1}
                  value={form.middleInitial}
                  onChange={handleChange}
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Contact Number</label>
                <input
                  name="contactNumber"
                  type="tel"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
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
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-400 px-3 py-2 rounded"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2 pt-4">
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
