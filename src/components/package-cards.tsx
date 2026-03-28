import Link from "next/link";
import { TRIP_PACKAGES } from "@/lib/constants";
import { currencyGHS } from "@/lib/utils";

export function PackageCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TRIP_PACKAGES.map((pkg) => (
        <article key={pkg.type} className="glass relative overflow-hidden rounded-2xl p-4">
          <div className="mb-2 h-1 w-12 rounded-full bg-[color:var(--gold-lux)]" />
          <h3 className="font-display text-lg">{pkg.title}</h3>
          <p className="mt-1 font-display text-2xl text-[color:var(--gold-lux)]">{currencyGHS(pkg.price)}</p>
          <ul className="mt-2 space-y-1 text-xs text-sand/85">
            {pkg.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <Link href={`/book?package=${pkg.type}`} className="gold-button mt-3 inline-block text-xs">
            Select Ticket
          </Link>
        </article>
      ))}
    </div>
  );
}
