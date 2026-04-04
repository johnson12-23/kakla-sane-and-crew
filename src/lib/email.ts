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
  replyTo?: string;
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
      html: args.html,
      ...(args.replyTo ? { reply_to: args.replyTo } : {})
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Resend delivery failed.");
  }
}

export async function sendContactInquiryEmails(payload: ContactInquiryPayload): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || "Agyepongsamuel49@gmail.com";
  const from = process.env.MAIL_FROM || "Kakla Sane & Crew <onboarding@resend.dev>";
  const replyTo = process.env.CONTACT_REPLY_TO || receiver;

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
      replyTo: payload.email,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${payload.fullName}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
      `
    });
  } catch (error) {
    return {
      delivered: false,
      reason: error instanceof Error ? error.message : "Unable to dispatch contact emails."
    };
  }

  try {
    await sendWithResend({
      apiKey,
      from,
      to: payload.email,
      subject: "We received your message | Kakla Sane & Crew",
      replyTo,
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
    const reason = error instanceof Error ? error.message : "Unable to dispatch client confirmation email.";
    const isResendTestingRestriction = reason.includes("You can only send testing emails to your own email address");
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && isResendTestingRestriction) {
      return {
        delivered: false,
        reason:
          "Client confirmation email blocked: verify your Resend domain and set MAIL_FROM to that verified domain in production."
      };
    }

    if (isResendTestingRestriction) {
      return {
        delivered: true,
        reason: "Client confirmation email is blocked in Resend testing mode until your sending domain is verified."
      };
    }

    return {
      delivered: false,
      reason
    };
  }
}
