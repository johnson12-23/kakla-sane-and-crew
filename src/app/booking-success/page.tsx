import { Metadata } from "next";
import { SuccessTicket } from "@/components/success-ticket";

export const metadata: Metadata = {
  title: "Booking Confirmed | Kakla Sane & Crew"
};

export default function BookingSuccessPage({
  searchParams
}: {
  searchParams: {
    id?: string;
    ticketId?: string;
  };
}) {
  const id = searchParams.id || "";
  const ticketId = searchParams.ticketId || "Unavailable";

  return (
    <section className="section-wrap page-fade">
      <h1 className="page-title">Booking Confirmed!</h1>
      <p className="page-subtitle">Your premium trip ticket is now secured.</p>
      <div className="mt-4">
        <SuccessTicket bookingId={id} ticketId={ticketId} />
      </div>
    </section>
  );
}
