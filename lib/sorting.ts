export type SortDirection = "asc" | "desc";

export const CLINIC_DEFAULT_SORT = {
  sortBy: "name",
  sortDir: "asc" as SortDirection,
};

export const ORDER_DEFAULT_SORT = {
  sortBy: "date",
  sortDir: "desc" as SortDirection,
};

export function toggleSort(
  currentSortBy: string,
  currentSortDir: SortDirection,
  nextSortBy: string,
  initialDir: SortDirection = "asc"
): { sortBy: string; sortDir: SortDirection } {
  if (currentSortBy === nextSortBy) {
    return {
      sortBy: nextSortBy,
      sortDir: currentSortDir === "asc" ? "desc" : "asc",
    };
  }

  return { sortBy: nextSortBy, sortDir: initialDir };
}
