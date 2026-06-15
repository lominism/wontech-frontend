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
