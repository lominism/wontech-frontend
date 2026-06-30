"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  type ClinicMode,
  type DashboardRange,
  type GetDashboardParams,
} from "@/lib/api/dashboard";
import { dashboardKeys } from "./dashboardKeys";

type Options = GetDashboardParams & {
  enabled?: boolean;
};

export function useDashboard({
  revenueRange = "lastYear",
  ordersRange = "lastYear",
  clinicMode = "total",
  enabled = true,
}: Options = {}) {
  const params: GetDashboardParams = {
    revenueRange: revenueRange as DashboardRange,
    ordersRange: ordersRange as DashboardRange,
    clinicMode: clinicMode as ClinicMode,
  };

  return useQuery({
    queryKey: dashboardKeys.stats(params),
    queryFn: () => getDashboardStats(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
