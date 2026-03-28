import { Booking, BookingInput, PaymentStatus } from "@/types";
import { randomTicketId } from "@/lib/utils";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

const inMemoryBookings: Booking[] = [];

function toBooking(payload: BookingInput, paymentStatus: PaymentStatus = "Pending"): Booking {
  const ticketId = randomTicketId();
  const createdAt = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ticketId,
    createdAt,
    paymentStatus,
    qrPayload: `${ticketId}|${payload.fullName}|${payload.packageType}|${createdAt}`,
    ...payload
  };
}

export async function createBooking(payload: BookingInput) {
  // Mobile Money bookings are finalized only after client-side PIN confirmation.
  const booking = toBooking(payload, "Paid");

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from("bookings").insert(booking);

    if (!error) {
      return booking;
    }
  }

  inMemoryBookings.push(booking);
  return booking;
}

export async function listBookings() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("createdAt", { ascending: false });

    if (!error && data) {
      return data as Booking[];
    }
  }

  return [...inMemoryBookings].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function updateBookingPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ paymentStatus })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return data as Booking;
    }
  }

  const booking = inMemoryBookings.find((item) => item.id === id);

  if (!booking) {
    return null;
  }

  booking.paymentStatus = paymentStatus;
  return booking;
}

export async function validateTicket(ticketId: string) {
  const bookings = await listBookings();
  return bookings.find((booking) => booking.ticketId === ticketId) || null;
}

export async function getAvailability(totalCapacity: number) {
  const bookings = await listBookings();
  const sold = bookings.reduce((acc, booking) => acc + Number(booking.ticketCount || 0), 0);
  return {
    totalCapacity,
    sold,
    available: Math.max(totalCapacity - sold, 0)
  };
}
