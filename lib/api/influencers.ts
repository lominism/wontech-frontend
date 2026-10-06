import { auth } from "@/lib/firebase";

export const INFLUENCER_PAGE_SIZE = 10;

export type InfluencerResponse = {
  id: string;
  agency_id?: string | null;
  agency_name?: string | null;
  name: string;
  address_street: string;
  address_city: string;
  address_code: string;
  contact_email: string;
  contact_phone?: string | null;
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

/** Normalized influencer shape used by influencer UI components. */
export type Influencer = {
  id: string;
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  itemsSold: number;
  revenue: number;
  credit: number;
  agencyId: string | null;
  agencyName: string | null;
};

export function mapInfluencerResponse(row: InfluencerResponse): Influencer {
  return {
    id: row.id,
    name: row.name,
    addressStreet: row.address_street,
    addressCity: row.address_city,
    addressCode: row.address_code,
    contactEmail: row.contact_email ?? null,
    contactPhone: row.contact_phone ?? null,
    itemsSold: row.items_sold ?? 0,
    revenue: row.revenue ?? 0,
    credit: row.credit ?? 0,
    agencyId: row.agency_id ?? null,
    agencyName: row.agency_name ?? null,
  };
}

export type InfluencerListResult = {
  items: Influencer[];
  total: number;
  page: number;
  pageSize: number;
};

export function formatInfluencerAddress(
  influencer: Pick<Influencer, "addressStreet" | "addressCity" | "addressCode">
): string {
  return `${influencer.addressStreet}\n${influencer.addressCity}, THAILAND\n${influencer.addressCode}`;
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type ListInfluencersParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

export async function listInfluencersPaginated(
  params: ListInfluencersParams = {}
): Promise<InfluencerListResult> {
  const query = new URLSearchParams();
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? INFLUENCER_PAGE_SIZE));
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.sortDir) {
    query.set("sortDir", params.sortDir);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/influencers?${query.toString()}`,
    { headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load influencers");
  }

  const body = (await res.json()) as {
    items: InfluencerResponse[];
    total: number;
    page: number;
    pageSize: number;
  };

  return {
    items: body.items.map(mapInfluencerResponse),
    total: body.total,
    page: body.page,
    pageSize: body.pageSize,
  };
}

export async function listInfluencersLookup(): Promise<Influencer[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/lookup`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load influencers");
  }

  const rows = (await res.json()) as InfluencerResponse[];
  return rows.map(mapInfluencerResponse);
}

export async function getInfluencer(id: string): Promise<Influencer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${id}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load influencer");
  }

  const row = (await res.json()) as InfluencerResponse;
  return mapInfluencerResponse(row);
}

export async function getInfluencerCreditLedger(
  influencerId: string
): Promise<CreditLedgerRecord[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/influencers/${influencerId}/credit-ledger`,
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

export async function adjustInfluencerCredit(
  influencerId: string,
  payload: AdjustCreditPayload
): Promise<CreditLedgerRecord> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/influencers/${influencerId}/credit-adjustment`,
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

export type CreateInfluencerPayload = {
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  contactPhone: string;
  agencyId?: string | null;
  newAgencyName?: string | null;
};

export async function createInfluencer(
  payload: CreateInfluencerPayload
): Promise<Influencer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create influencer");
  }

  const row = (await res.json()) as InfluencerResponse;
  return mapInfluencerResponse(row);
}

export async function deleteInfluencer(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${id}`, {
    method: "DELETE",
    headers: {
      ...(await authHeaders()),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || "Failed to delete influencer";
    try {
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed?.message) message = parsed.message;
    } catch {
      // Non-JSON error body; fall back to the raw text.
    }
    throw new Error(message);
  }
}

export type UpdateInfluencerContactPayload = {
  addressStreet?: string;
  addressCity?: string;
  addressCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  agencyId?: string | null;
};

export async function updateInfluencerContact(
  id: string,
  payload: UpdateInfluencerContactPayload
): Promise<Influencer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update influencer");
  }

  const row = (await res.json()) as InfluencerResponse;
  return mapInfluencerResponse(row);
}
