"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateInfluencerContact,
  type UpdateInfluencerContactPayload,
} from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

export function useUpdateInfluencerContact(influencerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateInfluencerContactPayload) =>
      updateInfluencerContact(influencerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.detail(influencerId) });
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}
