import { type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type SyncUserNames = {
  firstName?: string;
  lastName?: string;
};

export type PreferredLocale = "en" | "th";

export type BackendUser = {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  preferredLocale: PreferredLocale;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  preferredLocale?: PreferredLocale;
};

export async function syncUser(
  user: User,
  names?: SyncUserNames
): Promise<BackendUser> {
  const token = await user.getIdToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sync`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: names?.firstName,
        lastName: names?.lastName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to sync user (${response.status} ${response.statusText})`
    );
  }

  return (await response.json()) as BackendUser;
}

export async function updateMyProfile(
  data: UpdateProfileInput
): Promise<BackendUser> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(parseError(text) || "Failed to update profile");
  }

  return (await response.json()) as BackendUser;
}

function parseError(text: string): string | null {
  try {
    const body = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    return body.message ?? null;
  } catch {
    return text || null;
  }
}
