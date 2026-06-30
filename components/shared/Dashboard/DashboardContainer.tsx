"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { ClinicMode, DashboardRange } from "@/lib/api/dashboard";
import { useDashboard } from "@/lib/queries/useDashboard";
import { StatCard } from "./StatCard";
import { RangeSelect } from "./RangeSelect";
import { ClinicModeSelect } from "./ClinicModeSelect";
import { RevenueChart } from "./RevenueChart";
import { SourceChart } from "./SourceChart";
import { RecentOrdersTable } from "./RecentOrdersTable";

const bahtFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function DashboardContainer() {
  const t = useTranslations("dashboard");
  const [revenueRange, setRevenueRange] = useState<DashboardRange>("lastYear");
  const [ordersRange, setOrdersRange] = useState<DashboardRange>("lastYear");
  const [clinicMode, setClinicMode] = useState<ClinicMode>("total");

  const { data, isLoading, isError, refetch, isFetching } = useDashboard({
    revenueRange,
    ordersRange,
    clinicMode,
  });

  if (isLoading && !data) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-destructive">
          <p className="text-sm">{t("error")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("kpis.totalRevenue")}
          value={bahtFormatter.format(data.revenue.value)}
          action={
            <RangeSelect value={revenueRange} onChange={setRevenueRange} />
          }
        />
        <StatCard
          title={t("kpis.unitsSold")}
          value={numberFormatter.format(data.unitsSold)}
        />
        <StatCard
          title={t("kpis.clinics")}
          value={numberFormatter.format(data.activeClinics)}
          action={
            <ClinicModeSelect value={clinicMode} onChange={setClinicMode} />
          }
        />
        <StatCard
          title={t("kpis.orders")}
          value={numberFormatter.format(data.orders.value)}
          action={<RangeSelect value={ordersRange} onChange={setOrdersRange} />}
        />
      </div>

      {/* Row 2 — charts */}
      <div
        className={`grid grid-cols-1 gap-4 lg:grid-cols-3 ${isFetching ? "opacity-70" : ""}`}
      >
        <RevenueChart data={data.revenueOverview} />
        <SourceChart data={data.salesBySource} />
      </div>

      {/* Row 3 — recent orders */}
      <RecentOrdersTable data={data.recentOrders} />
    </div>
  );
}
