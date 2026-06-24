import { auth } from "@/lib/firebase";

export type ClinicResponse = {
  id: string;
  group_id: string;
  parent_clinic_id?: string | null;
  name: string;
  address_street: string;
  address_city: string;
  address_code: string;
  contact_email: string;
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
    itemsSold: 0,
    revenue: 0,
    credit: 0,
    parentId: row.parent_clinic_id ?? null,
  };
}

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

export async function listClinics(): Promise<Clinic[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics`, {
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
