"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function AdminCreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

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

  const [pendingFormSubmit, setPendingFormSubmit] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setModal({
          open: true,
          title: "Success!",
          message: "User created successfully!",
        });

        setFormData({
          firstName: "",
          middleInitial: "",
          lastName: "",
          email: "",
          contactNumber: "",
          address: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });
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
        message: "An unexpected error occurred.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setModal({
        open: true,
        title: "Password Mismatch",
        message: "Passwords do not match. Please retype them correctly.",
      });
      return;
    }

    setModal({
      open: true,
      title: "Create Account?",
      message: "Are you sure you want to create this account?",
      onConfirm: () => {
        handleModalClose(); // close and reset modal before submitting
        handleFormSubmit();
      },
    });
  };

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setModal({ open: false, title: "", message: "", onConfirm: undefined });
    }, 5000); // Delay for modal transition/animation
  };

  return (
    <div className="flex flex-col items-center w-full py-10 px-4">
      <div className="w-24 h-24 rounded-full bg-black mb-4" />

      <div className="flex items-center justify-center w-full max-w-3xl mb-6">
        <div className="flex-grow border-t border-gray-300" />
        <h2 className="text-2xl font-semibold px-4">Create Account</h2>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">M.I.</label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                maxLength={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Retype Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>
      </div>

      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={modal.onConfirm}
        confirmLabel="Yes, proceed."
        cancelLabel="Cancel"
      />
    </div>
  );
}
