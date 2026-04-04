import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Panel | Kakla Sane & Crew"
};

export default function AdminPage() {
  const loggedIn = isAdminLoggedIn();

  return (
    <section className="section-wrap page-fade">
      {loggedIn ? (
        <div className="space-y-3 md:space-y-4">
          <header className="flex flex-col gap-1">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage bookings, contact messages, tickets, and slot capacity.</p>
          </header>
          <AdminDashboard />
        </div>
      ) : (
        <div className="flex min-h-[56vh] items-center justify-center">
          <AdminLoginForm />
        </div>
      )}
    </section>
  );
}
