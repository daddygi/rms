"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Overview", href: "/admin/dashboard" },
    { label: "Incident Reports", href: "/admin/reports" },
    { label: "Feedback", href: "/admin/feedback" },
    { label: "Forms", href: "/admin/forms" },
    { label: "Forms List", href: "/admin/forms/list" },
    { label: "Users", href: "/admin/users" },
    { label: "Create User", href: "/admin/createUser" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">RMS Admin Dashboard</h1>
        <LogoutButton />
      </header>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 px-4 sm:px-6 py-6">
        <aside className="md:w-1/4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded font-medium ${
                pathname === link.href
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </aside>

        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
}
