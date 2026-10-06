"use client";

import { useQuery } from "@tanstack/react-query";
import { listProductCategories } from "@/lib/api/product-categories";
import { productCategoryKeys } from "./productCategoryKeys";

type Options = {
  enabled?: boolean;
};

export function useProductCategories({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: productCategoryKeys.list(),
    queryFn: listProductCategories,
    enabled,
  });
}
