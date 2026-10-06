"use client";

import { useQuery } from "@tanstack/react-query";
import { listStorefrontProducts } from "@/lib/api/public";
import { storefrontKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
};

export function useStorefrontProducts({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: storefrontKeys.list(),
    queryFn: () => listStorefrontProducts(),
    enabled,
  });
}
