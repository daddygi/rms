import type { Metadata } from "next";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Dashboard | RMS",
  description: "Resident dashboard for RMS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">RMS Dashboard</h1>
        <LogoutButton />
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </section>
    </main>
  );
}
