"use client";

import { useQuery } from "@tanstack/react-query";
import { getInfluencerCreditLedger } from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

type Options = {
  enabled?: boolean;
};

export function useInfluencerCreditLedger(
  influencerId: string,
  { enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: influencerKeys.creditLedger(influencerId),
    queryFn: () => getInfluencerCreditLedger(influencerId),
    enabled: enabled && !!influencerId,
  });
}
