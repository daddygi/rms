import type { Metadata } from "next";
import AdminLayoutClient from "@/components/layouts/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Dashboard | RMS",
  description: "Resident dashboard for RMS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
