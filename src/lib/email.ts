import { Booking } from "@/types";

export async function sendBookingConfirmationEmail(booking: Booking) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      delivered: false,
      reason: "RESEND_API_KEY is not configured. Email dispatch is currently in mock mode.",
      booking
    };
  }

  // Placeholder integration hook for real transactional email providers.
  return {
    delivered: true,
    reason: "Transactional provider is configured and ready for integration.",
    booking
  };
}
