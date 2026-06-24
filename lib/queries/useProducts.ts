"use client";

import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/api/products";
import { productKeys } from "./productKeys";

type Options = {
  enabled?: boolean;
};

export function useProducts({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: listProducts,
    enabled,
  });
}