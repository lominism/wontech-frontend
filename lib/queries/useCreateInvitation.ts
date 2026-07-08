"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvitation } from "@/lib/api/users";
import { userKeys } from "./userKeys";

export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => createInvitation(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.invitations() });
    },
  });
}
