import { supabase } from "@/lib/supabase";

export async function fetchAdminForms() {
  const { data, error } = await supabase.storage.from("forms").list("uploads", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) throw error;
  return data;
}
