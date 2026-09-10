import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/types/enquiry";

export interface EnquirySummary {
  id: string;
  reference: string;
  businessName: string;
  contactName: string;
  email: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface EnquiryListFilters {
  search?: string;
  status?: EnquiryStatus;
}

/** Removes characters that would break PostgREST's `or(...)` filter syntax. */
function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()%]/g, "").trim().slice(0, 200);
}

export async function listEnquiries(filters: EnquiryListFilters): Promise<EnquirySummary[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("enquiries")
    .select("id, reference, business_name, contact_name, email, status, created_at")
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const search = filters.search ? sanitizeSearchTerm(filters.search) : "";
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `business_name.ilike.${pattern},contact_name.ilike.${pattern},email.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin-queries] Failed to list enquiries:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    reference: row.reference,
    businessName: row.business_name,
    contactName: row.contact_name,
    email: row.email,
    status: row.status,
    createdAt: row.created_at,
  }));
}
