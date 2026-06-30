import { auth } from "@/lib/firebase";

export const ORDER_PAGE_SIZE = 10;

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "awaiting_shipment",
  "shipped",
  "completed",
  "cancelled",
] as const;

export const ORDER_FILTER_STATUSES = [
  "awaiting_shipment",
  "shipped",
  "completed",
] as const;

export const ORDER_MANUAL_STATUSES = [
  "awaiting_shipment",
  "shipped",
  "completed",
] as const;

export const ORDER_SOURCES = ["wontech", "lazada", "shopee"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderSource = (typeof ORDER_SOURCES)[number];
export type OrderManualStatus = (typeof ORDER_MANUAL_STATUSES)[number];

export type Order = {
  id: string;
  orderNo: string;
  date: string;
  customer: string;
  clinic: string;
  item: string;
  qty: number;
  status: OrderStatus;
  total: number;
  source: OrderSource;
};

export type OrderListResult = {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
};

export type OrderDetail = {
  id: string;
  orderNo: string;
  status: OrderStatus;
  source: OrderSource;
  createdAt: string;
  updatedAt: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  clinicId: string | null;
  clinicName: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddressStreet: string | null;
  shippingAddressCity: string | null;
  shippingAddressCode: string | null;
  paymentProvider: string | null;
  paymentReference: string | null;
  trackingToken: string;
  carrier: string | null;
  trackingNumber: string | null;
};

export type CreateOrderPayload = {
  source: OrderSource;
  productId: string;
  quantity: number;
  status: OrderManualStatus;
  clinicId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddressStreet?: string | null;
  shippingAddressCity?: string | null;
  shippingAddressCode?: string | null;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type ListOrdersParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

export async function listOrders(
  params: ListOrdersParams = {}
): Promise<OrderListResult> {
  const query = new URLSearchParams();
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? ORDER_PAGE_SIZE));
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.sortDir) {
    query.set("sortDir", params.sortDir);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/orders?${query.toString()}`;

  const res = await fetch(url, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load orders");
  }

  return res.json() as Promise<OrderListResult>;
}

export async function getOrder(id: string): Promise<OrderDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load order");
  }

  return res.json() as Promise<OrderDetail>;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create order");
  }

  return res.json() as Promise<Order>;
}

export async function updateOrderStatus(
  id: string,
  status: "shipped" | "cancelled"
): Promise<Order> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update order");
  }

  return res.json() as Promise<Order>;
}
