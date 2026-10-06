"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInfluencer, type CreateInfluencerPayload } from "@/lib/api/influencers";
import { agencyKeys } from "./agencyKeys";
import { influencerKeys } from "./influencerKeys";

export function useCreateInfluencer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInfluencerPayload) => createInfluencer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
    },
  });
}
