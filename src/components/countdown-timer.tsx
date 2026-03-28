"use client";

import { EVENT_DATE } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";

function getTimeParts() {
  const target = new Date(EVENT_DATE).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function CountdownTimer() {
  const [parts, setParts] = useState(() => getTimeParts());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(getTimeParts());

    const timer = setInterval(() => setParts(getTimeParts()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = useMemo(
    () => [
      { label: "Days", value: parts.days },
      { label: "Hours", value: parts.hours },
      { label: "Minutes", value: parts.minutes },
      { label: "Seconds", value: parts.seconds }
    ],
    [parts]
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 0, 0, 0].map((_, i) => (
          <div key={i} className="glass rounded-2xl px-4 py-3 text-center">
            <p className="font-display text-2xl text-[color:var(--gold-lux)]">--</p>
            <p className="text-xs uppercase tracking-wide text-sand/70">...</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {values.map((item) => (
        <div key={item.label} className="glass rounded-2xl px-4 py-3 text-center">
          <p className="font-display text-2xl text-[color:var(--gold-lux)]">{String(item.value).padStart(2, "0")}</p>
          <p className="text-xs uppercase tracking-wide text-sand/70">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
