"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getVisiblePageNumbers } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type Props = {
  namespace: "clinic.pagination" | "orders.pagination" | "logistics.pagination";
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  namespace,
  page,
  totalPages,
  total,
  onPageChange,
}: Props) {
  const t = useTranslations(namespace);
  const pageItems = getVisiblePageNumbers(page, totalPages);

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {t("total", { count: total })}
        {totalPages > 1 && (
          <span className="ml-2">{t("pageOf", { page, totalPages })}</span>
        )}
      </p>
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t("previous")}
          </Button>
          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                variant={item === page ? "default" : "outline"}
                size="sm"
                className={cn("min-w-8 px-2", item === page && "pointer-events-none")}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            )
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
