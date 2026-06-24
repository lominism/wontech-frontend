"use client";

import { useQuery } from "@tanstack/react-query";
import { listClinics } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

type Options = {
  enabled?: boolean;
};

export function useClinics({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: clinicKeys.list(),
    queryFn: listClinics,
    enabled,
  });
}
