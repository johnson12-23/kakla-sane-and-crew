import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BookingCapacityError, createBooking, listBookings } from "@/lib/booking-store";
import { generateQRCodeDataUrl } from "@/lib/ticket";
import { sendBookingConfirmationEmail } from "@/lib/email";

const bookingSchema = z.object({
  fullName: z.string().min(3),
  phoneNumber: z.string().min(8),
  email: z.string().email(),
  ticketCount: z.number().min(1).max(20),
  packageType: z.enum(["early-bird", "regular", "group"]),
  paymentMethod: z.enum(["momo", "card"]),
  mobileNetwork: z.enum(["MTN", "Telecel", "AirtelTigo"]).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = bookingSchema.parse(body);
    const booking = await createBooking(payload);
    await sendBookingConfirmationEmail(booking);

    return NextResponse.json({ id: booking.id, ticketId: booking.ticketId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid booking payload" }, { status: 400 });
    }

    if (error instanceof BookingCapacityError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to create booking right now." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const bookings = await listBookings();

  if (!id) {
    return NextResponse.json(bookings);
  }

  const booking = bookings.find((item) => item.id === id);

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  const qrCode = await generateQRCodeDataUrl(booking.qrPayload);
  return NextResponse.json({ ...booking, qrCode });
}