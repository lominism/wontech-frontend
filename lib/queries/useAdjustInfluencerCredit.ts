"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adjustInfluencerCredit,
  type AdjustCreditPayload,
} from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

export function useAdjustInfluencerCredit(influencerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustCreditPayload) =>
      adjustInfluencerCredit(influencerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: influencerKeys.creditLedger(influencerId),
      });
      queryClient.invalidateQueries({ queryKey: influencerKeys.detail(influencerId) });
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}
