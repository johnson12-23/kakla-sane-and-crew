"use client";

import { useEffect, useMemo, useState } from "react";

interface BookingRow {
  id: string;
  ticketId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  packageType: string;
  ticketCount: number;
  paymentStatus: "Pending" | "Paid";
  createdAt: string;
}

interface ContactMessageRow {
  id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState("");

  const customers = useMemo(() => bookings.length, [bookings]);

  async function loadBookings() {
    const [bookingsRes, contactRes] = await Promise.all([
      fetch("/api/admin/bookings", { cache: "no-store" }),
      fetch("/api/admin/contact-messages", { cache: "no-store" })
    ]);

    if (bookingsRes.ok) {
      const bookingsData = (await bookingsRes.json()) as BookingRow[];
      setBookings(bookingsData);
    }

    if (contactRes.ok) {
      const contactData = (await contactRes.json()) as ContactMessageRow[];
      setContactMessages(contactData);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBookings().catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, paymentStatus: "Pending" | "Paid") {
    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentStatus })
    });

    if (response.ok) {
      await loadBookings();
    }
  }

  async function validateTicket() {
    if (!scanInput.trim()) {
      setScanResult("Enter a ticket ID first");
      return;
    }

    const response = await fetch(`/api/admin/bookings?ticketId=${encodeURIComponent(scanInput)}`);
    if (!response.ok) {
      setScanResult("Invalid ticket");
      return;
    }

    const ticket = await response.json();
    setScanResult(`Valid: ${ticket.fullName} (${ticket.packageType.toUpperCase()})`);
  }

  function exportCsv() {
    window.location.href = "/api/admin/export";
  }

  return (
    <section className="space-y-3 md:space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        <div className="glass surface-card rounded-lg p-2.5 md:p-3">
          <p className="text-xs text-sand/70">Total Bookings</p>
          <p className="font-display text-xl text-[color:var(--gold-lux)] md:text-2xl">{bookings.length}</p>
        </div>
        <div className="glass surface-card rounded-lg p-2.5 md:p-3">
          <p className="text-xs text-sand/70">Customers</p>
          <p className="font-display text-xl text-[color:var(--gold-lux)] md:text-2xl">{customers}</p>
        </div>
        <div className="glass surface-card rounded-lg p-2.5 md:p-3">
          <p className="text-xs text-sand/70">Paid Bookings</p>
          <p className="font-display text-xl text-[color:var(--gold-lux)] md:text-2xl">
            {bookings.filter((item) => item.paymentStatus === "Paid").length}
          </p>
        </div>
      </div>

      <div className="glass surface-card rounded-lg p-2.5 md:p-3">
        <h2 className="font-display text-lg">Scan / Validate QR Ticket</h2>
        <div className="mt-2 flex flex-col gap-2 md:flex-row">
          <input
            value={scanInput}
            onChange={(event) => setScanInput(event.target.value)}
            placeholder="Enter scanned Ticket ID"
            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm"
          />
          <button onClick={validateTicket} className="gold-button w-full text-xs md:w-auto">
            Validate
          </button>
        </div>
        {scanResult && <p className="mt-2 text-xs text-sand/85">{scanResult}</p>}
      </div>

      <div className="flex justify-stretch md:justify-end">
        <button onClick={exportCsv} className="gold-button w-full text-xs md:w-auto">
          Export Bookings (CSV)
        </button>
      </div>

      <div className="glass surface-card rounded-lg p-2.5 md:p-3">
        <h2 className="font-display text-lg">All Bookings</h2>
        {loading ? (
          <div className="loading-shimmer mt-3 h-20 rounded-lg bg-white/10" />
        ) : (
          <>
            <div className="mt-3 space-y-2 md:hidden">
              {bookings.map((booking) => (
                <article key={booking.id} className="rounded-lg border border-white/15 bg-black/25 p-2.5 text-xs">
                  <p className="text-sand/65">{booking.ticketId}</p>
                  <p className="mt-0.5 font-semibold text-sand">{booking.fullName}</p>
                  <div className="mt-1 flex items-center justify-between gap-2 text-sand/80">
                    <span>{booking.packageType.toUpperCase()}</span>
                    <span>Qty: {booking.ticketCount}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-sand/80">
                      {booking.paymentStatus}
                    </span>
                    <button
                      className="rounded border border-white/20 px-2 py-1 text-[11px] hover:bg-white/10"
                      onClick={() => updateStatus(booking.id, booking.paymentStatus === "Paid" ? "Pending" : "Paid")}
                    >
                      Toggle
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="mt-3 min-w-full text-left text-xs">
                <thead className="text-sand/70">
                  <tr>
                    <th className="p-1">Ticket ID</th>
                    <th className="p-1">Name</th>
                    <th className="p-1">Package</th>
                    <th className="p-1">Qty</th>
                    <th className="p-1">Payment</th>
                    <th className="p-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-white/10">
                      <td className="p-1">{booking.ticketId}</td>
                      <td className="p-1">{booking.fullName}</td>
                      <td className="p-1">{booking.packageType.toUpperCase()}</td>
                      <td className="p-1">{booking.ticketCount}</td>
                      <td className="p-1">{booking.paymentStatus}</td>
                      <td className="p-1">
                        <button
                          className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                          onClick={() => updateStatus(booking.id, booking.paymentStatus === "Paid" ? "Pending" : "Paid")}
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="glass surface-card rounded-lg p-2.5 md:p-3">
        <h2 className="font-display text-lg">Contact Messages</h2>
        {loading ? (
          <div className="loading-shimmer mt-3 h-20 rounded-lg bg-white/10" />
        ) : contactMessages.length === 0 ? (
          <p className="mt-3 text-xs text-sand/70">No contact messages yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {contactMessages.map((message) => (
              <article key={message.id} className="rounded-lg border border-white/15 bg-black/25 p-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-sand">{message.fullName}</p>
                  <p className="text-sand/60">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sand/80">{message.email}</p>
                <p className="mt-2 whitespace-pre-wrap text-sand/85">{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
