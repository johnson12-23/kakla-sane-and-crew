export type PackageType = "early-bird" | "regular" | "group";
export type PaymentMethod = "momo" | "card";
export type PaymentStatus = "Pending" | "Paid";

export interface TripPackage {
  type: PackageType;
  title: string;
  price: number;
  basePrice?: number;
  isLimited?: boolean;
  isGroup?: boolean;
  badge?: string;
  features: string[];
}

export interface BookingInput {
  fullName: string;
  phoneNumber: string;
  email: string;
  ticketCount: number;
  packageType: PackageType;
  paymentMethod: PaymentMethod;
  mobileNetwork?: "MTN" | "Telecel" | "AirtelTigo";
}

export interface Booking extends BookingInput {
  id: string;
  ticketId: string;
  paymentStatus: PaymentStatus;
  qrPayload: string;
  createdAt: string;
}
