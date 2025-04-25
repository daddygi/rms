"use client";

import { useState } from "react";
import { uploadForm } from "@/lib/storage";
import { Loader2, UploadCloud } from "lucide-react";

export default function AdminFormsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
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
      <h1 className="text-2xl font-bold mb-6">Upload Downloadable Form</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow-md border border-gray-200">
        <div>
          <label
            htmlFor="file"
            className="block font-medium text-sm text-gray-700 mb-1"
          >
            Select a file to upload
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded transition"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Upload Form
            </>
          )}
        </button>

        {url && (
          <div className="bg-green-50 text-green-800 border border-green-200 rounded p-4 mt-4">
            <p className="font-medium mb-1">Form uploaded successfully!</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View uploaded form
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
