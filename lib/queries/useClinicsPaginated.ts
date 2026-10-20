"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  CLINIC_PAGE_SIZE,
  listClinicsPaginated,
  type ClinicListFilter,
  type ListClinicsParams,
} from "@/lib/api/clinics";
import { CLINIC_DEFAULT_SORT } from "@/lib/sorting";
import { clinicKeys } from "./clinicKeys";

type Options = ListClinicsParams & {
  enabled?: boolean;
};

export function useClinicsPaginated({
  search = "",
  page = 1,
  pageSize = CLINIC_PAGE_SIZE,
  sortBy = CLINIC_DEFAULT_SORT.sortBy,
  sortDir = CLINIC_DEFAULT_SORT.sortDir,
  filter = "all",
  enabled = true,
}: Options = {}) {
  const resolvedFilter: ClinicListFilter = filter;

  return useQuery({
    queryKey: clinicKeys.list({
      search,
      page,
      pageSize,
      sortBy,
      sortDir,
      filter: resolvedFilter,
    }),
    queryFn: () =>
      listClinicsPaginated({
        search,
        page,
        pageSize,
        sortBy,
        sortDir,
        filter: resolvedFilter,
      }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
