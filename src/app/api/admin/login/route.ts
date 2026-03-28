import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, isValidAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body?.email || "");
  const password = String(body?.password || "");

  if (!isValidAdminCredentials(email, password)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
