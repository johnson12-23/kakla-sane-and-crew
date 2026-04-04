import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Login | Kakla Sane & Crew"
};

export default function AdminLoginPage() {
  if (isAdminLoggedIn()) {
    redirect("/admin");
  }

  return (
    <section className="section-wrap page-fade flex min-h-[56vh] items-center justify-center">
      <AdminLoginForm />
    </section>
  );
}
