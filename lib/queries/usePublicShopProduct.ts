"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicShopProduct } from "@/lib/api/public";
import { publicShopKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
};

export function usePublicShopProduct(
  clinicId: string,
  productId: string,
  { enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: publicShopKeys.detail(clinicId, productId),
    queryFn: () => getPublicShopProduct(clinicId, productId),
    enabled: enabled && !!clinicId && !!productId,
  });
}
