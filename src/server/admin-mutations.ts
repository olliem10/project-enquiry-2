"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/server/admin-auth";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/types/enquiry";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const UPLOAD_BUCKET = "enquiry-uploads";
const SIGNED_URL_TTL_SECONDS = 60;

export type ActionResult = { ok: true } | { ok: false; error: string };

function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return typeof value === "string" && (ENQUIRY_STATUSES as string[]).includes(value);
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Your session has expired. Please sign in again." };

  if (!isEnquiryStatus(status)) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", enquiryId);

  if (error) {
    console.error("[admin-mutations] Failed to update status:", error);
    return { ok: false, error: GENERIC_ERROR };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${enquiryId}`);
  return { ok: true };
}

export type SignedUrlResult = { ok: true; url: string } | { ok: false; error: string };

/** Generates a short-lived signed URL for one uploaded file — never a permanent public link. */
export async function getSignedFileUrl(path: string): Promise<SignedUrlResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Your session has expired. Please sign in again." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(UPLOAD_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    console.error("[admin-mutations] Failed to create signed URL:", error);
    return { ok: false, error: "Couldn't open that file. Please try again." };
  }

  return { ok: true, url: data.signedUrl };
}
