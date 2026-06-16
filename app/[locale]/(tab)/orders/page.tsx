"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { mockRecentOrders } from "@/lib/mock-data";
import { OrdersToolbar } from "@/components/shared/OrdersTable/OrdersToolbar";
import { OrdersTable } from "@/components/shared/OrdersTable/OrdersTable";

export default function OrdersPage() {
  const t = useTranslations("orders");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return mockRecentOrders.filter((order) => {
      const matchesSearch =
        order.orderNo.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query);
      const matchesStatus = status === "all" || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>

      <OrdersToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <OrdersTable data={filtered} />
    </div>
  );
}
