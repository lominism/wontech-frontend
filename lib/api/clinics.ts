import { auth } from "@/lib/firebase";

export const CLINIC_PAGE_SIZE = 10;

export type ClinicResponse = {
  id: string;
  group_id: string;
  parent_clinic_id?: string | null;
  name: string;
  address_street: string;
  address_city: string;
  address_code: string;
  contact_email: string;
  items_sold: number;
  revenue: number;
  credit: number;
};

export type CreditLedgerReason = "commission" | "adjustment" | "redemption";

export type CreditLedgerRecord = {
  id: string;
  date: string;
  creditChange: number;
  userName: string;
  reason: CreditLedgerReason;
  note: string | null;
};

/** Normalized clinic shape used by clinic UI components. */
export type Clinic = {
  id: string;
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  itemsSold: number;
  revenue: number;
  credit: number;
  parentId: string | null;
};

export function mapClinicResponse(row: ClinicResponse): Clinic {
  return {
    id: row.id,
    name: row.name,
    addressStreet: row.address_street,
    addressCity: row.address_city,
    addressCode: row.address_code,
    itemsSold: row.items_sold ?? 0,
    revenue: row.revenue ?? 0,
    credit: row.credit ?? 0,
    parentId: row.parent_clinic_id ?? null,
  };
}

export type ClinicListResult = {
  items: Clinic[];
  total: number;
  page: number;
  pageSize: number;
};

export function formatClinicAddress(
  clinic: Pick<Clinic, "addressStreet" | "addressCity" | "addressCode">
): string {
  return `${clinic.addressStreet}\n${clinic.addressCity}, THAILAND\n${clinic.addressCode}`;
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type ListClinicsParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

export async function listClinicsPaginated(
  params: ListClinicsParams = {}
): Promise<ClinicListResult> {
  const query = new URLSearchParams();
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? CLINIC_PAGE_SIZE));
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.sortDir) {
    query.set("sortDir", params.sortDir);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinics?${query.toString()}`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load clinics");
  }

  const body = (await res.json()) as {
    items: ClinicResponse[];
    total: number;
    page: number;
    pageSize: number;
  };

  return {
    items: body.items.map(mapClinicResponse),
    total: body.total,
    page: body.page,
    pageSize: body.pageSize,
  };
}

export async function listClinicsLookup(): Promise<Clinic[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics/lookup`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load clinics");
  }

  const rows = (await res.json()) as ClinicResponse[];
  return rows.map(mapClinicResponse);
}

export async function getClinic(id: string): Promise<Clinic> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics/${id}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load clinic");
  }

  const row = (await res.json()) as ClinicResponse;
  return mapClinicResponse(row);
}

export async function getClinicCreditLedger(
  clinicId: string
): Promise<CreditLedgerRecord[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinicId}/credit-ledger`,
    {
      headers: await authHeaders(),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load credit history");
  }

  return res.json() as Promise<CreditLedgerRecord[]>;
}

export type AdjustCreditPayload = {
  amount: number;
  direction: "increase" | "decrease";
  note?: string | null;
};

export async function adjustClinicCredit(
  clinicId: string,
  payload: AdjustCreditPayload
): Promise<CreditLedgerRecord> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinicId}/credit-adjustment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to adjust credit");
  }

  return res.json() as Promise<CreditLedgerRecord>;
}

export type CreateClinicPayload = {
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  parentClinicId?: string | null;
  newParentName?: string | null;
};

export async function createClinic(
  payload: CreateClinicPayload
): Promise<Clinic> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create clinic");
  }

  const row = (await res.json()) as ClinicResponse;
  return mapClinicResponse(row);
}
