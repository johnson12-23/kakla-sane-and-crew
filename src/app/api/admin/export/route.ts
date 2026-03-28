import { NextResponse } from "next/server";
import Papa from "papaparse";
import { listBookings } from "@/lib/booking-store";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export async function GET() {
  if (!isAdminLoggedIn()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const bookings = await listBookings();
  const csv = Papa.unparse(
    bookings.map((booking) => ({
      ticketId: booking.ticketId,
      fullName: booking.fullName,
      email: booking.email,
      phoneNumber: booking.phoneNumber,
      packageType: booking.packageType,
      ticketCount: booking.ticketCount,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt
    }))
  );

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=bookings.csv"
    }
  });
}
