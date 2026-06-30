"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  LOGISTICS_PAGE_SIZE,
  listLogistics,
  type ListLogisticsParams,
} from "@/lib/api/logistics";
import { logisticsKeys } from "./logisticsKeys";

type Options = ListLogisticsParams & {
  enabled?: boolean;
};

export function useLogistics({
  search = "",
  status = "all",
  page = 1,
  pageSize = LOGISTICS_PAGE_SIZE,
  sortBy = "date",
  sortDir = "desc",
  enabled = true,
}: Options = {}) {
  return useQuery({
    queryKey: logisticsKeys.list({ search, status, page, pageSize, sortBy, sortDir }),
    queryFn: () =>
      listLogistics({ search, status, page, pageSize, sortBy, sortDir }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
