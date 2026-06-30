"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  listOrders,
  ORDER_PAGE_SIZE,
  type ListOrdersParams,
} from "@/lib/api/orders";
import { ORDER_DEFAULT_SORT } from "@/lib/sorting";
import { orderKeys } from "./orderKeys";

type Options = ListOrdersParams & {
  enabled?: boolean;
};

export function useOrders({
  search = "",
  status = "all",
  page = 1,
  pageSize = ORDER_PAGE_SIZE,
  sortBy = ORDER_DEFAULT_SORT.sortBy,
  sortDir = ORDER_DEFAULT_SORT.sortDir,
  enabled = true,
}: Options = {}) {
  return useQuery({
    queryKey: orderKeys.list({ search, status, page, pageSize, sortBy, sortDir }),
    queryFn: () =>
      listOrders({ search, status, page, pageSize, sortBy, sortDir }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
