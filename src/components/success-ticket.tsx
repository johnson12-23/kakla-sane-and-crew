"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SuccessTicketProps {
  bookingId: string;
  ticketId: string;
}

interface BookingDetails {
  id: string;
  ticketId: string;
  fullName: string;
  email: string;
  packageType: string;
  ticketCount: number;
  paymentStatus: string;
  qrCode: string;
}

function isBookingDetails(value: unknown): value is BookingDetails {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BookingDetails>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.ticketId === "string" &&
    typeof candidate.fullName === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.packageType === "string" &&
    typeof candidate.ticketCount === "number" &&
    typeof candidate.paymentStatus === "string" &&
    typeof candidate.qrCode === "string"
  );
}

export function SuccessTicket({ bookingId, ticketId }: SuccessTicketProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [mounted, setMounted] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState("");

  const statusText = booking?.paymentStatus === "Paid" ? "Seat booked successfully" : "Payment pending";

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    fetch(`/api/bookings?id=${encodeURIComponent(bookingId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && isBookingDetails(data)) {
          setBooking(data);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const downloadTicket = async () => {
    if (!booking) {
      return;
    }

    const packageLabel = (booking.packageType || "Unknown").toUpperCase();
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${booking.ticketId}</title></head><body style="font-family:Segoe UI,Arial,sans-serif;background:#f3e9d2;padding:24px;"><div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;padding:24px;border:1px solid #ddd;"><h1 style="margin:0;color:#0f3d2e;">Kakla Sane & Crew Trip 2026</h1><p><strong>Ticket ID:</strong> ${booking.ticketId}</p><p><strong>Name:</strong> ${booking.fullName}</p><p><strong>Package:</strong> ${packageLabel}</p><p><strong>Tickets:</strong> ${booking.ticketCount}</p><p><strong>Status:</strong> ${statusText}</p><p>Present this ticket at check-in.</p><img alt="QR" src="${booking.qrCode}" style="width:160px;height:160px;" /></div></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const fileName = `${booking.ticketId}.html`;
    const file = new File([blob], fileName, { type: "text/html;charset=utf-8" });

    try {
      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `${booking.ticketId} Ticket`,
          text: "Your Kakla Sane & Crew Trip ticket"
        });
        setDownloadNotice("Ticket shared successfully.");
        return;
      }
    } catch {
      setDownloadNotice("Share canceled. You can use the download fallback below.");
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Mobile fallback when file download is blocked by browser policies.
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) {
      setDownloadNotice("Download started. If your phone blocks downloads, open this ticket and use Share or Save.");
    } else {
      setDownloadNotice("Ticket ready. On mobile, use Share or Save from the opened page if download does not start.");
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  if (!mounted) {
    return <div className="loading-shimmer mt-6 h-64 rounded-xl bg-white/10" />;
  }

  return (
    <section className="glass rounded-2xl p-4 md:p-6">
      <h2 className="font-display text-2xl">Booking Confirmed</h2>
      <p className="mt-1 text-xs text-sand/70">Your unique Ticket ID is ready.</p>
      <p className="mt-2 font-display text-3xl text-[color:var(--gold-lux)]">{ticketId}</p>

      {booking ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="space-y-1 text-xs text-sand/85">
            <p>Guest: {booking.fullName}</p>
            <p>Email: {booking.email}</p>
            <p>Package: {(booking.packageType || "Unknown").toUpperCase()}</p>
            <p>Tickets: {booking.ticketCount}</p>
            <p>Status: {statusText}</p>
          </div>
          <Image
            src={booking.qrCode}
            alt="Entry QR code"
            width={140}
            height={140}
            className="h-36 w-36 rounded-lg border border-white/20 bg-white p-1.5"
          />
        </div>
      ) : (
        <div className="loading-shimmer mt-4 h-20 rounded-lg bg-white/10" />
      )}

      <button onClick={downloadTicket} className="gold-button mt-3">
        Download Ticket
      </button>
      {downloadNotice && <p className="mt-2 text-xs text-sand/80">{downloadNotice}</p>}
    </section>
  );
}
