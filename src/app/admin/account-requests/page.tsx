// pages/admin/account-requests.tsx
"use client";

import { useEffect, useState } from "react";

type AccountRequest = {
  id: string;
  email: string;
  password: string;
  address: string;
  created_at: string;
};

export default function AccountRequestsPage() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("/api/account-request/list");
      const data = await res.json();
      setRequests(data.requests);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (request: AccountRequest) => {
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
      alert(`Account created for ${request.email}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } else {
      alert("Failed to create account.");
    }
  };

  const handleReject = async (id: string) => {
    const confirmed = confirm("Are you sure you want to reject this request?");
    if (!confirmed) return;

    const res = await fetch("/api/account-request/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to reject request.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account Requests</h1>
      {requests.length === 0 ? (
        <p>No pending account requests.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Requested At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b">{request.email}</td>
                <td className="py-2 px-4 border-b">{request.address}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(request.created_at).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleApprove(request)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
