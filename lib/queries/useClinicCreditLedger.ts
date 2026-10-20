"use client";

import { useQuery } from "@tanstack/react-query";
import { getClinicCreditLedger } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

export const CLINIC_CREDIT_LEDGER_PAGE_SIZE = 10;

type Options = {
  page?: number;
  enabled?: boolean;
};

export function useClinicCreditLedger(
  clinicId: string,
  { page = 1, enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: clinicKeys.creditLedger(clinicId, page),
    queryFn: () =>
      getClinicCreditLedger(clinicId, {
        page,
        pageSize: CLINIC_CREDIT_LEDGER_PAGE_SIZE,
      }),
    enabled: enabled && !!clinicId,
  });
}
