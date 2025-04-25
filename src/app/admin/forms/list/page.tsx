"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { listForms } from "@/lib/storage";
import LazyLoader from "@/components/LazyLoaders/TableSkeleton";

interface FileObject {
  name: string;
  created_at?: string;
  [key: string]: any;
}

export default function AdminFormsPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.storage
        .from("forms")
        .list("uploads", {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });

      console.log("Files from uploads:", data);

      if (error) {
        console.error("Error fetching files:", error.message);
        return;
      }

      setFiles(data ?? []);
    } catch (err) {
      console.error("An unexpected error occurred while fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    const fullPath = `uploads/${filename}`;
    const { data, error } = await supabase.storage
      .from("forms")
      .remove([fullPath]);

    if (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete file: " + error.message);
    } else if (data && data.length > 0) {
      console.log("Deleted:", data);
      setFiles((prev) => prev.filter((file) => file.name !== filename));
    } else {
      console.warn(
        "File not deleted (no error, but empty response):",
        fullPath
      );
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Uploaded Forms</h1>

      {loading ? (
        <LazyLoader />
      ) : files.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const publicUrl = supabase.storage
              .from("forms")
              .getPublicUrl(`uploads/${file.name}`).data.publicUrl;

            return (
              <li
                key={file.name}
                className="flex items-center justify-between border p-4 rounded"
              >
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
