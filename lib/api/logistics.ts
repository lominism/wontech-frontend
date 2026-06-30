import { auth } from "@/lib/firebase";

export const LOGISTICS_PAGE_SIZE = 10;

export const LOGISTICS_FILTER_STATUSES = [
  "awaiting_shipment",
  "shipped",
] as const;

export type LogisticsStatus = (typeof LOGISTICS_FILTER_STATUSES)[number];

export type LogisticsOrder = {
  id: string;
  orderNo: string;
  date: string;
  customer: string;
  item: string;
  qty: number;
  status: LogisticsStatus;
};

export type LogisticsListResult = {
  items: LogisticsOrder[];
  total: number;
  page: number;
  pageSize: number;
};

export type UpdateShippingPayload = {
  carrier?: string | null;
  trackingNumber?: string | null;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type ListLogisticsParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

export async function listLogistics(
  params: ListLogisticsParams = {}
): Promise<LogisticsListResult> {
  const query = new URLSearchParams();
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? LOGISTICS_PAGE_SIZE));
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.sortDir) {
    query.set("sortDir", params.sortDir);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/logistics?${query.toString()}`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load logistics orders");
  }

  return res.json() as Promise<LogisticsListResult>;
}

export async function updateOrderShipping(
  orderId: string,
  payload: UpdateShippingPayload
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/shipping`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update shipping");
  }

  return res.json();
}
