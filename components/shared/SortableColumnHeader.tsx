"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { type SortDirection } from "@/lib/sorting";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  columnId: string;
  sortBy?: string;
  sortDir?: SortDirection;
  onSort: (columnId: string) => void;
  className?: string;
};

export function SortableColumnHeader({
  label,
  columnId,
  sortBy,
  sortDir,
  onSort,
  className,
}: Props) {
  const isActive = sortBy === columnId;

  return (
    <button
      type="button"
      onClick={() => onSort(columnId)}
      className={cn(
        "inline-flex items-center gap-1.5 text-left font-semibold text-primary transition-colors hover:text-primary/80",
        className
      )}
      aria-sort={
        isActive
          ? sortDir === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <span>{label}</span>
      {isActive ? (
        sortDir === "asc" ? (
          <ArrowUp className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ArrowDown className="size-3.5 shrink-0" aria-hidden />
        )
      ) : (
        <ArrowUpDown
          className="size-3.5 shrink-0 opacity-40"
          aria-hidden
        />
      )}
    </button>
  );
}
