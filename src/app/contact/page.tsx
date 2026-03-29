import { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

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

        <ContactForm />
      </div>
    </section>
  );
}
