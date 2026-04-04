import { ContactMessage, ContactMessageInput } from "@/types";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { readCollection, writeCollection } from "@/lib/local-store";

const CONTACT_MESSAGES_FILE = "contact-messages.json";

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

    throw new Error(`Unable to save contact message: ${error.message}`);
  }

  const localMessages = await readCollection<ContactMessage>(CONTACT_MESSAGES_FILE);
  localMessages.push(message);
  await writeCollection(CONTACT_MESSAGES_FILE, localMessages);
  return message;
}

export async function listContactMessages() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Unable to load contact messages: ${error.message}`);
    }

    return (data as Array<Record<string, string>>).map((item) => ({
      id: String(item.id || ""),
      fullName: String(item.full_name || ""),
      email: String(item.email || ""),
      message: String(item.message || ""),
      createdAt: String(item.created_at || "")
    }));
  }

  const localMessages = await readCollection<ContactMessage>(CONTACT_MESSAGES_FILE);
  return [...localMessages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
