import type { EnquiryStatus } from "@/types/enquiry";

/**
 * Hand-written to match supabase/schema.sql. Keep in sync if the schema
 * changes — there is no live project to generate this from automatically.
 */
export interface Database {
  public: {
    Tables: {
      enquiries: {
        Row: {
          id: string;
          reference: string;
          status: EnquiryStatus;
          business_name: string;
          contact_name: string;
          email: string;
          answers: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name: string;
          contact_name: string;
          email: string;
          answers: Record<string, unknown>;
        };
        Update: {
          status?: EnquiryStatus;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
        };
        Update: {
          email?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
