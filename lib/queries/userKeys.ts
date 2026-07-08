export const userKeys = {
  all: ["users"] as const,
  members: () => [...userKeys.all, "members"] as const,
  invitations: () => [...userKeys.all, "invitations"] as const,
};
