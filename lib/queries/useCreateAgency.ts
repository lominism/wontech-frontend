"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgency } from "@/lib/api/agencies";
import { agencyKeys } from "./agencyKeys";

export function useCreateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createAgency(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
    },
  });
}
