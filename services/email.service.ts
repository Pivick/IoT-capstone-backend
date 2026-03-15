import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is missing.");
}

const client = new BrevoClient({
  apiKey,
});

type EmailAttachment = {
  name: string;
  content: string;
  mimeType?: string;
  isInline?: boolean;
  inlineId?: string;
};

type SendEmailParams = {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: EmailAttachment[];
};

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
  attachments,
}: SendEmailParams) => {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is missing.");
  }

  const payload: {
    sender: {
      email: string;
      name: string;
    };
    to: { email: string }[];
    subject: string;
    htmlContent: string;
    textContent?: string;
    attachment?: Array<{
      name: string;
      content: string;
      mimeType?: string;
      isInline?: boolean;
      inlineId?: string;
    }>;
  } = {
    sender: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME || "UniVentry System",
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  if (textContent) {
    payload.textContent = textContent;
  }

  if (attachments && attachments.length > 0) {
    payload.attachment = attachments.map((file) => ({
      name: file.name,
      content: file.content,
      ...(file.mimeType ? { mimeType: file.mimeType } : {}),
      ...(file.isInline !== undefined ? { isInline: file.isInline } : {}),
      ...(file.inlineId ? { inlineId: file.inlineId } : {}),
    }));
  }

  console.log("[BREVO] Sending email...");
  console.log("[BREVO] To:", to);
  console.log("[BREVO] Subject:", subject);
  console.log("[BREVO] Attachments:", attachments?.map((a) => a.name) ?? []);

  try {
    const response = await client.transactionalEmails.sendTransacEmail(payload);

    console.log("[BREVO] Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("[BREVO] Email send failed:", error);
    throw error;
  }
};
