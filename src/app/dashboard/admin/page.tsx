"use client";

import { useIsAdmin } from "@/lib/hooks/useIsAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/dashboard"); // redirect non-admins
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <a href="/dashboard/admin/reports" className="underline">
            📄 View All Reports
          </a>
        </li>
        <li>
          <a href="/dashboard/admin/feedback" className="underline">
            💬 View Feedback
          </a>
        </li>
        <li>
          <a href="/dashboard/admin/forms" className="underline">
            📁 Upload Forms
          </a>
        </li>
      </ul>
    </main>
  );
}
