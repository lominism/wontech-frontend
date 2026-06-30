/**
 * Static mock data for the front-end shell.
 *
 * This is intentionally hardcoded — there is no backend wired up yet.
 * Replace these with real API calls when the backend is rebuilt.
 */

export type Workspace = {
  id: string;
  name: string;
  logo: string;
  role: string;
  plan: string;
};

export type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  joinedAt: string;
};

export type Personnel = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
};

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Corporation",
    logo: "",
    role: "Owner",
    plan: "Pro",
  },
  {
    id: "ws-2",
    name: "Globex Industries",
    logo: "",
    role: "Admin",
    plan: "Free",
  },
  {
    id: "ws-3",
    name: "Initech",
    logo: "",
    role: "Member",
    plan: "Free",
  },
];

export const mockCurrentUser: CurrentUser = {
  firstName: "Jane",
  lastName: "Cooper",
  email: "jane.cooper@example.com",
  avatar: "",
};

export const mockMembers: Member[] = [
  {
    id: "m-1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "Owner",
    status: "Active",
    joinedAt: "2025-01-12",
  },
  {
    id: "m-2",
    name: "Wade Warren",
    email: "wade.warren@example.com",
    role: "Admin",
    status: "Active",
    joinedAt: "2025-02-03",
  },
  {
    id: "m-3",
    name: "Esther Howard",
    email: "esther.howard@example.com",
    role: "Member",
    status: "Active",
    joinedAt: "2025-03-21",
  },
  {
    id: "m-4",
    name: "Cameron Williamson",
    email: "cameron.w@example.com",
    role: "Member",
    status: "Invited",
    joinedAt: "2025-05-09",
  },
  {
    id: "m-5",
    name: "Brooklyn Simmons",
    email: "brooklyn.s@example.com",
    role: "Viewer",
    status: "Suspended",
    joinedAt: "2025-04-17",
  },
];

import type { Clinic } from "@/lib/api/clinics";

export type { Clinic };

export const mockClinics: Clinic[] = [
  { id: "c-1", name: "Wontech Central Clinic", addressStreet: "88 Sukhumvit Soi 24", addressCity: "Khlong Toei, Bangkok", addressCode: "10110", itemsSold: 0,  revenue: 0,     credit: 0,    parentId: null },
  { id: "c-2", name: "Siam Skin & Wellness",   addressStreet: "12 Rama I Rd", addressCity: "Pathum Wan, Bangkok", addressCode: "10330", itemsSold: 14, revenue: 42000, credit: 3200, parentId: null },
  { id: "c-3", name: "Siam Skin — Sukhumvit",  addressStreet: "101 Sukhumvit Rd", addressCity: "Watthana, Bangkok", addressCode: "10110", itemsSold: 8,  revenue: 24000, credit: 3200, parentId: "c-2" },
  { id: "c-4", name: "Siam Skin — Silom",      addressStreet: "45 Silom Rd", addressCity: "Bang Rak, Bangkok", addressCode: "10500", itemsSold: 5,  revenue: 15000, credit: 3200, parentId: "c-2" },
  { id: "c-5", name: "Radiance MedSpa",        addressStreet: "200 Phahonyothin Rd", addressCity: "Chatuchak, Bangkok", addressCode: "10900", itemsSold: 22, revenue: 66000, credit: 5800, parentId: null },
  { id: "c-6", name: "Radiance MedSpa — Ari",  addressStreet: "8 Ari Soi 1", addressCity: "Phaya Thai, Bangkok", addressCode: "10400", itemsSold: 11, revenue: 33000, credit: 5800, parentId: "c-5" },
  { id: "c-7", name: "Glow Clinic",            addressStreet: "33 Thong Lo Soi 13", addressCity: "Watthana, Bangkok", addressCode: "10110", itemsSold: 3,  revenue: 9000,  credit: 750,  parentId: null },
];

