"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateClinicContact,
  type UpdateClinicContactPayload,
} from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

export function useUpdateClinicContact(clinicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClinicContactPayload) =>
      updateClinicContact(clinicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.detail(clinicId) });
      queryClient.invalidateQueries({ queryKey: clinicKeys.all });
    },
  });
}
