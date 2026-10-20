"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductHistory } from "@/lib/api/products";
import { productKeys } from "./productKeys";

export const PRODUCT_HISTORY_PAGE_SIZE = 10;

type Options = {
  page?: number;
  enabled?: boolean;
};

export function useProductHistory(
  productId: string | undefined,
  { page = 1, enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: productKeys.history(productId ?? "", page),
    queryFn: () =>
      getProductHistory(productId!, {
        page,
        pageSize: PRODUCT_HISTORY_PAGE_SIZE,
      }),
    enabled: enabled && !!productId,
  });
}
