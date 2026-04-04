import { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Kakla Sane & Crew"
};

export default function AdminPage() {
  return (
    <section className="section-wrap page-fade">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Monitor bookings, contact messages, ticket validation, and slot capacity.</p>
        </div>
        <Link href="/admin/login" className="gold-button text-xs">
          Login To Admin Panel
        </Link>
      </div>
      <div className="mt-4">
        <AdminDashboard />
      </div>
    </section>
  );
}
