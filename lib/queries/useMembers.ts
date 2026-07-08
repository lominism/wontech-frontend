"use client";

import { useQuery } from "@tanstack/react-query";
import { listMembers } from "@/lib/api/users";
import { userKeys } from "./userKeys";

type Options = {
  enabled?: boolean;
};

export function useMembers({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: userKeys.members(),
    queryFn: listMembers,
    enabled,
  });
}
