import { type User } from "firebase/auth";

type SyncUserNames = {
  firstName?: string;
  lastName?: string;
};

export type BackendUser = {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
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
