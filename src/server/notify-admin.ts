import { Resend } from "resend";

export interface NewEnquiryNotification {
  reference: string;
  businessName: string;
  contactName: string;
  email: string;
  enquiryId: string;
}

/**
 * Best-effort "new enquiry" alert to NexalField. Never throws: if the
 * email provider isn't configured, or the send fails, this logs and
 * returns — the enquiry has already been safely stored either way, and
 * a missing notification must never fail the customer's submission.
 */
export async function notifyAdminOfNewEnquiry(details: NewEnquiryNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !notificationEmail) {
    console.warn(
      "[notify-admin] Skipping enquiry notification email — RESEND_API_KEY or NOTIFICATION_EMAIL is not set.",
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const from = process.env.EMAIL_FROM || "NexalField <onboarding@resend.dev>";
  const adminUrl = `${siteUrl}/admin/enquiries/${details.enquiryId}`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: notificationEmail,
      subject: `New NexalField enquiry — ${details.businessName}`,
      text: [
        "New NexalField website project enquiry received.",
        "",
        `Business: ${details.businessName}`,
        `Contact: ${details.contactName}`,
        `Email: ${details.email}`,
        `Reference: ${details.reference}`,
        "",
        `Open in admin: ${adminUrl}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[notify-admin] Failed to send enquiry notification email:", error);
  }
}
