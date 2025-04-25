"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import PaginatedTable, { Column } from "@/components/PaginatedTable";
import NoData from "@/components/Nodata";
import Modal from "@/components/Modal";
import { Download, Eye, Trash } from "lucide-react";

interface FileObject {
  id: string; // for PaginatedTable compatibility
  name: string;
  updated_at?: string;
}

export default function AdminFormsPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, title: "", message: "" });

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("forms")
        .list("uploads", {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });

      if (error) {
        console.error("Error fetching files:", error.message);
        return;
      }

      const filesWithId = (data ?? []).map((file) => ({
        ...file,
        id: file.name,
        updated_at: file.updated_at
          ? format(new Date(file.updated_at), "PPPpp")
          : undefined,
      }));

      setFiles(filesWithId);
    } catch (err) {
      console.error("Unexpected error:", err);
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
      setModal({
        open: true,
        title: "Error",
        message: `Failed to delete file: ${error.message}`,
      });
    } else {
      setFiles((prev) => prev.filter((file) => file.name !== filename));
      setModal({
        open: true,
        title: "Deleted",
        message: `File "${filename}" was successfully deleted.`,
      });
    }
  };

  const confirmDelete = (file: FileObject) => {
    setModal({
      open: true,
      title: "Delete File",
      message: `Are you sure you want to delete "${file.name}"?`,
      onConfirm: () => handleDelete(file.name),
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const columns: Column<FileObject>[] = [
    { label: "File Name", accessor: "name" },
    { label: "Last Modified", accessor: "updated_at" },
  ];

  const renderActions = (file: FileObject) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          const publicUrl = supabase.storage
            .from("forms")
            .getPublicUrl(`uploads/${file.name}`).data.publicUrl;
          window.open(publicUrl, "_blank");
        }}
        title="View"
        className="text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={async () => {
          const { data, error } = await supabase.storage
            .from("forms")
            .download(`uploads/${file.name}`);
          if (error) {
            console.error("Download error:", error.message);
            setModal({
              open: true,
              title: "Error",
              message: `Failed to download file: ${error.message}`,
            });
            return;
          }

          const url = window.URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          a.click();
          window.URL.revokeObjectURL(url);
        }}
        title="Download"
        className="text-green-600 hover:text-green-800 cursor-pointer"
      >
        <Download size={18} />
      </button>

      <button
        onClick={() => confirmDelete(file)}
        title="Delete"
        className="text-red-500 hover:text-red-700 cursor-pointer"
      >
        <Trash size={18} />
      </button>
    </div>
  );

  const handleModalClose = () =>
    setModal({ open: false, title: "", message: "", onConfirm: undefined });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Uploaded Forms</h1>

      {!loading && files.length === 0 ? (
        <NoData
          message="No uploaded files found."
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
