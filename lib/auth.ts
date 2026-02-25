import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile, UserRole } from "@/lib/types";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile: profile as Profile | null };
}

export async function requireAuth() {
  const { user, profile } = await getUser();
  if (!user) redirect("/auth/login");
  return { user, profile };
}

export async function requireRole(role: UserRole) {
  const { user, profile } = await requireAuth();
  if (profile?.role !== role) {
    if (role === "penyewa") redirect("/beranda");
    redirect("/dashboard");
  }
  return { user, profile: profile! };
}
