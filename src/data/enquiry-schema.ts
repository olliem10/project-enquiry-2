import type {
  EnquiryData,
  Question,
  SectionId,
  SectionMeta,
} from "@/types/enquiry";

export const ENQUIRY_TITLE = "NexalField — Website Project Enquiry";

/**
 * Placeholder copy: no previously-approved enquiry description was
 * available to reuse for this build. Replace with the approved text.
 */
export const ENQUIRY_DESCRIPTION =
  "A few questions about your business and what you'd like your new website to do, so we can put together a plan that fits.";

export const ENQUIRY_ESTIMATED_MINUTES = "10–15 minutes";

export const SECTIONS: SectionMeta[] = [
  {
    id: "about-you",
    index: 1,
    name: "About You & Your Business",
    description: "The basics — who you are and what your business does.",
  },
  {
    id: "your-customers",
    index: 2,
    name: "Your Customers",
    description: "Who your website needs to speak to.",
  },
  {
    id: "your-new-website",
    index: 3,
    name: "Your New Website",
    description: "What the new site needs to achieve and include.",
  },
  {
    id: "branding-design",
    index: 4,
    name: "Branding & Design",
    description: "Your logo, colours, and the look you're after.",
  },
  {
    id: "content-images",
    index: 5,
    name: "Content & Images",
    description: "What you already have, and what we'll need to create.",
  },
  {
    id: "contact-info",
    index: 6,
    name: "Contact & Business Information",
    description: "What should appear publicly on the finished site.",
  },
  {
    id: "final-details",
    index: 7,
    name: "Final Details",
    description: "Anything else that will help us get this right.",
  },
];

