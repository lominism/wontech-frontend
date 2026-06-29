"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicTracking } from "@/lib/api/public";
import { publicTrackKeys } from "./publicKeys";

type Options = {
  enabled?: boolean;
};

export function usePublicTracking(token: string, { enabled = true }: Options = {}) {
  return useQuery({
    queryKey: publicTrackKeys.detail(token),
    queryFn: () => getPublicTracking(token),
    enabled: enabled && !!token,
  });
}
