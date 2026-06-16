"use client";

import { useTranslations } from "next-intl";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { productCategories } from "@/lib/mock-data";

export type InventoryView = "grid" | "list";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  view: InventoryView;
  onViewChange: (view: InventoryView) => void;
  onAdd: () => void;
};

export function InventoryToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  view,
  onViewChange,
  onAdd,
}: Props) {
  const t = useTranslations("inventory");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={15}
          />
          <Input
            placeholder={t("actions.search")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("actions.allCategories")}</SelectItem>
            {productCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-md border p-0.5">
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm transition-colors",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid size={15} />
            {t("view.grid")}
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List size={15} />
            {t("view.list")}
          </button>
        </div>

        <Button onClick={onAdd} className="shrink-0">
          <Plus size={16} />
          {t("actions.addProduct")}
        </Button>
      </div>
    </div>
  );
}
