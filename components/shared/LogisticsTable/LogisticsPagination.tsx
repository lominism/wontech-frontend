"use client";

import { TablePagination } from "@/components/shared/TablePagination";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function LogisticsPagination(props: Props) {
  return <TablePagination namespace="logistics.pagination" {...props} />;
}
