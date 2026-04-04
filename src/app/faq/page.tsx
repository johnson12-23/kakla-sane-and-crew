import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Kakla Sane & Crew"
};

const faqs = [
  {
    question: "What date is the Kakla Sane & Crew Trip 2026?",
    answer:
      "The trip takes place on 27 June 2026. The team shares final meetup timing and departure checkpoints with all confirmed guests before travel day."
  },
  {
    question: "What is included in my booking fee?",
    answer:
      "Your booking includes round-trip transportation, destination experience access, coordinated crew activities, and guided support during the day."
  },
  {
    question: "Where is the destination and where do we depart from?",
    answer:
      "The destination is Boti Falls, and the main departure point is Accra. Confirmed travelers receive exact pickup and timing details in the official trip update message."
  },
  {
    question: "Do I need to pay extra for the tour guide?",
    answer:
      "No separate payment is needed at the venue for standard trip access. The applicable guide fee is already accounted for in package pricing."
  },
  {
    question: "What should I bring for the trip?",
    answer:
      "Bring a valid ID, comfortable walking shoes, light clothing, water, sunscreen, and a small bag for essentials. A phone power bank is also recommended for photos and videos."
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer:
      "Ticket transfers may be allowed before a cutoff window if you notify the organizers early. Contact support with both names so records can be updated correctly."
  },
  {
    question: "Is the trip family-friendly and safe for first-time travelers?",
    answer:
      "Yes. The trip is coordinated with group leaders and clear activity planning, making it suitable for first-time guests who want a guided and social experience."
  },
  {
    question: "How do I get support if I have questions after booking?",
    answer:
      "Use the Contact page to send a message anytime. The admin team responds with booking help, trip clarifications, and pre-departure guidance."
  }
];

export default function FaqPage() {
  return (
    <section className="section-wrap page-fade">
      <header className="page-intro">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle max-w-3xl">
          Everything you need to know before the Kakla Sane & Crew Trip 2026. If your question is not listed, use
          the contact page and the team will help you directly.
        </p>
      </header>

      <div className="mt-5 grid gap-3 md:gap-4">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="surface-card group rounded-2xl p-4 transition duration-300 open:border open:border-sand/35"
          >
            <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-sand marker:content-none">
              {item.question}
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-sand/85">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
