"use client";

import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/lib/api/orders";
import { orderKeys } from "./orderKeys";

export const PURCHASE_HISTORY_PAGE_SIZE = 10;

type Options = {
  page?: number;
  enabled?: boolean;
};

export function useProductPurchaseHistory(
  productId: string | undefined,
  { page = 1, enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: orderKeys.purchaseHistory(productId ?? "", page),
    queryFn: () =>
      listOrders({
        productId,
        status: "sold",
        page,
        pageSize: PURCHASE_HISTORY_PAGE_SIZE,
        sortBy: "date",
        sortDir: "desc",
      }),
    enabled: enabled && !!productId,
  });
}
