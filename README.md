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

For SMTP backend connection from the website contact form:

- `NEXT_PUBLIC_CONTACT_ENDPOINT=http://localhost:5000/send-message`

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

## SMTP Email Backend (Node + Express + Nodemailer)

Backend lives in:

`server/`

Structure:

- `server/index.js`
- `server/routes/messageRoutes.js`
- `server/controllers/messageController.js`
- `server/.env`

Run backend:

```bash
cd server
npm install
npm run dev
```

Backend route:

- `POST /send-message`

Required payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello from contact form"
}
```

Example frontend `fetch` usage (no page reload, async):

```ts
const response = await fetch(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "http://localhost:5000/send-message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message })
});
```

SMTP uses Gmail App Password:

- Host: `smtp.gmail.com`
- Port: `465`
- Secure: `true`
- Env vars: `EMAIL_USER`, `EMAIL_PASS`

## Notes

- If Supabase keys are not configured, booking data is stored in in-memory fallback for demo purposes.
- If `contact_messages` table is not created yet, contact submissions also use in-memory fallback.
- Email confirmation is wired with a provider hook and runs in mock mode unless `RESEND_API_KEY` is set.
- Admin path is intentionally not exposed in navigation: `/admin/login`.
