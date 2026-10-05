"use client";

import { useQuery } from "@tanstack/react-query";
import { listInfluencersLookup } from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

type Options = {
  enabled?: boolean;
};

export function useInfluencersLookup({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: influencerKeys.lookup(),
    queryFn: listInfluencersLookup,
    enabled,
  });
}
