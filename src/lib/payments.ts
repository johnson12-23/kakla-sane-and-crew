import { loadStripe } from "@stripe/stripe-js";

export function getStripePromise() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return null;
  }
  return loadStripe(publishableKey);
}

export function paystackConfig() {
  return {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    enabled: Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY)
  };
}
