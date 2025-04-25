"use client";

import Link from "next/link";
import {
  FileText,
  MessageCircle,
  UserCircle,
  Activity,
  HelpCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Welcome Header */}
      <section className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow transition hover:shadow-lg hover:bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">
            Glad to see you here. Check out what's new today.
          </p>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/forms"
          className="group bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow transition hover:shadow-lg hover:bg-white text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full shadow group-hover:scale-105 transition-transform">
              <FileText className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Downloadable Forms
          </h2>
          <p className="text-sm text-gray-600">
            Access official barangay forms for printing or submission.
          </p>
        </Link>

        <Link
          href="/dashboard/feedback"
          className="group bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow transition hover:shadow-lg hover:bg-white text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-600 p-4 rounded-full shadow group-hover:scale-105 transition-transform">
              <MessageCircle className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Submit Feedback
          </h2>
          <p className="text-sm text-gray-600">
            Share your thoughts and help us improve the system.
          </p>
        </Link>

        <div className="group bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow transition hover:shadow-lg hover:bg-white text-center cursor-default">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full shadow group-hover:scale-105 transition-transform">
              <HelpCircle className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Need Help?
          </h2>
          <p className="text-sm text-gray-600">
            Check our user guide or contact support for assistance.
          </p>
        </div>
      </section>
    </main>
  );
}