/** Top-level clinics that can be selected as a parent organization. */
export function getParentClinicOptions(clinics: Clinic[] = mockClinics): Clinic[] {
  return clinics
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** True when other clinics list this clinic as their parent (org-level, not a branch). */
export function isParentClinic(
  clinicId: string,
  clinics: Clinic[] = mockClinics
): boolean {
  return clinics.some((c) => c.parentId === clinicId);
}

/** Clinics shown in the list: standalone locations and branches, not parent orgs. */
export function getListableClinics(clinics: Clinic[] = mockClinics): Clinic[] {
  return clinics.filter((c) => !isParentClinic(c.id, clinics));
}

/** All branches in the same group (siblings under a parent, or children of a parent). */
export function getClinicBranches(
  clinic: Clinic,
  clinics: Clinic[] = mockClinics
): Clinic[] {
  if (clinic.parentId) {
    return clinics.filter((c) => c.parentId === clinic.parentId);
  }
  return clinics.filter((c) => c.parentId === clinic.id);
}

// Recent orders table (dashboard mock only).
export type DashboardOrderStatus = "Awaiting Shipment" | "Shipped";

export type DashboardOrder = {
  id: string;
  orderNo: string;
  date: string;
  item: string;
  customer: string;
  clinic: string;
  qty: number;
  status: DashboardOrderStatus;
  total: number;
};

export const mockRecentOrders: DashboardOrder[] = [
  { id: "o-1",  orderNo: "#WT-10428", date: "2026-06-14", item: "HydraGlow Serum 30ml",            customer: "Wade Warren",        clinic: "Siam Skin & Wellness", qty: 12, status: "Shipped",           total: 15480 },
  { id: "o-2",  orderNo: "#WT-10427", date: "2026-06-13", item: "LED Therapy Mask",               customer: "Esther Howard",      clinic: "Radiance MedSpa",      qty: 2,  status: "Awaiting Shipment", total: 17800 },
  { id: "o-3",  orderNo: "#WT-10426", date: "2026-06-12", item: "Collagen Boost Capsules",        customer: "Cameron Williamson", clinic: "Glow Clinic",          qty: 30, status: "Awaiting Shipment", total: 29700 },
  { id: "o-4",  orderNo: "#WT-10425", date: "2026-06-11", item: "Vitamin C Brightening Cream",    customer: "Brooklyn Simmons",   clinic: "Siam Skin & Wellness", qty: 4,  status: "Shipped",           total: 6360  },
  { id: "o-5",  orderNo: "#WT-10424", date: "2026-06-10", item: "Marine Collagen Powder",         customer: "Robert Fox",         clinic: "Radiance MedSpa",      qty: 8,  status: "Shipped",           total: 11920 },
  { id: "o-6",  orderNo: "#WT-10423", date: "2026-06-09", item: "Microcurrent Facial Wand",       customer: "Jenny Wilson",       clinic: "Glow Clinic",          qty: 3,  status: "Awaiting Shipment", total: 19500 },
  { id: "o-7",  orderNo: "#WT-10422", date: "2026-06-08", item: "Disposable Treatment Masks",     customer: "Guy Hawkins",        clinic: "Siam Skin & Wellness", qty: 25, status: "Shipped",           total: 11250 },
  { id: "o-8",  orderNo: "#WT-10421", date: "2026-06-07", item: "Nitrile Gloves (100pk)",         customer: "Kristin Watson",     clinic: "Radiance MedSpa",      qty: 18, status: "Awaiting Shipment", total: 5040  },
  { id: "o-9",  orderNo: "#WT-10420", date: "2026-06-06", item: "HydraGlow Serum 30ml",           customer: "Jane Cooper",        clinic: "Glow Clinic",          qty: 6,  status: "Shipped",           total: 7740  },
  { id: "o-10", orderNo: "#WT-10419", date: "2026-06-05", item: "LED Therapy Mask",               customer: "Wade Warren",        clinic: "Siam Skin & Wellness", qty: 1,  status: "Awaiting Shipment", total: 8900  },
  { id: "o-11", orderNo: "#WT-10418", date: "2026-06-04", item: "Marine Collagen Powder",         customer: "Esther Howard",      clinic: "Radiance MedSpa",      qty: 14, status: "Shipped",           total: 20860 },
  { id: "o-12", orderNo: "#WT-10417", date: "2026-06-03", item: "Collagen Boost Capsules",        customer: "Cameron Williamson", clinic: "Glow Clinic",          qty: 9,  status: "Shipped",           total: 8910  },
];

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  commission: number | null;
  stock: number;
  image?: string | null;
};

