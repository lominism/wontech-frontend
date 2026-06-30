"use client";

import { useQuery } from "@tanstack/react-query";
import { getClinicCreditLedger } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

type Options = {
  enabled?: boolean;
};

export function useClinicCreditLedger(
  clinicId: string,
  { enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: clinicKeys.creditLedger(clinicId),
    queryFn: () => getClinicCreditLedger(clinicId),
    enabled: enabled && !!clinicId,
  });
}
