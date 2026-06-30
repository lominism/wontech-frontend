export const logisticsKeys = {
  all: ["logistics"] as const,
  lists: () => [...logisticsKeys.all, "list"] as const,
  list: (params: {
    search: string;
    status: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
  }) => [...logisticsKeys.lists(), params] as const,
};
