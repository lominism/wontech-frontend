"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProduct,
  type UpdateProductPayload,
} from "@/lib/api/products";
import { productKeys } from "./productKeys";

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
