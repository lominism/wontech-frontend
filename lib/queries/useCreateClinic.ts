"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinic, type CreateClinicPayload } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

export function useCreateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClinicPayload) => createClinic(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.all });
    },
  });
}
