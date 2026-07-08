"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClinic } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

export function useDeleteClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClinic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.all });
    },
  });
}
