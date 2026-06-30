export type PublicShopProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description: string | null;
  brand: string | null;
  weight: string | null;
  dimensions: string | null;
  origin: string | null;
  image: string | null;
  images: string[];
  inStock: boolean;
  stockAvailable: number;
};

export type PublicShopResponse = {
  clinic: { id: string; name: string };
  product: PublicShopProduct;
};

export type CreateOrderPayload = {
  clinicId: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressStreet: string;
  shippingAddressCity: string;
  shippingAddressCode: string;
  quantity?: number;
};

export type CreateOrderResponse = {
  orderId: string;
  orderNo: string;
  paymentUrl: string;
};

export type ConfirmPaymentResponse = {
  orderId: string;
  orderNo: string;
  trackingToken: string;
  trackingUrl: string;
};

export type PublicTrackResponse = {
  orderNo: string;
  status: string;
  productName: string;
  quantity: number;
  total: number;
  updatedAt: string;
  carrier: string | null;
  trackingNumber: string | null;
};

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getPublicShopProduct(
  clinicId: string,
  productId: string
): Promise<PublicShopResponse> {
  const res = await fetch(
    `${apiUrl()}/public/shop/${clinicId}/${productId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load product");
  }

  return res.json() as Promise<PublicShopResponse>;
}

export async function createPublicOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch(`${apiUrl()}/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create order");
  }

  return res.json() as Promise<CreateOrderResponse>;
}

export async function confirmPayment(
  orderId: string
): Promise<ConfirmPaymentResponse> {
  const frontendUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const res = await fetch(`${apiUrl()}/public/payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-frontend-url": frontendUrl,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Payment failed");
  }

  return res.json() as Promise<ConfirmPaymentResponse>;
}

export async function getPublicTracking(
  token: string
): Promise<PublicTrackResponse> {
  const res = await fetch(`${apiUrl()}/public/track/${token}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load tracking");
  }

  return res.json() as Promise<PublicTrackResponse>;
}
