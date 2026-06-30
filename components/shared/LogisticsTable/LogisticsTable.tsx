"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { type SortDirection } from "@/lib/sorting";
import { type LogisticsOrder } from "@/lib/api/logistics";
import { type OrderStatus } from "@/lib/api/orders";
import { WDataTable } from "@/components/shared/WDataTable";

type Props = {
  data: LogisticsOrder[];
  sortBy: string;
  sortDir: SortDirection;
  onSort: (columnId: string) => void;
  onOrderClick?: (order: LogisticsOrder) => void;
};

const statusStyles: Record<OrderStatus, string> = {
  pending_payment:
    "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  paid: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100",
  awaiting_shipment:
    "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  shipped: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
  completed:
    "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const columnHelper = createColumnHelper<LogisticsOrder>();

export function LogisticsTable({
  data,
  sortBy,
  sortDir,
  onSort,
  onOrderClick,
}: Props) {
  const t = useTranslations("logistics.table");
  const tStatus = useTranslations("orders.status");
  const locale = useLocale();

  const formatter =
    locale === "th"
      ? new Intl.DateTimeFormat("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : dateFormatter;

  const columns = [
    columnHelper.accessor("orderNo", {
      id: "orderNo",
      header: () => (
        <SortableColumnHeader
          label={t("orderNo")}
          columnId="orderNo"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="font-semibold text-primary">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: () => (
        <SortableColumnHeader
          label={t("date")}
          columnId="date"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="text-muted-foreground tabular-nums">
          {formatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("customer", {
      id: "customer",
      header: () => (
        <SortableColumnHeader
          label={t("customer")}
          columnId="customer"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("item", {
      id: "item",
      header: () => (
        <SortableColumnHeader
          label={t("item")}
          columnId="item"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("qty", {
      id: "qty",
      header: () => (
        <SortableColumnHeader
          label={t("qty")}
          columnId="qty"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <SortableColumnHeader
          label={t("status")}
          columnId="status"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge className={statusStyles[status]}>{tStatus(status)}</Badge>
        );
      },
    }),
  ];

  return (
    <WDataTable
      columns={columns}
      data={data}
      emptyMessage={t("empty")}
      onRowClick={onOrderClick}
    />
  );
}
