"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { thbFormatter } from "@/lib/utils";
import { type Order, type OrderStatus } from "@/lib/mock-data";
import { WDataTable } from "@/components/shared/WDataTable";

type Props = {
  data: Order[];
};

const statusStyles: Record<OrderStatus, string> = {
  "Awaiting Shipment":
    "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  Shipped: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const columnHelper = createColumnHelper<Order>();

export function OrdersTable({ data }: Props) {
  const t = useTranslations("orders.table");
  const tStatus = useTranslations("orders.status");

  const columns = [
    columnHelper.accessor("orderNo", {
      header: t("orderNo"),
      cell: (info) => (
        <span className="font-semibold text-primary">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      header: t("date"),
      cell: (info) => (
        <span className="text-muted-foreground tabular-nums">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("customer", {
      header: t("customer"),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("clinic", {
      header: t("clinic"),
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("qty", {
      header: t("qty"),
      cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: t("status"),
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge className={statusStyles[status]}>{tStatus(status)}</Badge>
        );
      },
    }),
    columnHelper.accessor("total", {
      header: t("total"),
      cell: (info) => (
        <span className="font-medium tabular-nums">
          {thbFormatter.format(info.getValue())}
        </span>
      ),
    }),
  ];

  return <WDataTable columns={columns} data={data} emptyMessage={t("empty")} />;
}
