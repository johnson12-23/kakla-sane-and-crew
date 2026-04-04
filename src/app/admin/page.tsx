import { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | Kakla Sane & Crew"
};

export default function AdminPage() {
  return (
    <section className="section-wrap page-fade">
      <AdminLoginForm />
    </section>
  );
}
