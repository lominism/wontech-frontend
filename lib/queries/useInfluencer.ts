"use client";

import { useQuery } from "@tanstack/react-query";
import { getInfluencer } from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

type Options = {
  enabled?: boolean;
};

export function useInfluencer(id: string, { enabled = true }: Options = {}) {
  return useQuery({
    queryKey: influencerKeys.detail(id),
    queryFn: () => getInfluencer(id),
    enabled: enabled && !!id,
  });
}
