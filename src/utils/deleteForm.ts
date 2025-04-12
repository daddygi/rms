// utils/deleteForm.ts
import { supabase } from "@/lib/supabase";

export async function deleteForm(filename: string) {
  const { error } = await supabase.storage
    .from("forms")
    .remove([`uploads/${filename}`]);
  if (error) throw error;
}
