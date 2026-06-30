"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adjustClinicCredit,
  type AdjustCreditPayload,
} from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

export function useAdjustClinicCredit(clinicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustCreditPayload) =>
      adjustClinicCredit(clinicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: clinicKeys.creditLedger(clinicId),
      });
      queryClient.invalidateQueries({ queryKey: clinicKeys.detail(clinicId) });
      queryClient.invalidateQueries({ queryKey: clinicKeys.all });
    },
  });
}
