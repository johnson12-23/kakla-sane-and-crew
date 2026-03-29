# Kakla Sane & Crew Trip 2026

Luxury event ticketing website for the **Kakla Sane & Crew Trip 2026** to **Boti Falls, Ghana**.

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- Supabase-ready storage and auth hooks
- Stripe / Paystack-ready payment utilities
- Dynamic QR code ticket generation

## Features

- Premium multi-page website with luxury + nature styling
- Sticky blurred navbar with highlighted Book Now CTA
- Countdown timer to event date
- Real-time ticket availability counter
- Booking flow with package selection and payment method
- Booking success page with unique ticket ID, QR code, and ticket download
- Hidden admin dashboard with:
  - Login authentication
  - Booking and customer views
  - Payment status updates (Pending/Paid)
  - Ticket validation by ticket ID / QR payload workflow
  - CSV export
- SEO metadata, sitemap, and robots setup

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

## Supabase Table Setup

To persist Contact form submissions in the Admin panel, run this SQL in Supabase SQL Editor:

`supabase/contact_messages.sql`

This creates `public.contact_messages` with:

- UUID primary key
- created_at timestamp index
- RLS policies for insert/select app access

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- If Supabase keys are not configured, booking data is stored in in-memory fallback for demo purposes.
- If `contact_messages` table is not created yet, contact submissions also use in-memory fallback.
- Email confirmation is wired with a provider hook and runs in mock mode unless `RESEND_API_KEY` is set.
- Admin path is intentionally not exposed in navigation: `/admin/login`.
