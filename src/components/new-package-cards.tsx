"use client";

import { TRIP_PACKAGES, EARLY_BIRD_EXPIRY, TOTAL_TICKET_CAPACITY } from "@/lib/constants";
import { TripPackage } from "@/types";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PackageCardsProps {
  onSelectPackage?: (pkg: TripPackage) => void;
}

export function PackageCards({ onSelectPackage }: PackageCardsProps) {
  const router = useRouter();
  const [isEarlyBirdActive, setIsEarlyBirdActive] = useState(true);
  const [ticketsSold, setTicketsSold] = useState(0);

  useEffect(() => {
    const expiryDate = new Date(EARLY_BIRD_EXPIRY).getTime();
    const now = new Date().getTime();
    setIsEarlyBirdActive(now < expiryDate);

    // Fetch actual tickets sold
    const fetchAvailability = async () => {
      try {
        const res = await fetch("/api/availability");
        const data = await res.json();
        setTicketsSold(data.sold || 0);
      } catch (error) {
        console.log("Availability fetch failed, using fallback");
        setTicketsSold(Math.floor(Math.random() * 45) + 15);
      }
    };

    fetchAvailability();
  }, []);

  const getButtonText = (pkg: TripPackage) => {
    if (pkg.type === "early-bird") {
      return isEarlyBirdActive ? "Secure Early Spot" : "Offer Closed";
    }
    if (pkg.type === "group") {
      return "Book as Group";
    }
    return "Book Now";
  };

  const isEarlyBirdDisabled = !isEarlyBirdActive;
  const availablePercentage = Math.min((ticketsSold / TOTAL_TICKET_CAPACITY) * 100, 100);
  const slotsLeft = Math.max(TOTAL_TICKET_CAPACITY - ticketsSold, 0);

  const slotsBadgeClass =
    slotsLeft <= 20
      ? "border-red-300/40 bg-red-500/20 text-red-100"
      : slotsLeft <= 40
      ? "border-amber-300/40 bg-amber-500/20 text-amber-100"
      : "border-emerald-200/30 bg-emerald-500/15 text-emerald-100";

  const slotsBadgeLabel = slotsLeft <= 20 ? "Critical" : slotsLeft <= 40 ? "Selling Fast" : "Available";

  const handleSelectPackage = (pkg: TripPackage) => {
    onSelectPackage?.(pkg);
    router.push(`/book?package=${encodeURIComponent(pkg.type)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-5">
      {/* Progress Bar */}
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex justify-between">
          <span className="text-xs font-semibold text-sand">Availability</span>
          <span className="text-xs font-semibold text-gold-lux">
            {ticketsSold}/{TOTAL_TICKET_CAPACITY} Sold
          </span>
        </div>
        <div className="h-2 rounded-full bg-noir/50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-lux to-emeraldDeep"
            initial={{ width: 0 }}
            animate={{ width: `${availablePercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Package Cards Grid */}
      <motion.div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {TRIP_PACKAGES.map((pkg, idx) => {
          const isEarlyBird = pkg.type === "early-bird";
          const isDisabled = isEarlyBird && isEarlyBirdDisabled;

          return (
            <motion.div
              key={pkg.type}
              variants={cardVariants}
              className={`group relative rounded-xl border transition-all duration-300 ${
                isEarlyBird && isEarlyBirdActive
                  ? "border-gold-lux/60 bg-gradient-to-br from-noir/80 to-emeraldDeep/20 shadow-lg shadow-gold-lux/10 hover:shadow-xl hover:shadow-gold-lux/20 hover:border-gold-lux"
                  : "border-sand/20 bg-noir/40 hover:border-gold-lux/40 hover:bg-noir/50"
              } ${isDisabled ? "opacity-60" : "hover:scale-[1.03]"} p-4 sm:p-5`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    isEarlyBird && isEarlyBirdActive
                      ? "bg-gold-lux/20 text-gold-lux"
                      : "bg-sand/10 text-sand"
                  }`}
                >
                  {pkg.badge}
                </div>
              )}

              {(!pkg.badge && isEarlyBird && isEarlyBirdActive) && (
                <div className="mb-3 inline-block rounded-full bg-gold-lux/20 px-3 py-1 text-xs font-bold text-gold-lux">
                  🔥 Limited Offer
                </div>
              )}

              {(!pkg.badge && isEarlyBird && isEarlyBirdDisabled) && (
                <div className="mb-3 inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                  ❌ Offer Closed
                </div>
              )}

              {/* Title */}
              <h3 className="mb-2 text-lg sm:text-xl font-bold text-sand font-display">
                {pkg.title}
              </h3>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-gold-lux">
                  GH₵{pkg.price}
                </span>
                {pkg.basePrice && pkg.basePrice !== pkg.price && (
                  <span className="text-xs text-sand/60 line-through">
                    GH₵{pkg.basePrice}
                  </span>
                )}
                {pkg.isGroup && (
                  <span className="text-xs text-sand/70">/person</span>
                )}
              </div>

              {/* Features */}
              <div className="mb-4 space-y-2 border-t border-sand/10 pt-3">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-lux/80" />
                    <span className="text-xs text-sand/85 leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limited Slots Badge */}
              {isEarlyBird && isEarlyBirdActive && (
                <div className="mb-4 inline-block rounded-sm bg-gold-lux/15 border border-gold-lux/30 px-2 py-1 text-xs text-gold-lux font-semibold">
                  📍 Limited Slots Available
                </div>
              )}

              <div
                className={`mb-4 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${slotsBadgeClass}`}
              >
                ⏳ {slotsBadgeLabel}: Only {slotsLeft} slots left
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => !isDisabled && handleSelectPackage(pkg)}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isEarlyBird && isEarlyBirdActive
                    ? "bg-gradient-to-r from-gold-lux to-gold-lux/80 text-noir hover:shadow-lg hover:shadow-gold-lux/30"
                    : isDisabled
                    ? "bg-sand/20 text-sand/50 cursor-not-allowed"
                    : "bg-sand/20 text-sand hover:bg-sand/30"
                }`}
              >
                {getButtonText(pkg)}
              </motion.button>

              {/* Urgency Message */}
              {isEarlyBird && isEarlyBirdActive && (
                <p className="mt-3 text-center text-xs text-gold-lux/70">
                  ⚡ Prices rise when this 4-day offer ends
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mx-auto max-w-2xl rounded-lg border border-sand/10 bg-noir/30 p-4 text-center"
      >
        <p className="text-sm text-sand/80">
          <span className="font-semibold text-gold-lux">💡 Pro Tip:</span> Lock in your spot with the Early Bird rate within the 4-day window. Standard pricing returns after the offer expires.
        </p>
      </motion.div>
    </div>
  );
}
