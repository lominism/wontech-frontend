import { auth } from "@/lib/firebase";
import {
  normalizeImageUrls,
  primaryImageUrl,
} from "@/lib/product-images";

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
  imageUrls?: string[];
};

export type UpdateProductPayload = CreateProductPayload & {
  isActive?: boolean;
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
  image_urls: string[];
  is_active: boolean;
  has_orders?: boolean;
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
  images: string[];
  description: string | null;
  brand: string | null;
  weight: string | null;
  dimensions: string | null;
  origin: string | null;
  isActive: boolean;
  hasOrders?: boolean;
};

export function mapProductResponse(row: ProductResponse): InventoryProduct {
  const images = normalizeImageUrls(row.image_urls, row.image_url);
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    price: Number(row.price),
    commission:
      row.commission_amount != null ? Number(row.commission_amount) : null,
    stock: row.stock?.quantity_on_hand ?? 0,
    images,
    image: primaryImageUrl(images),
    description: row.description,
    brand: row.brand,
    weight: row.weight,
    dimensions: row.dimensions,
    origin: row.origin_country,
    isActive: row.is_active ?? true,
    hasOrders: row.has_orders,
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

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<InventoryProduct> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update product");
  }

  const row = (await res.json()) as ProductResponse;
  return mapProductResponse(row);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete product");
  }
}
