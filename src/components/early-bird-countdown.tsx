"use client";

import { EARLY_BIRD_EXPIRY } from "@/lib/constants";
import { useEffect, useState } from "react";

interface CountdownTimes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function EarlyBirdCountdown() {
  const [countdown, setCountdown] = useState<CountdownTimes>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateCountdown = () => {
      const expiryDate = new Date(EARLY_BIRD_EXPIRY).getTime();
      const now = new Date().getTime();
      const difference = expiryDate - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  if (countdown.isExpired) {
    return (
      <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-red-400">❌ Early Bird Offer Closed</p>
        <p className="text-xs text-red-300 mt-1">Standard pricing (GH₵450) now applies</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-gold-lux/40 bg-gradient-to-r from-gold-lux/10 to-transparent px-4 py-3">
      <p className="text-center text-sm font-bold text-gold-lux mb-2">
        ⚡ 4-Day Early Bird Ends In:
      </p>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded bg-noir/50 px-2 py-2 text-center">
          <div className="text-lg font-bold text-gold-lux">{countdown.days}</div>
          <div className="text-xs text-sand">Days</div>
        </div>
        <div className="rounded bg-noir/50 px-2 py-2 text-center">
          <div className="text-lg font-bold text-gold-lux">{countdown.hours}</div>
          <div className="text-xs text-sand">Hours</div>
        </div>
        <div className="rounded bg-noir/50 px-2 py-2 text-center">
          <div className="text-lg font-bold text-gold-lux">{countdown.minutes}</div>
          <div className="text-xs text-sand">Mins</div>
        </div>
        <div className="rounded bg-noir/50 px-2 py-2 text-center">
          <div className="text-lg font-bold text-gold-lux">{countdown.seconds}</div>
          <div className="text-xs text-sand">Secs</div>
        </div>
      </div>
      <p className="text-center text-xs text-gold-lux/80 mt-2">
        💰 Prices increase to GH₵450 when the 4-day offer ends
      </p>
    </div>
  );
}
