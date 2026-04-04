"use client";

import { FormEvent, useState } from "react";

interface ContactFormState {
  fullName: string;
  email: string;
  message: string;
}

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          message: form.message
        })
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Unable to send message right now.");
      }

      setFeedback({
        type: "success",
        message: data.message || "Message sent successfully. Our team will get back to you soon."
      });
      setForm(initialState);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send your message at the moment."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass surface-card rounded-2xl p-4 md:p-5">
      <h2 className="font-display text-xl">Send Us a Message</h2>
      <div className="mt-3 space-y-2">
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Tell us what you need"
          rows={4}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          required
        />

        {feedback && (
          <p className={`text-xs ${feedback.type === "success" ? "text-emerald-200" : "text-red-300"}`}>
            {feedback.message}
          </p>
        )}

        <button type="submit" className="gold-button" disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
