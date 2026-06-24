"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { thbFormatter } from "@/lib/utils";
import { type Clinic } from "@/lib/api/clinics";
import { WDataTable } from "@/components/shared/WDataTable";
import { useRouter } from "@/i18n/navigation";

type Props = {
  data: Clinic[];
  allClinics: Clinic[];
};

const columnHelper = createColumnHelper<Clinic>();

export function ClinicTable({ data, allClinics }: Props) {
  const t = useTranslations("clinic.table");
  const router = useRouter();

  const parentMap = Object.fromEntries(
    allClinics.map((c) => [c.id, c.name])
  );

  const columns = [
    columnHelper.accessor("name", {
      header: t("clinicName"),
      cell: (info) => (
        <span className="font-semibold">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("itemsSold", {
      header: t("itemsSold"),
      cell: (info) => (
        <span className="tabular-nums">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("revenue", {
      header: t("revenue"),
      cell: (info) => (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          {thbFormatter.format(info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor("credit", {
      header: t("credit"),
      cell: (info) => (
        <Badge className="bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100">
          {thbFormatter.format(info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor("parentId", {
      header: t("parent"),
      cell: (info) => {
        const parentId = info.getValue();
        return (
          <span className="text-muted-foreground">
            {parentId ? parentMap[parentId] ?? "—" : t("noParent")}
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
      onRowClick={(clinic) => router.push(`/clinic/${clinic.id}`)}
    />
  );
}
