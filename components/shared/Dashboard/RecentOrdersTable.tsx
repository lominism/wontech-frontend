"use client";

import { createColumnHelper } from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WDataTable } from "@/components/shared/WDataTable";
import { mockRecentOrders, type DashboardOrder } from "@/lib/mock-data";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const columnHelper = createColumnHelper<DashboardOrder>();

const columns = [
  columnHelper.accessor("orderNo", {
    header: "Order",
    cell: (info) => (
      <span className="font-semibold text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => (
      <span className="text-muted-foreground tabular-nums">
        {dateFormatter.format(new Date(info.getValue()))}
      </span>
    ),
  }),
  columnHelper.accessor("item", {
    header: "Item",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    cell: (info) => (
      <span className="text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("clinic", {
    header: "Clinic",
    cell: (info) => (
      <span className="text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("qty", {
    header: "Qty",
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
  }),
];

export function RecentOrdersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders across all clinics</CardDescription>
      </CardHeader>
      <CardContent>
        <WDataTable columns={columns} data={mockRecentOrders} />
      </CardContent>
    </Card>
  );
}
