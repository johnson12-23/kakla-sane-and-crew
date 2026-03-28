import { Metadata } from "next";
import { EVENT_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About The Trip | Kakla Sane & Crew"
};

export default function AboutPage() {
  return (
    <section className="section-wrap">
      <div className="glass surface-card rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-lux)]">About The Trip</p>
        <h1 className="mt-2 page-title">A Curated Escape by {EVENT_NAME}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-sand/85">
          The Kakla Sane & Crew Trip is crafted for travelers who crave natural beauty without sacrificing comfort.
          From luxury transportation to elevated group experiences at Boti Falls, every detail is intentional.
        </p>
        <p className="mt-2 max-w-3xl text-xs text-sand/80">
          This is an exclusive trip with limited slots, designed to foster connection, premium leisure, and unforgettable
          memories with a community that values quality experiences.
        </p>
      </div>
    </section>
  );
}
