"use client";

import { useEffect, useState } from "react";

interface Availability {
  totalCapacity: number;
  sold: number;
  available: number;
}

export function AvailabilityCounter() {
  const [state, setState] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/availability", { cache: "no-store" });
        const data = (await response.json()) as Availability;
        if (mounted) {
          setState(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    const ticker = setInterval(load, 12000);
    return () => {
      mounted = false;
      clearInterval(ticker);
    };
  }, []);

  if (!mounted || loading) {
    return <div className="glass inline-flex rounded-full px-4 py-2 text-sm text-sand/80">Loading availability...</div>;
  }

  if (!state) {
    return <p className="text-sm text-sand/70">Availability unavailable</p>;
  }

  return (
    <div className="glass inline-flex rounded-full px-4 py-2 text-sm">
      <span className="text-sand/80">Only </span>
      <span className="mx-1 font-semibold text-[color:var(--gold-lux)]">{state.available}</span>
      <span className="text-sand/80"> slots left out of {state.totalCapacity}</span>
    </div>
  );
}
