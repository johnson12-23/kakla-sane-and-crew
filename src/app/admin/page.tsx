import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Kakla Sane & Crew"
};

export default function AdminPage() {
  return (
    <section className="section-wrap page-fade">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Monitor bookings, validate tickets, and manage payment status.</p>
      <div className="mt-4">
        <AdminDashboard />
      </div>
    </section>
  );
}
