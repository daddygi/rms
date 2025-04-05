// src/lib/hooks/useIsAdmin.ts
import { useUser } from "@/lib/AuthProvider";

export function useIsAdmin(): boolean {
  const { user } = useUser();
  return user?.user_metadata?.role === "admin";
}
