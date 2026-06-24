"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api/products";
import { productKeys } from "./productKeys";

type Options = {
  enabled?: boolean;
};

export function useProduct(id: string, { enabled = true }: Options = {}) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: enabled && !!id,
  });
}
