"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/lib/api/orders";
import { orderKeys } from "./orderKeys";

type Options = {
  enabled?: boolean;
};

export function useOrder(orderId: string | null, { enabled = true }: Options = {}) {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: () => getOrder(orderId!),
    enabled: enabled && !!orderId,
  });
}
