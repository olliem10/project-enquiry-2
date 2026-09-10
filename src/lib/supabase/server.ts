import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Uses the public anon key — every table and storage bucket is
 * protected by Row Level Security, so this is safe regardless of caller.
 *
 * The service-role key is intentionally never used anywhere in this app:
 * admin access is granted entirely through RLS policies keyed off the
 * `admins` table, so there is no bypass-everything credential to leak.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render — middleware.ts
            // refreshes the session cookie on the next request instead.
          }
        },
      },
    },
  );
}

function requireEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill in your Supabase project details.`,
    );
  }
  return value;
}
