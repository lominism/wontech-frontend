"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicShopProduct } from "@/lib/api/public";
import { type ShopPartner } from "@/lib/shop-url";
import { publicShopKeys, storefrontKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
  partner?: ShopPartner;
};

export function usePublicShopProduct(
  partnerId: string,
  productId: string,
  { enabled = true, partner = "clinic" }: Options = {}
) {
  const isStorefront = partner === "storefront";

  return useQuery({
    queryKey: isStorefront
      ? storefrontKeys.detail(productId)
      : publicShopKeys.detail(partner, partnerId, productId),
    queryFn: () => getPublicShopProduct(partnerId, productId, partner),
    enabled:
      enabled &&
      !!productId &&
      (isStorefront || !!partnerId),
  });
}
