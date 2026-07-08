"use client";

import { useQuery } from "@tanstack/react-query";
import { listInvitations } from "@/lib/api/users";
import { userKeys } from "./userKeys";

type Options = {
  enabled?: boolean;
};

export function useInvitations({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: userKeys.invitations(),
    queryFn: listInvitations,
    enabled,
  });
}
