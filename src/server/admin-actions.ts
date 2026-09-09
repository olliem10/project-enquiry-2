"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export interface SignInResult {
  ok: false;
  error: string;
}

/**
 * Signs in with Supabase Auth, then confirms admin membership. Both a
 * wrong password AND a valid account that isn't an admin return the exact
 * same generic error — this never reveals whether an email address has
 * an account, or has one but isn't an admin.
 */
export async function signInAdmin(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: GENERIC_LOGIN_ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.user) {
    return { ok: false, error: GENERIC_LOGIN_ERROR };
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", signInData.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return { ok: false, error: GENERIC_LOGIN_ERROR };
  }

  redirect("/admin");
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
