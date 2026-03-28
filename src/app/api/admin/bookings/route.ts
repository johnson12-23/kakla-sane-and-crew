import { NextRequest, NextResponse } from "next/server";
import { listBookings, updateBookingPaymentStatus, validateTicket } from "@/lib/booking-store";
import { isAdminLoggedIn } from "@/lib/admin-auth";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isAdminLoggedIn()) {
    return unauthorized();
  }

  const ticketId = request.nextUrl.searchParams.get("ticketId");

  if (ticketId) {
    const ticket = await validateTicket(ticketId);

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  }

  const bookings = await listBookings();
  return NextResponse.json(bookings);
}

export async function PATCH(request: NextRequest) {
  if (!isAdminLoggedIn()) {
    return unauthorized();
  }

  const body = await request.json();
  const id = String(body?.id || "");
  const paymentStatus = body?.paymentStatus;

  if (!id || (paymentStatus !== "Pending" && paymentStatus !== "Paid")) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const updated = await updateBookingPaymentStatus(id, paymentStatus);

  if (!updated) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
