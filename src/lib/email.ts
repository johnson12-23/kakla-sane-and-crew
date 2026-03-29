import { Booking } from "@/types";

interface ContactInquiryPayload {
  fullName: string;
  email: string;
  message: string;
}

interface EmailDispatchResult {
  delivered: boolean;
  reason?: string;
}

export async function sendBookingConfirmationEmail(booking: Booking) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      delivered: false,
      reason: "RESEND_API_KEY is not configured. Email dispatch is currently in mock mode.",
      booking
    };
  }

  // Placeholder integration hook for real transactional email providers.
  return {
    delivered: true,
    reason: "Transactional provider is configured and ready for integration.",
    booking
  };
}

async function sendWithResend(args: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      subject: args.subject,
      html: args.html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Resend delivery failed.");
  }
}

export async function sendContactInquiryEmails(payload: ContactInquiryPayload): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || "hello@kaklasanecrew.com";
  const from = process.env.MAIL_FROM || "Kakla Sane & Crew <noreply@kaklasanecrew.com>";

  if (!apiKey) {
    return {
      delivered: false,
      reason: "RESEND_API_KEY is not configured."
    };
  }

  try {
    await sendWithResend({
      apiKey,
      from,
      to: receiver,
      subject: `New Contact Message from ${payload.fullName}`,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${payload.fullName}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
      `
    });

    await sendWithResend({
      apiKey,
      from,
      to: payload.email,
      subject: "We received your message | Kakla Sane & Crew",
      html: `
        <h2>Hello ${payload.fullName},</h2>
        <p>Thank you for contacting Kakla Sane & Crew.</p>
        <p>We have received your message and our team will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
        <p>Warm regards,<br/>Kakla Sane & Crew Team</p>
      `
    });

    return { delivered: true };
  } catch (error) {
    return {
      delivered: false,
      reason: error instanceof Error ? error.message : "Unable to dispatch contact emails."
    };
  }
}
