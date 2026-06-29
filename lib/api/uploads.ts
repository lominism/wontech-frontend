import { auth } from "@/lib/firebase";

export type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getCloudinarySignature(): Promise<CloudinarySignature> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/cloudinary-signature`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to get upload signature");
  }

  return res.json() as Promise<CloudinarySignature>;
}

export async function uploadProductImage(file: File): Promise<string> {
  const signature = await getCloudinarySignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Image upload failed");
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
