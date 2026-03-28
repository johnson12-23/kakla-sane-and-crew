import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaklasanecrewtrip.com"),
  title: "Kakla Sane & Crew Trip 2026 | Exclusive Boti Falls Experience",
  description:
    "Luxury event ticketing for Kakla Sane & Crew Trip 2026 to Boti Falls, Ghana. Reserve your premium experience now.",
  keywords: ["Boti Falls", "Ghana trip", "luxury travel", "event ticketing", "Kakla Sane & Crew"],
  openGraph: {
    title: "Kakla Sane & Crew Trip 2026",
    description: "Escape to Nature: Luxury. Adventure. Memories.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="luxury-shell bg-noir text-sand antialiased">
        <Navbar />
        <main className="relative z-10 page-fade">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
