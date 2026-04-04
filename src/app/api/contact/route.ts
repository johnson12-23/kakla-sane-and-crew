import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "@/lib/contact-store";
import { sendContactInquiryEmails } from "@/lib/email";

const contactSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10).max(2000)
  })
  .transform((payload) => payload);

function normalizeContactPayload(body: unknown) {
  const data = (body ?? {}) as Record<string, unknown>;

  return {
    fullName: typeof data.fullName === "string" ? data.fullName : typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    message: typeof data.message === "string" ? data.message : ""
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(normalizeContactPayload(body));

    const storedMessage = await createContactMessage(payload);
    const emailResult = await sendContactInquiryEmails(payload);

    return NextResponse.json({
      message: "Message sent successfully. Our team will get back to you soon.",
      storedMessage,
      emailDelivered: emailResult.delivered,
      emailReason: emailResult.reason
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      const message = firstIssue
        ? `Invalid contact form payload: ${firstIssue.path.join(".") || "form"} ${firstIssue.message}`
        : "Invalid contact form payload.";

      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to process the contact form." },
      { status: 500 }
    );
  }
}
