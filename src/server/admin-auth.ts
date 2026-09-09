import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  userId: string;
  email: string;
}

/**
 * Returns the current admin session, or null if there is no session, the
 * session is invalid, or the signed-in user is not in the `admins` table.
 * Being authenticated with Supabase is not enough on its own — membership
 * in `admins` (also enforced independently by RLS) is what grants access.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return null;

  return { userId: adminRow.user_id, email: adminRow.email };
}

/** Redirects to the admin login page unless the current user is an authorised admin. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
