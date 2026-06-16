"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { mockProducts, type Product } from "@/lib/mock-data";
import {
  InventoryToolbar,
  type InventoryView,
} from "./InventoryToolbar";
import { ProductCardGrid } from "./ProductCardGrid";
import { InventoryTable } from "./InventoryTable";
import { AddProductDialog } from "./AddProductDialog";

export function InventoryContainer() {
  const t = useTranslations("inventory");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<InventoryView>("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>

      <InventoryToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        view={view}
        onViewChange={setView}
        onAdd={() => setIsAddOpen(true)}
      />

      {view === "grid" ? (
        <ProductCardGrid products={filtered} />
      ) : (
        <InventoryTable data={filtered} />
      )}

      <AddProductDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onCreated={() => {
          // For now, keep UI simple: reload the page to pull new list later.
          // We'll replace this with a real GET /products list once the backend
          // data is fully wired into the inventory view.
          window.location.reload();
        }}
      />
    </div>
  );
}
