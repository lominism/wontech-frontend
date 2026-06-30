import type { GetDashboardParams } from "@/lib/api/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (params: GetDashboardParams) =>
    [...dashboardKeys.all, "stats", params] as const,
};
