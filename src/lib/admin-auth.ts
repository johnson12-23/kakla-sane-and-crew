import { cookies } from "next/headers";

const ADMIN_COOKIE = "ksc_admin_session";

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export function isValidAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kaklasanecrew.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "KAKLAADMIN2026";

  return email === adminEmail && password === adminPassword;
}

export function isAdminLoggedIn() {
  const store = cookies();
  return store.get(ADMIN_COOKIE)?.value === "active";
}
