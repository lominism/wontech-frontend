export type PaginationItem = number | "ellipsis";

/** Page numbers to show, with ellipsis when the range is large. */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 1) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 1; page <= currentPage + 1; page++) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  for (let index = 0; index < sorted.length; index++) {
    if (index > 0 && sorted[index] - sorted[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(sorted[index]);
  }

  return items;
}
