import { supabase } from "./supabase";

export async function uploadForm(file: File, folder = "uploads") {
  const filePath = `${folder}/${file.name}`;

  const { error } = await supabase.storage
    .from("forms")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("forms")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function listForms() {
  const { data, error } = await supabase.storage.from("forms").list("uploads", {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    console.error("Error listing files:", error);
    return [];
  }

  return data ?? [];
}
