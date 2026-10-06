"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { thbFormatter } from "@/lib/utils";
import { type SortDirection } from "@/lib/sorting";
import { type Influencer } from "@/lib/api/influencers";
import { WDataTable } from "@/components/shared/WDataTable";
import { useRouter } from "@/i18n/navigation";

type Props = {
  data: Influencer[];
  sortBy: string;
  sortDir: SortDirection;
  onSort: (columnId: string) => void;
};

const columnHelper = createColumnHelper<Influencer>();

export function InfluencerTable({ data, sortBy, sortDir, onSort }: Props) {
  const t = useTranslations("influencer.table");
  const router = useRouter();

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <SortableColumnHeader
          label={t("influencerName")}
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
    columnHelper.accessor("agencyName", {
      id: "agency",
      header: () => (
        <SortableColumnHeader
          label={t("agency")}
          columnId="agency"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: (info) => (
        <span className="text-muted-foreground">
          {info.getValue() || t("noAgency")}
        </span>
      ),
    }),
  ];

  return (
    <WDataTable
      columns={columns}
      data={data}
      emptyMessage={t("empty")}
      onRowClick={(influencer) => router.push(`/influencer/${influencer.id}`)}
    />
  );
}
