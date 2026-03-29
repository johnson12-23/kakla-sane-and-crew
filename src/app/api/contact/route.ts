import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "@/lib/contact-store";

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    await createContactMessage(payload);

    return NextResponse.json({
      message: "Message sent successfully. You can view it in the admin panel."
    });
  } catch {
    return NextResponse.json({ message: "Invalid contact form payload." }, { status: 400 });
  }
}
