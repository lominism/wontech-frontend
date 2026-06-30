"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { type Order } from "@/lib/api/orders";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import {
  ORDER_DEFAULT_SORT,
  toggleSort,
  type SortDirection,
} from "@/lib/sorting";
import { useOrders } from "@/lib/queries/useOrders";
import { OrdersToolbar } from "@/components/shared/OrdersTable/OrdersToolbar";
import { OrdersTable } from "@/components/shared/OrdersTable/OrdersTable";
import { OrdersPagination } from "@/components/shared/OrdersTable/OrdersPagination";
import { OrderDetailDialog } from "@/components/shared/OrdersTable/OrderDetailDialog";
import { NewOrderDialog } from "@/components/shared/OrdersTable/NewOrderDialog";

export default function OrdersPage() {
  const t = useTranslations("orders");
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
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, sortBy, sortDir]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useOrders({
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

  const handleOrderClick = (order: Order) => {
    setSelectedOrderId(order.id);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedOrderId(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
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

      <OrdersToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        onNewOrder={() => setNewOrderOpen(true)}
      />

      <div
        className={
          isRefreshing ? "opacity-60 transition-opacity" : undefined
        }
      >
        <OrdersTable
          data={orders}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onOrderClick={handleOrderClick}
        />
      </div>

      <OrdersPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      <OrderDetailDialog
        orderId={selectedOrderId}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
      />

      <NewOrderDialog
        open={newOrderOpen}
        onOpenChange={setNewOrderOpen}
      />
    </div>
  );
}
