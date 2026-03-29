import { ContactMessage, ContactMessageInput } from "@/types";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

const inMemoryContactMessages: ContactMessage[] = [];

function toContactMessage(payload: ContactMessageInput): ContactMessage {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload
  };
}

export async function createContactMessage(payload: ContactMessageInput) {
  const message = toContactMessage(payload);

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      id: message.id,
      full_name: message.fullName,
      email: message.email,
      message: message.message,
      created_at: message.createdAt
    });

    if (!error) {
      return message;
    }
  }

  inMemoryContactMessages.push(message);
  return message;
}

export async function listContactMessages() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return (data as Array<Record<string, string>>).map((item) => ({
        id: String(item.id || ""),
        fullName: String(item.full_name || ""),
        email: String(item.email || ""),
        message: String(item.message || ""),
        createdAt: String(item.created_at || "")
      }));
    }
  }

  return [...inMemoryContactMessages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