export const productCategories = [
  "Skincare",
  "Devices",
  "Consumables",
  "Supplements",
] as const;

export const mockProducts: Product[] = [
  { id: "prod-1", name: "HydraGlow Serum 30ml",               sku: "WT-SK-001", category: "Skincare",     price: 1290, commission: 129,  stock: 142, image: null },
  { id: "prod-2", name: "Vitamin C Brightening Cream",         sku: "WT-SK-002", category: "Skincare",     price: 1590, commission: 159,  stock: 8,   image: null },
  { id: "prod-3", name: "LED Therapy Mask",                    sku: "WT-DV-001", category: "Devices",      price: 8900, commission: 890,  stock: 23,  image: null },
  { id: "prod-4", name: "Microcurrent Facial Wand",            sku: "WT-DV-002", category: "Devices",      price: 6500, commission: null, stock: 0,   image: null },
  { id: "prod-5", name: "Disposable Treatment Masks (50pk)",   sku: "WT-CN-001", category: "Consumables",  price: 450,  commission: null, stock: 320, image: null },
  { id: "prod-6", name: "Nitrile Gloves (100pk)",              sku: "WT-CN-002", category: "Consumables",  price: 280,  commission: null, stock: 56,  image: null },
  { id: "prod-7", name: "Collagen Boost Capsules",             sku: "WT-SP-001", category: "Supplements",  price: 990,  commission: 99,   stock: 4,   image: null },
  { id: "prod-8", name: "Marine Collagen Powder",              sku: "WT-SP-002", category: "Supplements",  price: 1490, commission: 149,  stock: 78,  image: null },
];

// Richer ecommerce detail shown on the product detail page. Kept separate from
// the catalog row so the table/grid stay lightweight.
export type ProductDetails = {
  description: string;
  brand: string;
  weight: string;
  dimensions: string;
  origin: string;
};

export const mockProductDetails: Record<string, ProductDetails> = {
  "prod-1": {
    description:
      "A lightweight hydrating serum infused with hyaluronic acid and botanical extracts. Absorbs quickly to plump and smooth skin, leaving a dewy, radiant finish.",
    brand: "Wontech Labs",
    weight: "30 ml",
    dimensions: "3 x 3 x 11 cm",
    origin: "South Korea",
  },
  "prod-2": {
    description:
      "Brightening day cream with stabilized Vitamin C to even skin tone and reduce the appearance of dark spots over time. Non-greasy and suitable for daily use.",
    brand: "Wontech Labs",
    weight: "50 g",
    dimensions: "6 x 6 x 5 cm",
    origin: "South Korea",
  },
  "prod-3": {
    description:
      "Clinical-grade LED therapy mask delivering red and blue light wavelengths to support skin renewal and target blemishes. Rechargeable with a 20-minute auto-timer.",
    brand: "Wontech Devices",
    weight: "420 g",
    dimensions: "24 x 19 x 12 cm",
    origin: "China",
  },
  "prod-4": {
    description:
      "Handheld microcurrent wand that delivers gentle electrical stimulation to tone and lift facial muscles. Includes conductive gel and a USB-C charging cable.",
    brand: "Wontech Devices",
    weight: "180 g",
    dimensions: "16 x 5 x 5 cm",
    origin: "China",
  },
  "prod-5": {
    description:
      "Box of 50 single-use treatment masks made from soft, breathable non-woven fabric. Ideal for serum and mask applications during in-clinic facials.",
    brand: "Wontech Essentials",
    weight: "500 g",
    dimensions: "22 x 15 x 10 cm",
    origin: "Thailand",
  },
  "prod-6": {
    description:
      "Box of 100 powder-free nitrile examination gloves. Latex-free, textured fingertips for grip, suitable for sensitive skin.",
    brand: "Wontech Essentials",
    weight: "1.1 kg",
    dimensions: "24 x 12 x 8 cm",
    origin: "Malaysia",
  },
  "prod-7": {
    description:
      "Daily collagen supplement capsules formulated to support skin elasticity and hydration from within. 60 capsules per bottle.",
    brand: "Wontech Nutrition",
    weight: "90 g",
    dimensions: "6 x 6 x 11 cm",
    origin: "Japan",
  },
  "prod-8": {
    description:
      "Premium marine collagen peptide powder, unflavored and easily dissolved into drinks. Supports skin, hair, and joint health.",
    brand: "Wontech Nutrition",
    weight: "300 g",
    dimensions: "10 x 10 x 14 cm",
    origin: "Japan",
  },
};

