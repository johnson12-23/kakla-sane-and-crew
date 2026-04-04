"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid admin credentials");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass surface-card mx-auto max-w-sm rounded-2xl p-4 md:p-5">
      <h1 className="font-display text-2xl">Admin Login</h1>
      <p className="mt-1 text-xs text-sand/70">Authorized team members only.</p>

      <label className="mt-3 flex flex-col gap-1 text-xs">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm"
          required
        />
      </label>

      <label className="mt-2 flex flex-col gap-1 text-xs">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs md:text-sm"
          required
        />
      </label>

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}

      <button className="gold-button mt-3 w-full md:w-auto" disabled={loading}>
        {loading ? "Authenticating..." : "Sign In"}
      </button>
    </form>
  );
}
