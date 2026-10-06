"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInfluencer } from "@/lib/api/influencers";
import { influencerKeys } from "./influencerKeys";

export function useDeleteInfluencer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInfluencer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}
