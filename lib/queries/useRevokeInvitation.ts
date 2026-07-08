"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeInvitation } from "@/lib/api/users";
import { userKeys } from "./userKeys";

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.invitations() });
    },
  });
}
