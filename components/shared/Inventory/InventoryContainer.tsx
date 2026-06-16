"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { mockProducts } from "@/lib/mock-data";
import {
  InventoryToolbar,
  type InventoryView,
} from "./InventoryToolbar";
import { ProductCardGrid } from "./ProductCardGrid";
import { InventoryTable } from "./InventoryTable";
import { AddProductDialog } from "./AddProductDialog";

export function InventoryContainer() {
  const t = useTranslations("inventory");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<InventoryView>("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

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

      <AddProductDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
