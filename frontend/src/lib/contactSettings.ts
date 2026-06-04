export type ContactSettings = {
  phone: string;
  whatsappNumber: string;
  email: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  phone: "+6285777718390",
  whatsappNumber: "6285779002910",
  email: "dedynugroho@gmail.com",
};

export function normalizeContactSettings(
  contact?: Partial<ContactSettings> | null
): ContactSettings {
  const phone = contact?.phone || DEFAULT_CONTACT_SETTINGS.phone;
  const whatsappNumber = (contact?.whatsappNumber || phone).replace(/\D/g, "");

  return {
    phone,
    whatsappNumber,
    email: contact?.email || DEFAULT_CONTACT_SETTINGS.email,
  };
}

export async function fetchContactSettings(): Promise<ContactSettings> {
  try {
    const response = await fetch(`${API_URL}/contact-settings`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load contact settings: ${response.status}`);
    }

    const result = await response.json();

    return normalizeContactSettings(result?.data);
  } catch {
    return DEFAULT_CONTACT_SETTINGS;
  }
}

export async function saveContactSettings(contact: ContactSettings, token: string) {
  const response = await fetch(`${API_URL}/contact-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contact),
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to save contact settings");
  }

  return normalizeContactSettings(result.data);
}