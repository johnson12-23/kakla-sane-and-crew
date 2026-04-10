import { TripPackage } from "@/types";

export const EVENT_NAME = "Kakla Sane & Crew Trip 2026";
export const EVENT_DATE = "2026-06-27T06:00:00+00:00";
export const EVENT_LOCATION = "Boti Falls, Ghana";
export const TOTAL_TICKET_CAPACITY = 120;

export const EARLY_BIRD_EXPIRY = "2026-04-01T23:59:59+00:00";
export const BASE_TRIP_COST = 400;
export const TOUR_GUIDE_FEE = 50;
export const STANDARD_PRICE = BASE_TRIP_COST + TOUR_GUIDE_FEE; // 450

export const TRIP_PACKAGES: TripPackage[] = [
  {
    type: "early-bird",
    title: "Early Bird Package",
    basePrice: 350,
    price: 350,
    isLimited: true,
    features: [
      "Full access to Kakla Sane & Crew Trip experience",
      "Round-trip transportation from Accra to Boti Falls",
      "Tour guide fee fully covered",
      "Access to all group activities and games",
      "Networking and social experience with crew",
      "Early confirmation + priority reservation",
      "Limited slots (first come, first served)"
    ],
    badge: "🔥 Limited Offer"
  },
  {
    type: "regular",
    title: "Standard Package",
    basePrice: STANDARD_PRICE,
    price: STANDARD_PRICE,
    features: [
      "Round-trip transportation from Accra",
      "Professional tour guide included (GH₵50 fee covered)",
      "Entry access to Boti Falls experience",
      "Participation in all activities (hiking, games, exploration)",
      "Refreshments and group coordination",
      "Access to group photography moments"
    ]
  },
  {
    type: "group",
    title: "Group Package",
    basePrice: 420,
    price: 420,
    isGroup: true,
    features: [
      "Discounted rate for groups (minimum 4 people)",
      "Round-trip transportation included",
      "Tour guide fee included",
      "Dedicated group coordination assistance",
      "Group seating arrangement",
      "Access to all activities and shared experiences",
      "Ideal for friends and social crews"
    ],
    badge: "👥 Best for Groups"
  }
];
export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About The Trip", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Itinerary", href: "/itinerary" },
  { name: "Tour Package", href: "/tour-packages" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" }
];
