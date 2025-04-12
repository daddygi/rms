"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface FileObject {
  name: string;
  created_at?: string;
}

export default function PublicFormsPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage
      .from("forms")
      .list("uploads", {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Error fetching forms:", error.message);
    } else {
      setFiles(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link
        href="/dashboard"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4">Downloadable Forms</h1>

      {loading ? (
        <p>Loading forms...</p>
      ) : files.length === 0 ? (
        <p>No forms available at the moment.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const publicUrl = supabase.storage
              .from("forms")
              .getPublicUrl(`uploads/${file.name}`).data.publicUrl;

            return (
              <li
                key={file.name}
                className="flex justify-between items-center border p-4 rounded bg-white"
              >
                <span className="truncate max-w-[70%]">{file.name}</span>
                <a
                  href={publicUrl}
                  download
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Download
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
