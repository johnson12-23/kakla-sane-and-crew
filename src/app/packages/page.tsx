import { Metadata } from "next";
import { EarlyBirdCountdown } from "@/components/early-bird-countdown";
import { PackageCards as PackageCardsNew } from "@/components/new-package-cards";

export const metadata: Metadata = {
  title: "Packages & Tickets | Kakla Sane & Crew"
};

export default function PackagesPage() {
  return (
    <section className="section-wrap page-fade">
      <h1 className="page-title">Packages / Tickets</h1>
      <p className="page-subtitle">
        Secure your place for an unforgettable journey to Boti Falls. Limited early bird slots available with exclusive pricing.
      </p>
      <div className="mt-4 max-w-5xl">
        <EarlyBirdCountdown />
        <PackageCardsNew />
      </div>
    </section>
  );
}
