"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import {
  ORDER_DEFAULT_SORT,
  toggleSort,
  type SortDirection,
} from "@/lib/sorting";
import { type LogisticsOrder } from "@/lib/api/logistics";
import { useLogistics } from "@/lib/queries/useLogistics";
import { LogisticsToolbar } from "@/components/shared/LogisticsTable/LogisticsToolbar";
import { LogisticsTable } from "@/components/shared/LogisticsTable/LogisticsTable";
import { LogisticsPagination } from "@/components/shared/LogisticsTable/LogisticsPagination";
import { LogisticsDetailDialog } from "@/components/shared/LogisticsTable/LogisticsDetailDialog";

export default function LogisticsPage() {
  const t = useTranslations("logistics");
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(ORDER_DEFAULT_SORT.sortBy);
  const [sortDir, setSortDir] = useState<SortDirection>(
    ORDER_DEFAULT_SORT.sortDir
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, sortBy, sortDir]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLogistics({
    search: debouncedSearch,
    status,
    page,
    sortBy,
    sortDir,
    enabled: !authLoading && !!user,
  });

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const isInitialLoading = isLoading && !data;
  const isRefreshing = isFetching && !isInitialLoading;

  const handleOrderClick = (order: LogisticsOrder) => {
    setSelectedOrderId(order.id);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedOrderId(null);
    }
  };

  const handleSort = (columnId: string) => {
    const initialDir = columnId === "date" ? "desc" : "asc";
    const next = toggleSort(sortBy, sortDir, columnId, initialDir);
    setSortBy(next.sortBy);
    setSortDir(next.sortDir);
  };

  if (authLoading || isInitialLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("page.description")}</p>
        </div>
        <div className="flex h-48 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          {t("page.loading")}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("page.description")}</p>
        </div>
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-card text-destructive">
          <p className="text-sm">{t("page.error")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("page.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>

      <LogisticsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <div
        className={
          isRefreshing ? "opacity-60 transition-opacity" : undefined
        }
      >
        <LogisticsTable
          data={orders}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onOrderClick={handleOrderClick}
        />
      </div>

      <LogisticsPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      <LogisticsDetailDialog
        orderId={selectedOrderId}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
      />
    </div>
  );
}
