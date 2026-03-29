import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { listContactMessages } from "@/lib/contact-store";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminLoggedIn()) {
    return unauthorized();
  }

  const messages = await listContactMessages();
  return NextResponse.json(messages);
}
