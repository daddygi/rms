"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import NoData from "@/components/Nodata";
import Link from "next/link";
import { Download } from "lucide-react";

interface FileObject {
  id: string; // Needed for PaginatedTable
  name: string;
}

export default function PublicFormsPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("forms")
        .list("uploads", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Error fetching forms:", error.message);
        return;
      }

      const filesWithId = (data ?? []).map((file) => ({
        ...file,
        id: file.name, // Use name as id
      }));

      setFiles(filesWithId);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const columns: Column<FileObject>[] = [
    { label: "File Name", accessor: "name" },
  ];

  const renderActions = (file: FileObject) => (
    <div className="flex gap-2">
      <a
        href={
          supabase.storage.from("forms").getPublicUrl(`uploads/${file.name}`)
            .data.publicUrl
        }
        download
        title="Download"
        className="text-green-600 hover:text-green-800 cursor-pointer"
      >
        <Download size={18} />
      </a>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4">Downloadable Forms</h1>

      {!loading && files.length === 0 ? (
        <NoData
          message="No downloadable forms available."
          imageSrc="/assets/noRecords.svg"
        />
      ) : (
        <PaginatedTable
          data={files}
          columns={columns}
          rowsPerPage={10}
          isLoading={loading}
          renderActions={renderActions}
        />
      )}
    </main>
  );
}
