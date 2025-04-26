"use client";

import { useEffect, useState } from "react";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import Modal from "@/components/Modal";
import { format } from "date-fns";
import LazyLoader from "@/components/LazyLoaders/Spinner";
import NoData from "@/components/Nodata";

type AccountRequest = {
  id: string;
  email: string;
  password: string;
  address: string;
  created_at: string;
};

type ExtendedAccountRequest = AccountRequest & {
  formatted_created_at: string;
};

export default function AccountRequestsPage() {
  const [requests, setRequests] = useState<ExtendedAccountRequest[]>([]);
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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/account-request/list");
        const data = await res.json();

        const formatted: ExtendedAccountRequest[] = data.requests.map(
          (r: AccountRequest) => ({
            ...r,
            formatted_created_at: format(new Date(r.created_at), "PPPpp"),
          })
        );

        setRequests(formatted);
      } catch (error) {
        setModal({
          open: true,
          title: "Error",
          message: "Failed to load account requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleModalClose = () => {
    setModal({ open: false, title: "", message: "" });
  };

  const confirmApprove = (request: ExtendedAccountRequest) => {
    setModal({
      open: true,
      title: "Approve Request",
      message: `Are you sure you want to approve the request for ${request.email}?`,
      onConfirm: async () => {
        const res = await fetch("/api/account-request/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: request.email,
            password: request.password,
            address: request.address,
          }),
        });

        if (res.ok) {
          setModal({
            open: true,
            title: "Success",
            message: `Account created for ${request.email}`,
          });
          setRequests((prev) => prev.filter((r) => r.id !== request.id));
        } else {
          setModal({
            open: true,
            title: "Error",
            message: "Failed to create account.",
          });
        }
      },
    });
  };

  const confirmReject = (request: ExtendedAccountRequest) => {
    setModal({
      open: true,
      title: "Reject Request",
      message: `Are you sure you want to reject the request for ${request.email}?`,
      onConfirm: async () => {
        const res = await fetch("/api/account-request/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: request.id }),
        });

        if (res.ok) {
          setRequests((prev) => prev.filter((r) => r.id !== request.id));
          handleModalClose();
        } else {
          setModal({
            open: true,
            title: "Error",
            message: "Failed to reject request.",
          });
        }
      },
    });
  };

  const columns: Column<ExtendedAccountRequest>[] = [
    { label: "Email", accessor: "email" },
    { label: "Address", accessor: "address" },
    { label: "Requested At", accessor: "formatted_created_at" },
  ];

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Requests</h1>

      {!loading && requests.length === 0 ? (
        <NoData
          message="No pending account requests."
          imageSrc="/assets/noRecords.svg"
        />
      ) : (
        <PaginatedTable<ExtendedAccountRequest>
          data={requests}
          columns={columns}
          rowsPerPage={10}
          dateField="created_at"
          isLoading={loading}
          renderActions={(row) => (
            <div className="flex gap-2">
              <button
                onClick={() => confirmApprove(row)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => confirmReject(row)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        />
      )}

      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={modal.onConfirm}
        confirmLabel="Yes, proceed."
        cancelLabel="Cancel"
      />
    </main>
  );
}
