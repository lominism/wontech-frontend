"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductCategory } from "@/lib/api/product-categories";
import { productCategoryKeys } from "./productCategoryKeys";

export function useCreateProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createProductCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productCategoryKeys.lists() });
    },
  });
}
