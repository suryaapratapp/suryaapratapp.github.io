import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

export const adminBackend = SUPABASE_PUBLISHABLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    })
    : null;

export async function getAuthorizedAdmin() {
    if (!adminBackend) return null;
    const { data: { user }, error } = await adminBackend.auth.getUser();
    if (error || !user) return null;
    const { data: membership, error: membershipError } = await adminBackend
        .from("admin_members")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
    if (membershipError || membership?.role !== "admin") return null;
    return user;
}
