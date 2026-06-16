import { auth } from "@/lib/firebase";

export type CreateProductPayload = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  commission?: number | null;
};

export type ProductResponse = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: string;
  commission_amount: string | null;
  image_url: string | null;
  stock?: { quantity_on_hand: number } | null;
};

export async function createProduct(payload: CreateProductPayload): Promise<ProductResponse> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create product");
  }

  return (await res.json()) as ProductResponse;
}

