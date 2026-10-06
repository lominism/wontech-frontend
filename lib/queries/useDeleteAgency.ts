"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAgency } from "@/lib/api/agencies";
import { agencyKeys } from "./agencyKeys";
import { influencerKeys } from "./influencerKeys";

export function useDeleteAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}
