"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateOrderShipping,
  type UpdateShippingPayload,
} from "@/lib/api/logistics";
import { orderKeys } from "./orderKeys";
import { logisticsKeys } from "./logisticsKeys";

export function useUpdateOrderShipping(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShippingPayload) =>
      updateOrderShipping(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logisticsKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
