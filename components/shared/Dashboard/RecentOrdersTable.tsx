"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WDataTable } from "@/components/shared/WDataTable";
import type { Order } from "@/lib/api/orders";

type Props = {
  data: Order[];
};

export function RecentOrdersTable({ data }: Props) {
  const t = useTranslations("dashboard.recentOrders");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "th" ? "th-TH" : "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const columnHelper = createColumnHelper<Order>();

  const columns = [
    columnHelper.accessor("orderNo", {
      header: t("columns.order"),
      cell: (info) => (
        <span className="font-semibold text-primary">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      header: t("columns.date"),
      cell: (info) => (
        <span className="text-muted-foreground tabular-nums">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("item", {
      header: t("columns.item"),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("customer", {
      header: t("columns.customer"),
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("clinic", {
      header: t("columns.clinic"),
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("qty", {
      header: t("columns.qty"),
      cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    }),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">
            {t("empty")}
          </p>
        ) : (
          <WDataTable columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  );
}
