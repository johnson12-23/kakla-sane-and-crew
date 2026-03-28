"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRIP_PACKAGES, EARLY_BIRD_EXPIRY } from "@/lib/constants";
import { PackageType } from "@/types";

const schema = z.object({
  fullName: z.string().min(3, "Please enter your full name"),
  phoneNumber: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  ticketCount: z.number().min(1).max(20),
  packageType: z.enum(["early-bird", "regular", "group"]),
  paymentMethod: z.enum(["momo", "card"]),
  mobileNetwork: z.enum(["MTN", "Telecel", "AirtelTigo"]).optional()
});

type BookingFormValues = z.infer<typeof schema>;

export function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPackage = (searchParams.get("package") || "regular") as PackageType;
  const [submitting, setSubmitting] = useState(false);
  const [isEarlyBirdActive, setIsEarlyBirdActive] = useState(true);
  const [showMomoPrompt, setShowMomoPrompt] = useState(false);
  const [pendingMomoValues, setPendingMomoValues] = useState<BookingFormValues | null>(null);
  const [momoPin, setMomoPin] = useState("");
  const [momoPinError, setMomoPinError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState("");
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      packageType: initialPackage,
      paymentMethod: "momo",
      ticketCount: 1
    }
  });

  // Check early bird status on mount
  useEffect(() => {
    const expiryDate = new Date(EARLY_BIRD_EXPIRY).getTime();
    const now = new Date().getTime();
    const isActive = now < expiryDate;
    setIsEarlyBirdActive(isActive);

    // Prevent stale query defaults from selecting an expired early-bird package.
    if (!isActive && initialPackage === "early-bird") {
      setValue("packageType", "regular");
    }
  }, [initialPackage, setValue]);

  const paymentMethod = watch("paymentMethod");
  const packageType = watch("packageType");
  const ticketCount = watch("ticketCount");

  const selectedPackage = useMemo(
    () => TRIP_PACKAGES.find((pkg) => pkg.type === packageType) || TRIP_PACKAGES[1],
    [packageType]
  );

  const estimate = selectedPackage.price * Number(ticketCount || 1);

  const finalizeBooking = async (values: BookingFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const data = await response.json();
      router.push(`/booking-success?ticketId=${encodeURIComponent(data.ticketId)}&id=${encodeURIComponent(data.id)}`);
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (values.paymentMethod === "momo") {
      setPendingMomoValues(values);
      setMomoPin("");
      setMomoPinError("");
      setPaymentNotice(`Prompt sent to ${values.phoneNumber}. Enter your 4-digit MoMo PIN to secure seat.`);
      setShowMomoPrompt(true);
      return;
    }

    await finalizeBooking(values);
  });

  const confirmMomoPayment = async (pinValue = momoPin) => {
    if (isConfirmingPin) {
      return;
    }

    if (!pendingMomoValues) {
      return;
    }

    if (!/^\d{4}$/.test(pinValue)) {
      setMomoPinError("Enter a valid 4-digit MoMo PIN.");
      return;
    }

    setIsConfirmingPin(true);
    setMomoPinError("");
    setPaymentNotice("Seat booked successfully. Confirming payment and issuing ticket...");
    setShowMomoPrompt(false);
    await finalizeBooking(pendingMomoValues);
    setIsConfirmingPin(false);
  };

  useEffect(() => {
    if (!showMomoPrompt) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      pinInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [showMomoPrompt]);

  const availablePackages = TRIP_PACKAGES.filter((pkg) => {
    if (pkg.type === "early-bird") {
      return isEarlyBirdActive;
    }
    return true;
  });

  return (
    <form onSubmit={onSubmit} className="glass surface-card rounded-2xl p-4 md:rounded-3xl md:p-6">
      <h2 className="font-display text-2xl">Complete Your Booking</h2>
      <p className="mt-1 text-xs text-sand/75">Secure your seat in a few quick steps.</p>

      <div className="mt-3 grid gap-2.5 md:mt-4 md:gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs">
          Full Name
          <input className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("fullName")} />
          {errors.fullName && <span className="text-xs text-red-300">{errors.fullName.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          Phone Number
          <input className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("phoneNumber")} />
          {errors.phoneNumber && <span className="text-xs text-red-300">{errors.phoneNumber.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          Email
          <input type="email" className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("email")} />
          {errors.email && <span className="text-xs text-red-300">{errors.email.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          Number of Tickets
          <input type="number" min={1} max={20} className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("ticketCount", { valueAsNumber: true })} />
          {errors.ticketCount && <span className="text-xs text-red-300">{errors.ticketCount.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          Package Selection
          <select className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("packageType")}>
            {availablePackages.map((pkg) => (
              <option key={pkg.type} value={pkg.type}>
                {pkg.title} (GH₵{pkg.price}/person)
              </option>
            ))}
          </select>
          {errors.packageType && <span className="text-xs text-red-300">{errors.packageType.message}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          Payment Option
          <select className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("paymentMethod")}>
            <option value="momo">Mobile Money (MTN, Telecel, AirtelTigo)</option>
            <option value="card">Card Payment (Stripe-ready)</option>
          </select>
        </label>
      </div>

      {paymentMethod === "momo" && (
        <label className="mt-2.5 flex flex-col gap-1.5 text-xs md:mt-3">
          Mobile Money Network
          <select className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm" {...register("mobileNetwork")}>
            <option value="MTN">MTN</option>
            <option value="Telecel">Telecel</option>
            <option value="AirtelTigo">AirtelTigo</option>
          </select>
        </label>
      )}

      <div className="mt-3 rounded-xl border border-white/15 bg-black/35 p-3 text-xs md:mt-4">
        <p className="text-sand/70">Estimated total</p>
        <p className="font-display text-2xl text-[color:var(--gold-lux)]">GH₵ {estimate.toLocaleString()}</p>
        {selectedPackage.type === "early-bird" && isEarlyBirdActive && (
          <p className="mt-1 text-xs text-gold-lux/80">🔥 Early bird rate locked in!</p>
        )}
        <p className="mt-1 text-xs text-sand/60">Stripe and Paystack hooks are ready for secure card checkout integration.</p>
        {paymentNotice && <p className="mt-2 text-xs text-emerald-100">{paymentNotice}</p>}
      </div>

      <button type="submit" className="gold-button mt-3 w-full md:mt-4 md:w-auto" disabled={submitting}>
        {submitting ? "Processing..." : "Complete Payment"}
      </button>

      {showMomoPrompt && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="glass surface-card w-full max-w-md rounded-2xl p-4 md:p-5">
            <h3 className="font-display text-2xl text-sand">MoMo Payment Confirmation</h3>
            <p className="mt-1 text-xs text-sand/80">
              Prompt sent to {pendingMomoValues?.phoneNumber}. Enter your 4-digit MoMo PIN to secure seat.
            </p>

            <label className="mt-3 flex flex-col gap-1 text-xs text-sand/90">
              4-digit MoMo PIN
              <input
                ref={pinInputRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={4}
                value={momoPin}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 4);
                  setMomoPinError("");
                  setMomoPin(digitsOnly);

                  if (digitsOnly.length === 4) {
                    void confirmMomoPayment(digitsOnly);
                  }
                }}
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-center text-lg tracking-[0.45em] text-sand"
                placeholder="••••"
              />
            </label>

            <div className="mt-2 flex items-center justify-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index < momoPin.length ? "bg-gold-lux" : "bg-sand/30"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-center text-[11px] text-sand/70">Auto-confirms once the 4th digit is entered.</p>

            {momoPinError && <p className="mt-2 text-xs text-red-300">{momoPinError}</p>}

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-sand/85 hover:bg-white/10"
                onClick={() => {
                  setShowMomoPrompt(false);
                  setPaymentNotice("MoMo payment was canceled. Please complete PIN confirmation to secure seat.");
                }}
              >
                Cancel
              </button>
              <button type="button" className="gold-button w-full sm:w-auto" onClick={() => void confirmMomoPayment()}>
                {isConfirmingPin ? "Confirming..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
