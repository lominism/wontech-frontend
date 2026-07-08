"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/api/users";
import { userKeys } from "./userKeys";

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.members() });
    },
  });
}
