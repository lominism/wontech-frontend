"use client";

import { useQuery } from "@tanstack/react-query";
import { getInfluencerCreditLedger } from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

export const INFLUENCER_CREDIT_LEDGER_PAGE_SIZE = 10;

type Options = {
  page?: number;
  enabled?: boolean;
};

export function useInfluencerCreditLedger(
  influencerId: string,
  { page = 1, enabled = true }: Options = {}
) {
  return useQuery({
    queryKey: influencerKeys.creditLedger(influencerId, page),
    queryFn: () =>
      getInfluencerCreditLedger(influencerId, {
        page,
        pageSize: INFLUENCER_CREDIT_LEDGER_PAGE_SIZE,
      }),
    enabled: enabled && !!influencerId,
  });
}
