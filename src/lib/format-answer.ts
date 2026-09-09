import { formatBytes } from "@/lib/format-bytes";
import type { EnquiryData, Question } from "@/types/enquiry";

const OTHER_FIELD_FOR: Partial<Record<Question["id"], keyof EnquiryData>> = {
  visitorActions: "visitorActionsOther",
  desiredPages: "desiredPagesOther",
  stylePreferences: "stylePreferencesOther",
  contactMethods: "contactMethodsOther",
};

export function formatAnswer(question: Question, data: EnquiryData): string {
  const value = data[question.id];

  if (question.type === "agreement") {
    return value ? "Confirmed" : "Not yet confirmed";
  }

  if (question.type === "file") {
    const files = value as EnquiryData["logoUpload"];
    if (files.length === 0) return "No files added";
    return files.map((file) => `${file.name} (${formatBytes(file.size)})`).join(", ");
  }

  if (question.type === "multi-choice") {
    const selections = value as string[];
    if (selections.length === 0) return "Not provided";
    const otherKey = OTHER_FIELD_FOR[question.id];
    const otherText = otherKey ? (data[otherKey] as string) : "";
    return selections
      .map((selection) => (selection === "Other" && otherText ? `Other: ${otherText}` : selection))
      .join(", ");
  }

  if (typeof value === "string") {
    return value.trim() ? value : "Not provided";
  }

  return "Not provided";
}
