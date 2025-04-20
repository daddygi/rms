// src/app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import AccountRequestModal from "../components/AccountRequestModal";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">RMS</h1>
        <nav className="space-x-4">
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Empowering Communities, One Report at a Time
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Seamlessly report incidents, stay informed, and connect with your
          barangay officials.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Submit a Report
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">📄 Incident Reporting</h3>
          <p className="text-gray-600">
            Residents can easily report incidents directly to barangay
            officials.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">📊 Real-Time Tracking</h3>
          <p className="text-gray-600">
            Monitor the status of reports and stay updated with real-time
            notifications.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">🔐 Secure Access</h3>
          <p className="text-gray-600">
            Role-based access ensures data privacy and secure communication.
          </p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-12 text-center justify-center">
        <h2 className="text-4xl font-bold mb-4">
          Request an account to get started
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Request an Account
        </button>
      </section>

      <AccountRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
