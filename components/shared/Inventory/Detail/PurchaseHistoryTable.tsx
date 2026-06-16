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
import { type PurchaseRecord } from "@/lib/mock-data";

type Props = {
  records: PurchaseRecord[];
};

const columnHelper = createColumnHelper<PurchaseRecord>();

export function PurchaseHistoryTable({ records }: Props) {
  const t = useTranslations("inventory.detail.history");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "th" ? "th-TH" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );

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
      cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    }),
    columnHelper.accessor("clinicName", {
      header: t("clinic"),
      cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>,
    }),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <WDataTable
          columns={columns}
          data={records}
          emptyMessage={t("empty")}
        />
      </CardContent>
    </Card>
  );
}
