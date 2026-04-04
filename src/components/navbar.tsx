"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    NAV_ITEMS.forEach((item) => {
      router.prefetch(item.href);
    });
    router.prefetch("/book");
  }, [isAdminRoute, router]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-lg">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" prefetch className="font-display text-base tracking-wide text-sand">
          KSC 2026
        </Link>

        <button
          className="inline-flex rounded-lg border border-white/20 p-1.5 text-sand md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        <div className="hidden items-center gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "text-xs text-sand/85 transition hover:text-[color:var(--gold-lux)]",
                pathname === item.href && "text-[color:var(--gold-lux)]"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/book" prefetch className="gold-button text-xs">
            Book Now
          </Link>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-black/50 px-4 py-2 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-2 py-1.5 text-xs text-sand/85 transition hover:bg-white/5",
                  pathname === item.href && "bg-white/10 text-[color:var(--gold-lux)]"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/book" prefetch onClick={() => setOpen(false)} className="gold-button w-fit text-xs">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
