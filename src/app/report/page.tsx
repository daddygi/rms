// src/app/report/page.tsx
"use client";

import { useUser } from "@/lib/AuthProvider";

export default function ReportPage() {
  const user = useUser();

  if (!user) return <p>Please login to submit a report.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Incident Report Form</h1>
      {/* Form UI Here */}
    </main>
  );
}
