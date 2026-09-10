import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EnquiryStatus, StoredEnquiryData } from "@/types/enquiry";

export interface AdminEnquiry {
  id: string;
  reference: string;
  status: EnquiryStatus;
  businessName: string;
  contactName: string;
  email: string;
  answers: StoredEnquiryData;
  createdAt: string;
  updatedAt: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns null for a malformed id, a missing enquiry, or one the caller isn't authorised to see (RLS). */
export async function getEnquiryById(id: string): Promise<AdminEnquiry | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("id, reference, status, business_name, contact_name, email, answers, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin-enquiry] Failed to load enquiry:", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    reference: data.reference,
    status: data.status,
    businessName: data.business_name,
    contactName: data.contact_name,
    email: data.email,
    // Stored as-is by the trusted submission server action — shape is
    // guaranteed at write time, not re-validated on every read.
    answers: data.answers as unknown as StoredEnquiryData,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
