import { auth } from "@/lib/firebase";

export type UserRole = "owner" | "admin";

export type Member = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: string;
};

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export type Invitation = {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  createdAt: string;
  invitedByUser: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listMembers(): Promise<Member[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load members");
  }

  return res.json() as Promise<Member[]>;
}

export async function listInvitations(): Promise<Invitation[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/invitations`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load invitations");
  }

  return res.json() as Promise<Invitation[]>;
}

export async function createInvitation(email: string): Promise<Invitation> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/invitations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text) || "Failed to send invitation");
  }

  return res.json() as Promise<Invitation>;
}

export async function revokeInvitation(id: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/invitations/${id}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text) || "Failed to revoke invitation");
  }
}

export async function removeMember(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseError(text) || "Failed to remove member");
  }
}

// NestJS error responses are JSON like { message: "..." }. Fall back to the
// raw text if it isn't parseable.
function parseError(text: string): string | null {
  try {
    const body = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    return body.message ?? null;
  } catch {
    return text || null;
  }
}
