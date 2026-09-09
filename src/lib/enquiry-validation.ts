import { questionsForSection } from "@/data/enquiry-schema";
import type {
  EnquiryData,
  EnquiryErrors,
  Question,
  QuestionId,
  SectionId,
} from "@/types/enquiry";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Questions that stay in the data model at all times but are only shown
 * (and only required) when their trigger answer is given.
 */
const CONDITIONAL_VISIBILITY: Partial<
  Record<QuestionId, (data: EnquiryData) => boolean>
> = {
  currentWebsiteUrl: (data) => data.hasCurrentWebsite === "Yes",
  currentWebsiteFeedback: (data) => data.hasCurrentWebsite === "Yes",
  brandColours: (data) => data.hasBrandColours === "Yes",
  testimonialsText: (data) => data.hasTestimonials === "Yes",
};

export function isQuestionVisible(question: Question, data: EnquiryData): boolean {
  const rule = CONDITIONAL_VISIBILITY[question.id];
  return rule ? rule(data) : true;
}

export function visibleQuestionsForSection(
  section: SectionId,
  data: EnquiryData,
): Question[] {
  return questionsForSection(section).filter((question) => isQuestionVisible(question, data));
}

function isEmptyValue(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null;
}

function validateQuestion(question: Question, data: EnquiryData): string | undefined {
  const value = data[question.id];

  if (question.type === "agreement") {
    return value === true ? undefined : "Please confirm before submitting.";
  }

  if (question.type === "email") {
    const stringValue = String(value ?? "");
    if (!stringValue.trim()) {
      return question.required ? "Please enter your email address." : undefined;
    }
    return EMAIL_PATTERN.test(stringValue.trim())
      ? undefined
      : "That email address doesn't look right — please double-check it.";
  }

  if (!question.required) return undefined;

  if (isEmptyValue(value)) {
    if (question.type === "single-choice") return "Please choose an option.";
    if (question.type === "multi-choice") return "Please select at least one option.";
    return "This is required — please fill it in.";
  }

  return undefined;
}

export function validateSection(section: SectionId, data: EnquiryData): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const question of visibleQuestionsForSection(section, data)) {
    const error = validateQuestion(question, data);
    if (error) errors[question.id] = error;
  }
  return errors;
}

export function validateAll(data: EnquiryData): EnquiryErrors {
  const sections: SectionId[] = [
    "about-you",
    "your-customers",
    "your-new-website",
    "branding-design",
    "content-images",
    "contact-info",
    "final-details",
  ];
  return sections.reduce<EnquiryErrors>(
    (all, section) => ({ ...all, ...validateSection(section, data) }),
    {},
  );
}

export function sectionHasErrors(section: SectionId, data: EnquiryData): boolean {
  return Object.keys(validateSection(section, data)).length > 0;
}
