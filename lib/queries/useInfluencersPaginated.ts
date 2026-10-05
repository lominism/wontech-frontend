"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  INFLUENCER_PAGE_SIZE,
  listInfluencersPaginated,
  type ListInfluencersParams,
} from "@/lib/api/influencers";
import { INFLUENCER_DEFAULT_SORT } from "@/lib/sorting";
import { influencerKeys } from "./influencerKeys";

type Options = ListInfluencersParams & {
  enabled?: boolean;
};

export function useInfluencersPaginated({
  search = "",
  page = 1,
  pageSize = INFLUENCER_PAGE_SIZE,
  sortBy = INFLUENCER_DEFAULT_SORT.sortBy,
  sortDir = INFLUENCER_DEFAULT_SORT.sortDir,
  enabled = true,
}: Options = {}) {
  return useQuery({
    queryKey: influencerKeys.list({ search, page, pageSize, sortBy, sortDir }),
    queryFn: () =>
      listInfluencersPaginated({ search, page, pageSize, sortBy, sortDir }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
