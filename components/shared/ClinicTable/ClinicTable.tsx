"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { thbFormatter } from "@/lib/utils";
import { type SortDirection } from "@/lib/sorting";
import { type Clinic } from "@/lib/api/clinics";
import { WDataTable } from "@/components/shared/WDataTable";
import { useRouter } from "@/i18n/navigation";

type Props = {
  data: Clinic[];
  allClinics: Clinic[];
  sortBy: string;
  sortDir: SortDirection;
  onSort: (columnId: string) => void;
};

const columnHelper = createColumnHelper<Clinic>();

export function ClinicTable({
  data,
  allClinics,
  sortBy,
  sortDir,
  onSort,
}: Props) {
  const t = useTranslations("clinic.table");
  const router = useRouter();

  const parentMap = Object.fromEntries(
    allClinics.map((c) => [c.id, c.name])
  );

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <SortableColumnHeader
          label={t("clinicName")}
          columnId="name"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="font-semibold">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("itemsSold", {
      id: "itemsSold",
      header: () => (
        <SortableColumnHeader
          label={t("itemsSold")}
          columnId="itemsSold"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="tabular-nums">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("revenue", {
      id: "revenue",
      header: () => (
        <SortableColumnHeader
          label={t("revenue")}
          columnId="revenue"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          {thbFormatter.format(info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor("credit", {
      id: "credit",
      header: () => (
        <SortableColumnHeader
          label={t("credit")}
          columnId="credit"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <Badge className="bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100">
          {thbFormatter.format(info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor("parentId", {
      id: "parent",
      header: () => (
        <SortableColumnHeader
          label={t("parent")}
          columnId="parent"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
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
