"use client";

import { useState } from "react";

import {
  mockActiveClinics,
  mockOrdersByRange,
  mockRevenueByRange,
  mockUnitsSold,
  type DashboardRange,
} from "@/lib/mock-data";
import { StatCard } from "./StatCard";
import { RangeSelect } from "./RangeSelect";
import { RevenueChart } from "./RevenueChart";
import { CategoryChart } from "./CategoryChart";
import { RecentOrdersTable } from "./RecentOrdersTable";

const bahtFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function DashboardContainer() {
  const [revenueRange, setRevenueRange] = useState<DashboardRange>("lastYear");
  const [ordersRange, setOrdersRange] = useState<DashboardRange>("lastYear");

  const revenue = mockRevenueByRange[revenueRange];
  const orders = mockOrdersByRange[ordersRange];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of sales, clinics, and recent activity.
        </p>
      </div>

      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={bahtFormatter.format(revenue.value)}
          action={
            <RangeSelect value={revenueRange} onChange={setRevenueRange} />
          }
        />
        <StatCard
          title="Units Sold"
          value={numberFormatter.format(mockUnitsSold.value)}
        />
        <StatCard
          title="Active Clinics"
          value={numberFormatter.format(mockActiveClinics.value)}
        />
        <StatCard
          title="Orders"
          value={numberFormatter.format(orders.value)}
          action={<RangeSelect value={ordersRange} onChange={setOrdersRange} />}
        />
      </div>

      {/* Row 2 — charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <CategoryChart />
      </div>

      {/* Row 3 — recent orders */}
      <RecentOrdersTable />
    </div>
  );
}