export type PurchaseRecord = {
  id: string;
  productId: string;
  date: string; // ISO date
  quantity: number;
  clinicName: string;
};

export const mockPurchaseHistory: PurchaseRecord[] = [
  { id: "ph-1",  productId: "prod-1", date: "2026-06-02", quantity: 12, clinicName: "Siam Skin & Wellness" },
  { id: "ph-2",  productId: "prod-1", date: "2026-05-21", quantity: 6,  clinicName: "Radiance MedSpa" },
  { id: "ph-3",  productId: "prod-1", date: "2026-05-09", quantity: 20, clinicName: "Glow Clinic" },
  { id: "ph-4",  productId: "prod-2", date: "2026-06-10", quantity: 4,  clinicName: "Siam Skin — Sukhumvit" },
  { id: "ph-5",  productId: "prod-2", date: "2026-04-28", quantity: 9,  clinicName: "Radiance MedSpa — Ari" },
  { id: "ph-6",  productId: "prod-3", date: "2026-06-01", quantity: 2,  clinicName: "Radiance MedSpa" },
  { id: "ph-7",  productId: "prod-3", date: "2026-03-15", quantity: 1,  clinicName: "Siam Skin & Wellness" },
  { id: "ph-8",  productId: "prod-7", date: "2026-06-12", quantity: 30, clinicName: "Glow Clinic" },
  { id: "ph-9",  productId: "prod-7", date: "2026-05-30", quantity: 15, clinicName: "Siam Skin — Silom" },
  { id: "ph-10", productId: "prod-8", date: "2026-06-08", quantity: 8,  clinicName: "Radiance MedSpa" },
];

/* ============================================================
   Dashboard mock data
   ============================================================ */

// The stat cards (Total Revenue / Orders) can be filtered by time range.
export type DashboardRange = "lastYear" | "last3Months" | "lastWeek";

export const dashboardRangeOptions: { value: DashboardRange; label: string }[] =
  [
    { value: "lastYear", label: "Last Year" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "lastWeek", label: "Last Week" },
  ];

export type RangedMetric = {
  // Headline value for the card
  value: number;
  // % change versus the previous comparable period
  change: number;
  // Tiny trend series powering the sparkline
  trend: { label: string; value: number }[];
};

export const mockRevenueByRange: Record<DashboardRange, RangedMetric> = {
  lastYear: {
    value: 4825000,
    change: 12.4,
    trend: [
      { label: "Q1", value: 980000 },
      { label: "Q2", value: 1120000 },
      { label: "Q3", value: 1340000 },
      { label: "Q4", value: 1385000 },
    ],
  },
  last3Months: {
    value: 1385000,
    change: 8.2,
    trend: [
      { label: "Apr", value: 412000 },
      { label: "May", value: 468000 },
      { label: "Jun", value: 505000 },
    ],
  },
  lastWeek: {
    value: 128400,
    change: -3.1,
    trend: [
      { label: "Mon", value: 18200 },
      { label: "Tue", value: 21400 },
      { label: "Wed", value: 17600 },
      { label: "Thu", value: 24800 },
      { label: "Fri", value: 22100 },
      { label: "Sat", value: 14300 },
      { label: "Sun", value: 10000 },
    ],
  },
};

