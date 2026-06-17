"use client";

import { useTranslations } from "next-intl";
import { type InventoryProduct } from "@/lib/api/products";
import { ProductCard } from "./ProductCard";

type Props = {
  products: InventoryProduct[];
};

export function ProductCardGrid({ products }: Props) {
  const t = useTranslations("inventory.table");

  if (products.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
