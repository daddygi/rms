"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useUser } from "@/lib/AuthProvider";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

const navLinks = [
  { href: "/dashboard/report", label: "Incident Report" },
  { href: "/dashboard/information", label: "Information Sheet" },
  { href: "/dashboard/reports", label: "History" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const hasMounted = useHasMounted();

  const avatarChar =
    hasMounted && user?.email ? user.email[0].toUpperCase() : "?";
  const displayName = hasMounted
    ? user?.user_metadata?.full_name || user?.email || "Guest"
    : "Guest";

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-none shadow-xl/20 md:static transform transition-all duration-300 ease-in-out flex flex-col
        ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 md:opacity-100 md:translate-x-0"
        }
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {/* Close button for mobile */}
          <button
            className="absolute top-4 right-4 md:hidden text-gray-600 hover:text-black"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center gap-2 px-13 pt-5">
            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg">
              {avatarChar}
            </div>
            <span className="text-sm font-medium text-center">
              {isLoading ? "Loading..." : displayName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <p className="text-sm text-gray-500">Forms</p>
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-auto flex justify-center">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}

      <div className="flex flex-col flex-1 ">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white  drop-shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">RMS Dashboard</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
