"use client";

import { useQuery } from "@tanstack/react-query";
import { getStorefrontProduct } from "@/lib/api/public";
import { storefrontKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
};

export function useStorefrontProduct(
  productId: string,
  { enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: storefrontKeys.detail(productId),
    queryFn: () => getStorefrontProduct(productId),
    enabled: enabled && !!productId,
  });
}