export const QUESTIONS: Question[] = [
  // Section 1 — About You & Your Business
  {
    id: "yourName",
    number: 1,
    section: "about-you",
    type: "short-text",
    label: "Your name",
    required: true,
    placeholder: "Jordan Smith",
  },
  {
    id: "businessName",
    number: 2,
    section: "about-you",
    type: "short-text",
    label: "Business name",
    required: true,
    placeholder: "Your business name",
  },
  {
    id: "email",
    number: 3,
    section: "about-you",
    type: "email",
    label: "Your email address",
    required: true,
    placeholder: "you@example.com",
  },
  {
    id: "phone",
    number: 4,
    section: "about-you",
    type: "short-text",
    label: "Phone number",
    required: true,
    placeholder: "07123 456789",
  },
  {
    id: "businessAddress",
    number: 5,
    section: "about-you",
    type: "paragraph",
    label: "Business address",
    required: false,
  },
  {
    id: "businessDescription",
    number: 6,
    section: "about-you",
    type: "paragraph",
    label: "What does your business do?",
    required: true,
  },
  {
    id: "businessAge",
    number: 7,
    section: "about-you",
    type: "single-choice",
    label: "How long has the business been operating?",
    required: false,
    options: [
      "Less than 1 year",
      "1–2 years",
      "3–5 years",
      "6–10 years",
      "More than 10 years",
    ],
  },

  // Section 2 — Your Customers
  {
    id: "customerProfile",
    number: 8,
    section: "your-customers",
    type: "paragraph",
    label:
      "Who are your main customers, and what are they usually looking for when they contact you?",
    required: true,
  },
  {
    id: "visitorActions",
    number: 9,
    section: "your-customers",
    type: "multi-choice",
    label: "What do you want visitors to do when they visit your website?",
    required: true,
    allowOther: true,
    options: [
      "Get in touch / send an enquiry",
      "Call the business",
      "Browse products or services",
      "Book an appointment",
      "Find opening hours or location",
      "Learn more about the business",
      "Read reviews or testimonials",
    ],
  },

  // Section 3 — Your New Website
  {
    id: "websitePurpose",
    number: 10,
    section: "your-new-website",
    type: "paragraph",
    label: "What is the main purpose of the new website?",
    required: true,
  },
  {
    id: "desiredPages",
    number: 11,
    section: "your-new-website",
    type: "multi-choice",
    label: "What pages would you like?",
    required: true,
    allowOther: true,
    options: [
      "Home",
      "About",
      "Services",
      "Products / Shop",
      "Portfolio / Our Work",
      "Pricing",
      "Blog / News",
      "FAQs",
      "Contact",
    ],
  },
  {
    id: "hasCurrentWebsite",
    number: 12,
    section: "your-new-website",
    type: "single-choice",
    label: "Do you currently have a website?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "currentWebsiteUrl",
    number: 13,
    section: "your-new-website",
    type: "short-text",
    label: "If yes, what is the website address?",
    required: false,
    placeholder: "https://www.example.com",
  },
  {
    id: "currentWebsiteFeedback",
    number: 14,
    section: "your-new-website",
    type: "paragraph",
    label: "What do you like or dislike about your current website?",
    required: false,
  },

  // Section 4 — Branding & Design
  {
    id: "hasLogo",
    number: 15,
    section: "branding-design",
    type: "single-choice",
    label: "Do you already have a logo?",
    required: true,
    options: ["Yes, I have a logo", "No, I don't have one yet", "Not sure / it needs updating"],
  },
  {
    id: "logoUpload",
    number: 16,
    section: "branding-design",
    type: "file",
    label: "Upload your logo",
    required: false,
    helpText: "Optional — if you don't have one to hand, feel free to skip this for now.",
  },
  {
    id: "hasBrandColours",
    number: 17,
    section: "branding-design",
    type: "single-choice",
    label: "Do you have existing brand colours?",
    required: true,
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "brandColours",
    number: 18,
    section: "branding-design",
    type: "short-text",
    label: "If yes, what are your brand colours?",
    required: false,
    placeholder: "e.g. navy blue and gold",
  },
  {
    id: "stylePreferences",
    number: 19,
    section: "branding-design",
    type: "multi-choice",
    label: "What style would you like for your website?",
    required: false,
    allowOther: true,
    options: [
      "Clean & minimal",
      "Modern & bold",
      "Warm & friendly",
      "Professional & corporate",
      "Playful & creative",
      "Elegant & premium",
    ],
  },
  {
    id: "designInspiration",
    number: 20,
    section: "branding-design",
    type: "paragraph",
    label: "Are there any websites whose design you like?",
    required: false,
    helpText: "Links are great, but a description works too.",
  },

  // Section 5 — Content & Images
  {
    id: "hasPhotos",
    number: 21,
    section: "content-images",
    type: "single-choice",
    label: "Do you already have photographs you'd like to use?",
    required: true,
    options: [
      "Yes, I have photos ready",
      "No, I don't have any yet",
      "I have some, but could use more",
    ],
  },
  {
    id: "photoUpload",
    number: 22,
    section: "content-images",
    type: "file",
    label: "Upload any photographs you'd like us to consider",
    required: false,
    helpText: "Optional — you can also send these on separately later.",
  },
  {
    id: "hasWrittenContent",
    number: 23,
    section: "content-images",
    type: "single-choice",
    label: "Do you already have written content for your website?",
    required: true,
    options: [
      "Yes, I have content ready",
      "No, I'll need help writing it",
      "I have some, but it needs work",
    ],
  },
  {
    id: "businessInfoToInclude",
    number: 24,
    section: "content-images",
    type: "paragraph",
    label: "What information should customers know about your business?",
    required: false,
  },
  {
    id: "hasTestimonials",
    number: 25,
    section: "content-images",
    type: "single-choice",
    label: "Do you have testimonials you'd like included?",
    required: true,
    options: ["Yes", "No", "Not yet, but I can get some"],
  },
  {
    id: "testimonialsText",
    number: 26,
    section: "content-images",
    type: "paragraph",
    label: "If yes, please provide them here",
    required: false,
  },

  // Section 6 — Contact & Business Information
  {
    id: "publicContactDetails",
    number: 27,
    section: "contact-info",
    type: "paragraph",
    label: "What contact details should appear on the website?",
    required: true,
    helpText:
      "This is different from your own details in Section 1, which are just so we know who to contact about this enquiry. This question is about which business contact details — phone, email, address, etc. — should actually be shown publicly on the finished website.",
  },
  {
    id: "openingHours",
    number: 28,
    section: "contact-info",
    type: "paragraph",
    label: "What are your opening hours?",
    required: false,
  },
  {
    id: "socialLinks",
    number: 29,
    section: "contact-info",
    type: "paragraph",
    label: "Which social media accounts should we link to?",
    required: false,
  },
  {
    id: "contactMethods",
    number: 30,
    section: "contact-info",
    type: "multi-choice",
    label: "Do you want customers to be able to contact you through the website?",
    required: true,
    allowOther: true,
    options: ["Contact form", "Phone", "Email", "WhatsApp"],
  },
  {
    id: "specificInclusions",
    number: 31,
    section: "contact-info",
    type: "paragraph",
    label: "Is there anything specific you'd like the website to include?",
    required: false,
  },

  // Section 7 — Final Details
  {
    id: "exclusions",
    number: 32,
    section: "final-details",
    type: "paragraph",
    label: "Is there anything you definitely don't want on the website?",
    required: false,
  },
  {
    id: "competitors",
    number: 33,
    section: "final-details",
    type: "paragraph",
    label: "Are there any competitors you'd like us to look at?",
    required: false,
  },
  {
    id: "additionalNotes",
    number: 34,
    section: "final-details",
    type: "paragraph",
    label: "Is there anything else you'd like us to know?",
    required: false,
  },
  {
    id: "agreement",
    number: 35,
    section: "final-details",
    type: "agreement",
    label: "I confirm that the information I've provided is accurate to the best of my knowledge.",
    required: true,
  },
];

export function questionsForSection(section: SectionId): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

export const FILE_UPLOAD_FALLBACK_NOTE =
  "No account or sign-in needed — just choose a file below. If you'd rather not upload it here, that's fine: you can email it to us after you submit and we'll match it to your enquiry.";

export function createEmptyEnquiry(): EnquiryData {
  return {
    yourName: "",
    businessName: "",
    email: "",
    phone: "",
    businessAddress: "",
    businessDescription: "",
    businessAge: "",

    customerProfile: "",
    visitorActions: [],
    visitorActionsOther: "",

    websitePurpose: "",
    desiredPages: [],
    desiredPagesOther: "",
    hasCurrentWebsite: "",
    currentWebsiteUrl: "",
    currentWebsiteFeedback: "",

    hasLogo: "",
    logoUpload: [],
    hasBrandColours: "",
    brandColours: "",
    stylePreferences: [],
    stylePreferencesOther: "",
    designInspiration: "",

    hasPhotos: "",
    photoUpload: [],
    hasWrittenContent: "",
    businessInfoToInclude: "",
    hasTestimonials: "",
    testimonialsText: "",

    publicContactDetails: "",
    openingHours: "",
    socialLinks: "",
    contactMethods: [],
    contactMethodsOther: "",
    specificInclusions: "",

    exclusions: "",
    competitors: "",
    additionalNotes: "",
    agreement: false,
  };
}
