import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking-store";
import { TOTAL_TICKET_CAPACITY } from "@/lib/constants";

export async function GET() {
  const availability = await getAvailability(TOTAL_TICKET_CAPACITY);
  return NextResponse.json(availability);
}
