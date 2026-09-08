"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useProducts } from "@/lib/queries/useProducts";
import {
  InventoryToolbar,
  type InventoryView,
} from "./InventoryToolbar";
import { ProductCardGrid } from "./ProductCardGrid";
import { InventoryTable } from "./InventoryTable";
import { AddProductDialog } from "./AddProductDialog";

export function InventoryContainer() {
  const t = useTranslations("inventory");
  const { user, loading: authLoading } = useAuth();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProducts({
    enabled: !authLoading && !!user,
  });

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
      return matchesSearch && matchesCategory && product.isActive;
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

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          {t("page.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
          <p className="text-sm">{t("page.loadError")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("page.retry")}
          </button>
        </div>
      ) : view === "grid" ? (
        <ProductCardGrid products={filtered} />
      ) : (
        <InventoryTable data={filtered} />
      )}

      <AddProductDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
