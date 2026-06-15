import { type User } from "firebase/auth";

export async function syncUser(user: User): Promise<void> {
  const token = await user.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
