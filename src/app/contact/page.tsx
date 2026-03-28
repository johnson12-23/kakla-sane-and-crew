import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Kakla Sane & Crew"
};

export default function ContactPage() {
  return (
    <section className="section-wrap page-fade">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass surface-card rounded-2xl p-4 md:p-5">
          <h1 className="page-title">Contact</h1>
          <p className="mt-2 text-xs text-sand/80">Have questions before booking? Reach out directly.</p>
          <div className="mt-3 space-y-1 text-xs text-sand/85">
            <p>Phone: +233 20 000 0000</p>
            <p>Email: hello@kaklasanecrew.com</p>
            <p>Location: Accra, Ghana</p>
          </div>
          <a
            href="https://wa.me/233200000000"
            target="_blank"
            rel="noreferrer"
            className="gold-button mt-3 inline-block"
          >
            Chat on WhatsApp
          </a>
        </div>

        <form className="glass surface-card rounded-2xl p-4 md:p-5">
          <h2 className="font-display text-xl">Send Us a Message</h2>
          <div className="mt-3 space-y-2">
            <input placeholder="Full Name" className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
            <input placeholder="Email" className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
            <textarea
              placeholder="Tell us what you need"
              rows={3}
              className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
            />
            <button type="button" className="gold-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
