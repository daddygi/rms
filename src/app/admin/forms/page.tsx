"use client";

import { useState } from "react";
import { uploadForm } from "@/lib/storage";

export default function AdminFormsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    console.log("Handle upload...");
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadForm(file);
      setUrl(publicUrl);
    } catch (error) {
      alert("Upload failed!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Downloadable Form</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <div className="mt-4">
          <p className="text-green-600">Form uploaded!</p>
          <a href={url} target="_blank" className="text-blue-600 underline">
            View form
          </a>
        </div>
      )}
    </main>
  );
}
