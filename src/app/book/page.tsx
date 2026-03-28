import { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Book Now | Kakla Sane & Crew"
};

export default function BookPage() {
  return (
    <section className="section-wrap page-fade">
      <div className="page-intro">
        <h1 className="page-title">Book Your Spot</h1>
        <p className="page-subtitle">Choose your package, complete payment, and receive your ticket instantly.</p>
      </div>
      <Suspense fallback={<div className="loading-shimmer h-64 rounded-3xl bg-white/10" />}>
        <BookingForm />
      </Suspense>
    </section>
  );
}
