import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking-store";

export async function GET() {
  const availability = await getAvailability();
  return NextResponse.json(availability);
}
