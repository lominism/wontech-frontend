export const clinicKeys = {
  all: ["clinics"] as const,
  lists: () => [...clinicKeys.all, "list"] as const,
  list: () => [...clinicKeys.lists()] as const,
  details: () => [...clinicKeys.all, "detail"] as const,
  detail: (id: string) => [...clinicKeys.details(), id] as const,
};
