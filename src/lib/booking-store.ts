import { Booking, BookingInput, PaymentStatus } from "@/types";
import { randomTicketId } from "@/lib/utils";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { TOTAL_TICKET_CAPACITY } from "@/lib/constants";
import { readCollection, readNumericSetting, writeCollection, writeNumericSetting } from "@/lib/local-store";

const BOOKINGS_FILE = "bookings.json";
const SETTINGS_FILE = "app-settings.json";
const CAPACITY_SETTING_KEY = "total_ticket_capacity";

export class BookingCapacityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingCapacityError";
  }
}

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
  const availability = await getAvailability();

  if (payload.ticketCount > availability.available) {
    throw new BookingCapacityError(
      `Only ${availability.available} slot${availability.available === 1 ? "" : "s"} left. Please reduce ticket quantity.`
    );
  }

  // Mobile Money bookings are finalized only after client-side PIN confirmation.
  const booking = toBooking(payload, "Paid");

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from("bookings").insert(booking);

    if (!error) {
      return booking;
    }

    throw new Error(`Unable to save booking: ${error.message}`);
  }

  const localBookings = await readCollection<Booking>(BOOKINGS_FILE);
  localBookings.push(booking);
  await writeCollection(BOOKINGS_FILE, localBookings);
  return booking;
}

export async function listBookings() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      throw new Error(`Unable to load bookings: ${error.message}`);
    }

    return data as Booking[];
  }

  const localBookings = await readCollection<Booking>(BOOKINGS_FILE);
  return [...localBookings].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function updateBookingPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ paymentStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Unable to update booking: ${error.message}`);
    }

    return data as Booking;
  }

  const localBookings = await readCollection<Booking>(BOOKINGS_FILE);
  const booking = localBookings.find((item) => item.id === id);

  if (!booking) {
    return null;
  }

  booking.paymentStatus = paymentStatus;
  await writeCollection(BOOKINGS_FILE, localBookings);
  return booking;
}

export async function validateTicket(ticketId: string) {
  const bookings = await listBookings();
  return bookings.find((booking) => booking.ticketId === ticketId) || null;
}

export async function getConfiguredTotalCapacity() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", CAPACITY_SETTING_KEY)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to load app settings: ${error.message}`);
    }

    if (data?.value !== undefined && data?.value !== null) {
      const parsed = Number(data.value);

      if (Number.isFinite(parsed) && parsed >= 1) {
        return parsed;
      }
    }
  }

  return readNumericSetting(SETTINGS_FILE, CAPACITY_SETTING_KEY, TOTAL_TICKET_CAPACITY);
}

export async function setConfiguredTotalCapacity(totalCapacity: number) {
  const normalized = Math.max(1, Math.floor(Number(totalCapacity)));

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from("app_settings").upsert(
      {
        key: CAPACITY_SETTING_KEY,
        value: normalized
      },
      { onConflict: "key" }
    );

    if (error) {
      throw new Error(`Unable to update app settings: ${error.message}`);
    }

    return normalized;
  }

  return writeNumericSetting(SETTINGS_FILE, CAPACITY_SETTING_KEY, normalized);
}

export async function getAvailability() {
  const totalCapacity = await getConfiguredTotalCapacity();
  const bookings = await listBookings();
  const sold = bookings.reduce((acc, booking) => acc + Number(booking.ticketCount || 0), 0);
  return {
    totalCapacity,
    sold,
    available: Math.max(totalCapacity - sold, 0)
  };
}
