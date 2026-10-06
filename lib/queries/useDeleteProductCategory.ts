"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductCategory } from "@/lib/api/product-categories";
import { productCategoryKeys } from "./productCategoryKeys";
import { productKeys } from "./productKeys";

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
