"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, type CreateOrderPayload } from "@/lib/api/orders";
import { orderKeys } from "./orderKeys";
import { productKeys } from "./productKeys";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
