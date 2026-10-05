"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicShopProduct } from "@/lib/api/public";
import { type ShopPartner } from "@/lib/shop-url";
import { publicShopKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
  partner?: ShopPartner;
};

export function usePublicShopProduct(
  partnerId: string,
  productId: string,
  { enabled = true, partner = "clinic" }: Options = {}
) {
  return useQuery({
    queryKey: publicShopKeys.detail(partner, partnerId, productId),
    queryFn: () => getPublicShopProduct(partnerId, productId, partner),
    enabled: enabled && !!partnerId && !!productId,
  });
}
