import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactInquiryEmails } from "@/lib/email";

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    const result = await sendContactInquiryEmails(payload);

    if (!result.delivered) {
      return NextResponse.json(
        {
          message:
            result.reason ||
            "Email service is not configured yet. Please set RESEND_API_KEY and CONTACT_RECEIVER_EMAIL."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "Message sent successfully. A confirmation email has been sent to your inbox."
    });
  } catch {
    return NextResponse.json({ message: "Invalid contact form payload." }, { status: 400 });
  }
}
