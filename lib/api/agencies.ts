import { auth } from "@/lib/firebase";

export type Agency = {
  id: string;
  name: string;
  memberCount: number;
  credit: number;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

function parseError(text: string, fallback: string): string {
  try {
    const parsed = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(parsed?.message)) return parsed.message.join(", ");
    if (parsed?.message) return parsed.message;
  } catch {
    // non-JSON
  }
  return text || fallback;
}

export async function listAgencies(): Promise<Agency[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text, "Failed to load agencies"));
  }

  return (await res.json()) as Agency[];
}

export async function createAgency(name: string): Promise<Agency> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text, "Failed to create agency"));
  }

  return (await res.json()) as Agency;
}

export async function deleteAgency(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text, "Failed to delete agency"));
  }
}
