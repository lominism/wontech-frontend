import { type ShopPartner } from "@/lib/shop-url";

export type PublicShopProduct = {
  id: string;
  name: string;
  sku: string;
  category: string | null;
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
  clinicId?: string;
  influencerId?: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressStreet: string;
  shippingAddressStreet2?: string;
  shippingAddressCity: string;
  shippingAddressCode: string;
  quantity?: number;
};

export type CreateOrderResponse = {
  orderId: string;
  orderNo: string;
  paymentUrl: string;
};

export type CheckoutSessionResponse = {
  checkoutUrl: string;
};

export type PaymentStatusResponse = {
  status: "pending" | "paid" | "failed" | "cancelled";
  orderNo?: string;
  trackingToken?: string;
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
  partnerId: string,
  productId: string,
  partner: ShopPartner = "clinic"
): Promise<PublicShopResponse> {
  if (partner === "storefront") {
    const product = await getStorefrontProduct(productId);
    return {
      clinic: { id: "", name: "" },
      product,
    };
  }

  const path =
    partner === "influencer"
      ? `/public/shop/influencer/${partnerId}/${productId}`
      : `/public/shop/${partnerId}/${productId}`;
  const res = await fetch(`${apiUrl()}${path}`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load product");
  }

  return res.json() as Promise<PublicShopResponse>;
}

export async function listStorefrontProducts(): Promise<PublicShopProduct[]> {
  const res = await fetch(`${apiUrl()}/public/storefront/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load products");
  }

  return res.json() as Promise<PublicShopProduct[]>;
}

export async function getStorefrontProduct(
  productId: string
): Promise<PublicShopProduct> {
  const res = await fetch(
    `${apiUrl()}/public/storefront/products/${productId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load product");
  }

  return res.json() as Promise<PublicShopProduct>;
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

export async function createCheckoutSession(
  orderId: string,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${apiUrl()}/public/payments/checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, successUrl, cancelUrl }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to start payment");
  }

  return res.json() as Promise<CheckoutSessionResponse>;
}

export async function getPaymentStatus(
  sessionId: string
): Promise<PaymentStatusResponse> {
  const res = await fetch(
    `${apiUrl()}/public/payments/status?session_id=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to verify payment");
  }

  return res.json() as Promise<PaymentStatusResponse>;
}

/** Dev-only stub; disabled in production on the backend. */
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
