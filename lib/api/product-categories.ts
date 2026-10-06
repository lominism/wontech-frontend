import { auth } from "@/lib/firebase";

export type ProductCategory = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product-categories`,
    {
      headers: await authHeaders(),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load product categories");
  }

  return (await res.json()) as ProductCategory[];
}

export async function createProductCategory(
  name: string
): Promise<ProductCategory> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product-categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify({ name }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create product category");
  }

  return (await res.json()) as ProductCategory;
}

export async function deleteProductCategory(id: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product-categories/${id}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete product category");
  }
}
