import { auth } from "@/lib/firebase";
import type { Order, OrderSource } from "@/lib/api/orders";

export const DASHBOARD_RANGES = [
  "lastYear",
  "last3Months",
  "lastWeek",
] as const;

export const CLINIC_MODES = ["total", "active"] as const;

export type DashboardRange = (typeof DASHBOARD_RANGES)[number];
export type ClinicMode = (typeof CLINIC_MODES)[number];

export type SalesBySourceItem = {
  source: OrderSource;
  value: number;
};

export type RevenueOverviewItem = {
  month: string;
  revenue: number;
};

export type DashboardStats = {
  revenue: { value: number };
  orders: { value: number };
  unitsSold: number;
  activeClinics: number;
  revenueOverview: RevenueOverviewItem[];
  salesBySource: SalesBySourceItem[];
  recentOrders: Order[];
};

export type GetDashboardParams = {
  revenueRange?: DashboardRange;
  ordersRange?: DashboardRange;
  clinicMode?: ClinicMode;
};

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboardStats(
  params: GetDashboardParams = {}
): Promise<DashboardStats> {
  const query = new URLSearchParams();
  query.set("revenueRange", params.revenueRange ?? "lastYear");
  query.set("ordersRange", params.ordersRange ?? "lastYear");
  query.set("clinicMode", params.clinicMode ?? "total");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard?${query.toString()}`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load dashboard stats");
  }

  return res.json() as Promise<DashboardStats>;
}
