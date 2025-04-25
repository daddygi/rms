"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Gauge,
  ShieldCheck,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import AccountRequestModal from "../components/AccountRequestModal";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 text-gray-800">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">RMS</h1>
        <nav>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Login
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-white to-transparent opacity-30 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="relative mx-auto w-full max-w-[500px] h-auto overflow-hidden">
            <img
              src="/assets/empower.svg"
              alt="Empower Image"
              className="w-full h-auto object-contain"
            />
          </div>

          <h2 className="text-4xl font-bold text-blue-800 mb-4 -mt-8 leading-snug">
            Empowering Communities, One Report at a Time
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            Report barangay incidents, track updates, and connect with local
            officials—faster and safer.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
          >
            Submit a Report <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-blue-600 mb-4">
            <FileEdit className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Incident Reporting
          </h3>
          <p className="text-gray-600 text-center">
            Submit reports directly to barangay officials with ease.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-blue-600 mb-4">
            <Gauge className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Real-Time Tracking
          </h3>
          <p className="text-gray-600 text-center">
            Stay updated with real-time status updates and alerts.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-blue-600 mb-4">
            <ShieldCheck className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Secure Access
          </h3>
          <p className="text-gray-600 text-center">
            Your data is protected with role-based access and security.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-blue-800">
            Request an Account
          </h2>
          <p className="text-gray-700 mb-6">
            Ready to start reporting? Request your account now and gain access
            to barangay services.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Request an Account
          </button>
        </div>
      </section>

      {/* Modal */}
      <AccountRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
