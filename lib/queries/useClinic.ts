"use client";

import { useQuery } from "@tanstack/react-query";
import { getClinic } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

type Options = {
  enabled?: boolean;
};

export function useClinic(id: string, { enabled = true }: Options = {}) {
  return useQuery({
    queryKey: clinicKeys.detail(id),
    queryFn: () => getClinic(id),
    enabled: enabled && !!id,
  });
}
