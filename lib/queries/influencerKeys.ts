export const influencerKeys = {
  all: ["influencers"] as const,
  lists: () => [...influencerKeys.all, "list"] as const,
  list: (params: {
    search: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
  }) => [...influencerKeys.lists(), params] as const,
  lookup: () => [...influencerKeys.all, "lookup"] as const,
  details: () => [...influencerKeys.all, "detail"] as const,
  detail: (id: string) => [...influencerKeys.details(), id] as const,
  creditLedger: (id: string) =>
    [...influencerKeys.all, "credit-ledger", id] as const,
};
