"use client";

import { useEffect, useState } from "react";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import NoData from "@/components/Nodata";
import Modal from "@/components/Modal";
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

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/list");

      if (!res.ok) {
        throw new Error(`Failed to fetch users. Status: ${res.status}`);
      }

      const { users } = await res.json();

      const processed = users.map(
        (u: User): ProcessedUser => ({
          id: u.id,
          email: u.email,
          role: u.user_metadata?.role ?? "user",
        })
      );

      setUsers(processed);
    } catch (error) {
      console.error("Error fetching users:", error);
      setModal({
        open: true,
        title: "Error",
        message: "Failed to load users. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModal({ open: false, title: "", message: "" });
  };

  const confirmDelete = (user: ProcessedUser) => {
    setModal({
      open: true,
      title: "Delete User",
      message: `Are you sure you want to delete the user ${user.email}?`,
      onConfirm: async () => {
        const res = await fetch(`/api/users/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id }),
        });

        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          handleModalClose();
        } else {
          setModal({
            open: true,
            title: "Error",
            message: "Failed to delete user.",
          });
        }
      },
    });
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
      onClick={() => confirmDelete(user)}
      className="text-red-500 hover:text-red-700"
      title="Delete"
    >
      <Trash size={18} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {!loading && users.length === 0 ? (
        <NoData message="No users found." imageSrc="/assets/noRecords.svg" />
      ) : (
        <PaginatedTable
          data={users}
          columns={columns}
          rowsPerPage={10}
          renderActions={renderActions}
          isLoading={loading}
        />
      )}

      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={modal.onConfirm}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
