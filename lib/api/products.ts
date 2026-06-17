import { auth } from "@/lib/firebase";

export type CreateProductPayload = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  commission?: number | null;
  description?: string | null;
  brand?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  originCountry?: string | null;
  imageUrl?: string | null;
};

export type ProductResponse = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: string;
  commission_amount: string | null;
  description: string | null;
  brand: string | null;
  weight: string | null;
  dimensions: string | null;
  origin_country: string | null;
  image_url: string | null;
  stock?: { quantity_on_hand: number } | null;
};

/** Normalized product shape used by inventory UI components. */
export type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  commission: number | null;
  stock: number;
  image: string | null;
  description: string | null;
  brand: string | null;
  weight: string | null;
  dimensions: string | null;
  origin: string | null;
};

export function mapProductResponse(row: ProductResponse): InventoryProduct {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    price: Number(row.price),
    commission:
      row.commission_amount != null ? Number(row.commission_amount) : null,
    stock: row.stock?.quantity_on_hand ?? 0,
    image: row.image_url,
    description: row.description,
    brand: row.brand,
    weight: row.weight,
    dimensions: row.dimensions,
    origin: row.origin_country,
  };
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listProducts(): Promise<InventoryProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load products");
  }

  const rows = (await res.json()) as ProductResponse[];
  return rows.map(mapProductResponse);
}

export async function getProduct(id: string): Promise<InventoryProduct> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load product");
  }

  const row = (await res.json()) as ProductResponse;
  return mapProductResponse(row);
}

export async function createProduct(
  payload: CreateProductPayload
): Promise<InventoryProduct> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create product");
  }

  const row = (await res.json()) as ProductResponse;
  return mapProductResponse(row);
}
