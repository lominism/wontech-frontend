"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WDataTable } from "@/components/shared/WDataTable";
import { TablePagination } from "@/components/shared/TablePagination";

export type PurchaseHistoryRecord = {
  id: string;
  date: string;
  quantity: number;
  customerName: string | null;
  clinicName: string | null;
};

type Props = {
  records: PurchaseHistoryRecord[];
  isLoading?: boolean;
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const columnHelper = createColumnHelper<PurchaseHistoryRecord>();

export function PurchaseHistoryTable({
  records,
  isLoading,
  page,
  total,
  pageSize,
  onPageChange,
}: Props) {
  const t = useTranslations("inventory.detail.history");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "th" ? "th-TH" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columns = [
    columnHelper.accessor("date", {
      header: t("date"),
      cell: (info) => (
        <span className="tabular-nums">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: t("quantity"),
      cell: (info) => {
        const count = info.getValue();
        const name = info.row.original.customerName?.trim() || "—";
        return (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <Badge className="border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-100">
              {count}
            </Badge>
            <span className="text-sm text-muted-foreground">{t("soldTo")}</span>
            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {name}
            </Badge>
          </span>
        );
      },
    }),
    columnHelper.accessor("clinicName", {
      header: t("clinic"),
      cell: (info) => (
        <Badge variant="secondary">{info.getValue()?.trim() || "—"}</Badge>
      ),
    }),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        ) : (
          <>
            <WDataTable
              columns={columns}
              data={records}
              emptyMessage={t("empty")}
            />
            <TablePagination
              namespace="inventory.detail.history.pagination"
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
