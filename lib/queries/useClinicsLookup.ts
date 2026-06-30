"use client";

import { useQuery } from "@tanstack/react-query";
import { listClinicsLookup } from "@/lib/api/clinics";
import { clinicKeys } from "./clinicKeys";

type Options = {
  enabled?: boolean;
};

export function useClinicsLookup({ enabled = true }: Options = {}) {
  return useQuery({
    queryKey: clinicKeys.lookup(),
    queryFn: listClinicsLookup,
    enabled,
  });
}
