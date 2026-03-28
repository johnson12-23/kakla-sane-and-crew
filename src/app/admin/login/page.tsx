import { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | Kakla Sane & Crew"
};

export default function AdminLoginPage() {
  return (
    <section className="section-wrap page-fade flex min-h-[56vh] items-center justify-center">
      <AdminLoginForm />
    </section>
  );
}
