"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard 👋</h1>
      </div>
      <p className="mt-2 text-gray-600 mb-6">You're now logged in to RMS.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/report"
          className="border rounded-lg p-4 hover:bg-gray-100 transition block"
        >
          <h2 className="font-semibold text-lg mb-1">Submit Incident Report</h2>
          <p className="text-sm text-gray-600">
            File a complaint or report an issue within the subdivision.
          </p>
        </Link>

        <Link
          href="dashboard/reports"
          className="border rounded-lg p-4 hover:bg-gray-100 transition block"
        >
          <h2 className="font-semibold text-lg mb-1">My Reports</h2>
          <p className="text-sm text-gray-600">
            View your previously submitted incident reports.
          </p>
        </Link>

        <Link
          href="/dashboard/forms"
          className="border rounded-lg p-4 hover:bg-gray-100 transition block"
        >
          <h2 className="font-semibold text-lg mb-1">Downloadable Forms</h2>
          <p className="text-sm text-gray-600">
            Access barangay forms for printing or submission.
          </p>
        </Link>

        <Link
          href="/dashboard/feedback"
          className="border rounded-lg p-4 hover:bg-gray-100 transition block"
        >
          <h2 className="font-semibold text-lg mb-1">Submit Feedback</h2>
          <p className="text-sm text-gray-600">
            Share your feedback or suggestions with us.
          </p>
        </Link>
      </div>
    </main>
  );
}
