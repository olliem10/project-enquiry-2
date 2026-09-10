export type SectionId =
  | "about-you"
  | "your-customers"
  | "your-new-website"
  | "branding-design"
  | "content-images"
  | "contact-info"
  | "final-details";

export interface SectionMeta {
  id: SectionId;
  index: number;
  name: string;
  description: string;
}

export type QuestionId =
  | "yourName"
  | "businessName"
  | "email"
  | "phone"
  | "businessAddress"
  | "businessDescription"
  | "businessAge"
  | "customerProfile"
  | "visitorActions"
  | "websitePurpose"
  | "desiredPages"
  | "hasCurrentWebsite"
  | "currentWebsiteUrl"
  | "currentWebsiteFeedback"
  | "hasLogo"
  | "logoUpload"
  | "hasBrandColours"
  | "brandColours"
  | "stylePreferences"
  | "designInspiration"
  | "hasPhotos"
  | "photoUpload"
  | "hasWrittenContent"
  | "businessInfoToInclude"
  | "hasTestimonials"
  | "testimonialsText"
  | "publicContactDetails"
  | "openingHours"
  | "socialLinks"
  | "contactMethods"
  | "specificInclusions"
  | "exclusions"
  | "competitors"
  | "additionalNotes"
  | "agreement";

export type QuestionType =
  | "short-text"
  | "email"
  | "paragraph"
  | "single-choice"
  | "multi-choice"
  | "file"
  | "agreement";

interface QuestionBase {
  id: QuestionId;
  number: number;
  section: SectionId;
  label: string;
  helpText?: string;
  required: boolean;
}

export interface ShortTextQuestion extends QuestionBase {
  type: "short-text" | "email";
  placeholder?: string;
}

export interface ParagraphQuestion extends QuestionBase {
  type: "paragraph";
  placeholder?: string;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: "single-choice";
  options: string[];
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: "multi-choice";
  options: string[];
  allowOther: true;
}

export interface FileQuestion extends QuestionBase {
  type: "file";
}

export interface AgreementQuestion extends QuestionBase {
  type: "agreement";
}

export type Question =
  | ShortTextQuestion
  | ParagraphQuestion
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | FileQuestion
  | AgreementQuestion;

/**
 * File metadata as tracked client-side while the enquiry is in progress.
 * The actual bytes live in a separate client-only map (see
 * EnquiryExperience) keyed by `id`, so this stays JSON-serialisable.
 * Once uploaded to Supabase Storage during submission, `path` is added —
 * see StoredFileMeta below.
 */
export interface UploadedFileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
}

/** UploadedFileMeta plus its Supabase Storage object path, as persisted with a submitted enquiry. */
export interface StoredFileMeta extends UploadedFileMeta {
  path: string;
}

export type EnquiryStatus = "new" | "in_progress" | "completed";

export const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "in_progress", "completed"];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  completed: "Completed",
};

export interface EnquiryData {
  // Section 1 — About You & Your Business
  yourName: string;
  businessName: string;
  email: string;
  phone: string;
  businessAddress: string;
  businessDescription: string;
  businessAge: string;

  // Section 2 — Your Customers
  customerProfile: string;
  visitorActions: string[];
  visitorActionsOther: string;

  // Section 3 — Your New Website
  websitePurpose: string;
  desiredPages: string[];
  desiredPagesOther: string;
  hasCurrentWebsite: string;
  currentWebsiteUrl: string;
  currentWebsiteFeedback: string;

  // Section 4 — Branding & Design
  hasLogo: string;
  logoUpload: UploadedFileMeta[];
  hasBrandColours: string;
  brandColours: string;
  stylePreferences: string[];
  stylePreferencesOther: string;
  designInspiration: string;

  // Section 5 — Content & Images
  hasPhotos: string;
  photoUpload: UploadedFileMeta[];
  hasWrittenContent: string;
  businessInfoToInclude: string;
  hasTestimonials: string;
  testimonialsText: string;

  // Section 6 — Contact & Business Information
  publicContactDetails: string;
  openingHours: string;
  socialLinks: string;
  contactMethods: string[];
  contactMethodsOther: string;
  specificInclusions: string;

  // Section 7 — Final Details
  exclusions: string;
  competitors: string;
  additionalNotes: string;
  agreement: boolean;
}

export type EnquiryErrors = Partial<Record<QuestionId, string>>;

export type StepId = "welcome" | SectionId | "review" | "success";

/** EnquiryData as persisted after submission: uploads carry their storage path. */
export type StoredEnquiryData = Omit<EnquiryData, "logoUpload" | "photoUpload"> & {
  logoUpload: StoredFileMeta[];
  photoUpload: StoredFileMeta[];
};
