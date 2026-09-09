"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateAll } from "@/lib/enquiry-validation";
import { notifyAdminOfNewEnquiry } from "@/server/notify-admin";
import {
  MAX_FILES_PER_FIELD,
  isValidationError,
  validateUploadedImage,
} from "@/server/file-validation";
import type { EnquiryData, EnquiryErrors, StoredFileMeta } from "@/types/enquiry";

const UPLOAD_BUCKET = "enquiry-uploads";
const FILE_FIELDS = ["logoUpload", "photoUpload"] as const;
type FileField = (typeof FILE_FIELDS)[number];

export type SubmitEnquiryResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: EnquiryErrors };

const GENERIC_ERROR = "Something went wrong submitting your enquiry. Please try again.";

export async function submitEnquiry(formData: FormData): Promise<SubmitEnquiryResult> {
  try {
    const data = parseAnswers(formData);
    if (!data) {
      return { ok: false, error: GENERIC_ERROR };
    }

    const fieldErrors = validateAll(data);
    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors,
      };
    }

    const filesByField: Record<FileField, File[]> = {
      logoUpload: formData.getAll("file:logoUpload").filter(isFile),
      photoUpload: formData.getAll("file:photoUpload").filter(isFile),
    };

    for (const field of FILE_FIELDS) {
      if (filesByField[field].length !== data[field].length) {
        return { ok: false, error: GENERIC_ERROR };
      }
      if (filesByField[field].length > MAX_FILES_PER_FIELD) {
        return {
          ok: false,
          error: `Please upload no more than ${MAX_FILES_PER_FIELD} files per field.`,
        };
      }
    }

    const enquiryId = crypto.randomUUID();
    const supabase = await createSupabaseServerClient();

    const storedByField: Record<FileField, StoredFileMeta[]> = { logoUpload: [], photoUpload: [] };

    for (const field of FILE_FIELDS) {
      const metas = data[field];
      const files = filesByField[field];

      for (let index = 0; index < files.length; index += 1) {
        const meta = metas[index];
        const file = files[index];

        const validated = await validateUploadedImage(file);
        if (isValidationError(validated)) {
          return { ok: false, error: validated.message };
        }

        const path = `${enquiryId}/${field}/${validated.storageName}`;
        const { error: uploadError } = await supabase.storage
          .from(UPLOAD_BUCKET)
          .upload(path, validated.bytes, { contentType: validated.mimeType, upsert: false });

        if (uploadError) {
          console.error("[submit-enquiry] Storage upload failed:", uploadError);
          return { ok: false, error: GENERIC_ERROR };
        }

        storedByField[field].push({
          id: meta.id,
          name: validated.originalName,
          size: validated.size,
          type: validated.mimeType,
          path,
        });
      }
    }

    const answers = {
      ...data,
      logoUpload: storedByField.logoUpload,
      photoUpload: storedByField.photoUpload,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("enquiries")
      .insert({
        id: enquiryId,
        business_name: data.businessName,
        contact_name: data.yourName,
        email: data.email,
        answers,
      })
      .select("reference")
      .single();

    if (insertError || !inserted) {
      console.error("[submit-enquiry] Database insert failed:", insertError);
      return { ok: false, error: GENERIC_ERROR };
    }

    await notifyAdminOfNewEnquiry({
      reference: inserted.reference,
      businessName: data.businessName,
      contactName: data.yourName,
      email: data.email,
      enquiryId,
    });

    return { ok: true, reference: inserted.reference };
  } catch (error) {
    console.error("[submit-enquiry] Unexpected error:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}

function isFile(value: FormDataEntryValue): value is File {
  return typeof value === "object" && "arrayBuffer" in value;
}

function parseAnswers(formData: FormData): EnquiryData | null {
  const raw = formData.get("answers");
  if (typeof raw !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as EnquiryData;
  } catch {
    return null;
  }
}
