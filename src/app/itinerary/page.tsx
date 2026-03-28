import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Itinerary | Kakla Sane & Crew"
};

const timeline = [
  {
    title: "Departure from Accra",
    detail: "Morning check-in, welcome briefing, and luxury coach departure."
  },
  {
    title: "Arrival at Boti Falls",
    detail: "Refreshments, orientation, and guided welcome session."
  },
  {
    title: "Activities",
    detail: "Hiking, photography sessions, curated games, and social experiences."
  },
  {
    title: "Return Trip",
    detail: "Sunset wrap-up, networking moments, and return to Accra."
  }
];

export default function ItineraryPage() {
  return (
    <section className="section-wrap page-fade">
      <h1 className="page-title">Trip Itinerary</h1>
      <div className="mt-4 space-y-3">
        {timeline.map((item, index) => (
          <article key={item.title} className="glass surface-card grid gap-3 rounded-2xl p-4 md:grid-cols-[80px_1fr] md:items-start">
            <p className="font-display text-2xl text-[color:var(--gold-lux)]">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h2 className="font-display text-xl">{item.title}</h2>
              <p className="mt-1 text-xs text-sand/80">{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
