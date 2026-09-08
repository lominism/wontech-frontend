export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: {
    search: string;
    status: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    productId?: string;
  }) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  purchaseHistory: (productId: string, page: number) =>
    [...orderKeys.all, "purchase-history", productId, page] as const,
};
