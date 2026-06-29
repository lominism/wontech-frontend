"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/lib/api/products";
import { productKeys } from "./productKeys";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
