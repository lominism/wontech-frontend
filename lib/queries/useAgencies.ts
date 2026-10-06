"use client";

import { useQuery } from "@tanstack/react-query";
import { listAgencies } from "@/lib/api/agencies";
import { agencyKeys } from "./agencyKeys";

type Options = {
  enabled?: boolean;
};

export function useAgencies({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: agencyKeys.list(),
    queryFn: listAgencies,
    enabled,
  });
}