export const mockOrdersByRange: Record<DashboardRange, RangedMetric> = {
  lastYear: {
    value: 3120,
    change: 9.6,
    trend: [
      { label: "Q1", value: 690 },
      { label: "Q2", value: 742 },
      { label: "Q3", value: 838 },
      { label: "Q4", value: 850 },
    ],
  },
  last3Months: {
    value: 868,
    change: 5.4,
    trend: [
      { label: "Apr", value: 268 },
      { label: "May", value: 291 },
      { label: "Jun", value: 309 },
    ],
  },
  lastWeek: {
    value: 74,
    change: 2.8,
    trend: [
      { label: "Mon", value: 11 },
      { label: "Tue", value: 13 },
      { label: "Wed", value: 9 },
      { label: "Thu", value: 15 },
      { label: "Fri", value: 12 },
      { label: "Sat", value: 8 },
      { label: "Sun", value: 6 },
    ],
  },
};

// Units Sold and Active Clinics are single fixed figures (no time filter).
export const mockUnitsSold: RangedMetric = {
  value: 12840,
  change: 6.7,
  trend: [
    { label: "Mon", value: 1620 },
    { label: "Tue", value: 1880 },
    { label: "Wed", value: 1740 },
    { label: "Thu", value: 2010 },
    { label: "Fri", value: 1960 },
    { label: "Sat", value: 1740 },
    { label: "Sun", value: 1890 },
  ],
};

export const mockActiveClinics: RangedMetric = {
  value: 86,
  change: 4.2,
  trend: [
    { label: "Jan", value: 72 },
    { label: "Feb", value: 75 },
    { label: "Mar", value: 78 },
    { label: "Apr", value: 80 },
    { label: "May", value: 83 },
    { label: "Jun", value: 86 },
  ],
};

// Revenue overview area chart — monthly revenue vs. credit.
export const mockRevenueOverview = [
  { month: "Jan", revenue: 320000, credit: 48000 },
  { month: "Feb", revenue: 358000, credit: 52000 },
  { month: "Mar", revenue: 402000, credit: 61000 },
  { month: "Apr", revenue: 412000, credit: 58000 },
  { month: "May", revenue: 468000, credit: 67000 },
  { month: "Jun", revenue: 505000, credit: 72000 },
];

// Sales by category donut chart.
export const mockSalesByCategory = [
  { category: "skincare", value: 1860000, fill: "var(--color-skincare)" },
  { category: "devices", value: 1420000, fill: "var(--color-devices)" },
  { category: "consumables", value: 920000, fill: "var(--color-consumables)" },
  { category: "supplements", value: 625000, fill: "var(--color-supplements)" },
];

export const mockPersonnel: Personnel[] = [
  {
    id: "p-1",
    name: "Robert Fox",
    position: "Field Technician",
    department: "Operations",
    email: "robert.fox@example.com",
    phone: "+66 81 234 5678",
  },
  {
    id: "p-2",
    name: "Jenny Wilson",
    position: "Maintenance Lead",
    department: "Facilities",
    email: "jenny.wilson@example.com",
    phone: "+66 82 345 6789",
  },
  {
    id: "p-3",
    name: "Guy Hawkins",
    position: "Inventory Clerk",
    department: "Warehouse",
    email: "guy.hawkins@example.com",
    phone: "+66 83 456 7890",
  },
  {
    id: "p-4",
    name: "Kristin Watson",
    position: "Site Supervisor",
    department: "Operations",
    email: "kristin.watson@example.com",
    phone: "+66 84 567 8901",
  },
];
