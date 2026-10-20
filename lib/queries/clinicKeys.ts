export const clinicKeys = {
  all: ["clinics"] as const,
  lists: () => [...clinicKeys.all, "list"] as const,
  list: (params: {
    search: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    filter: string;
  }) => [...clinicKeys.lists(), params] as const,
  lookup: () => [...clinicKeys.all, "lookup"] as const,
  details: () => [...clinicKeys.all, "detail"] as const,
  detail: (id: string) => [...clinicKeys.details(), id] as const,
  creditLedgers: (id: string) =>
    [...clinicKeys.all, "credit-ledger", id] as const,
  creditLedger: (id: string, page: number) =>
    [...clinicKeys.creditLedgers(id), page] as const,
};
