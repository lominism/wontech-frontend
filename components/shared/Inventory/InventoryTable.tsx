"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { thbFormatter } from "@/lib/utils";
import { type InventoryProduct } from "@/lib/api/products";
import { WDataTable } from "@/components/shared/WDataTable";
import { useRouter } from "@/i18n/navigation";
import { getStockStatus, stockTextColor } from "./stock";

type Props = {
  data: InventoryProduct[];
};

const columnHelper = createColumnHelper<InventoryProduct>();

export function InventoryTable({ data }: Props) {
  const t = useTranslations("inventory.table");
  const router = useRouter();

  const columns = [
    columnHelper.accessor("image", {
      header: t("image"),
      cell: (info) => {
        const image = info.getValue();
        return (
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-muted">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={info.row.original.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="text-muted-foreground/40" size={22} />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: t("name"),
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("sku", {
      header: t("sku"),
      cell: (info) => (
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("category", {
      header: t("category"),
      cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor("price", {
      header: t("price"),
      cell: (info) => (
        <span className="tabular-nums">
          {thbFormatter.format(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("stock", {
      header: t("stock"),
      cell: (info) => {
        const stock = info.getValue();
        const status = getStockStatus(stock);
        return (
          <span className={`font-medium tabular-nums ${stockTextColor[status]}`}>
            {stock}
          </span>
        );
      },
    }),
  ];

  return (
    <WDataTable
      columns={columns}
      data={data}
      emptyMessage={t("empty")}
      onRowClick={(product) => router.push(`/inventory/${product.id}`)}
    />
  );
}
