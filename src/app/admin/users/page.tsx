"use client";

import { useEffect, useState } from "react";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import LazyLoader from "@/components/LazyLoaders/Spinner";
import { Trash } from "lucide-react";

type User = {
  id: string;
  email: string;
  user_metadata: {
    role?: string;
  };
};

type ProcessedUser = {
  id: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ProcessedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users/list");
    const { users } = await res.json();
    const processed = users.map(
      (u: User): ProcessedUser => ({
        id: u.id,
        email: u.email,
        role: u.user_metadata?.role ?? "user",
      })
    );
    setUsers(processed);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    const res = await fetch(`/api/users/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: Column<ProcessedUser>[] = [
    { label: "Email", accessor: "email" },
    { label: "Role", accessor: "role" },
  ];

  const renderActions = (user: ProcessedUser) => (
    <button
      onClick={() => deleteUser(user.id)}
      className="text-red-500 hover:text-red-700"
      title="Delete"
    >
      <Trash size={18} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {loading ? (
        <LazyLoader />
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <PaginatedTable
          data={users}
          columns={columns}
          rowsPerPage={5}
          renderActions={renderActions}
        />
      )}
    </div>
  );
}
