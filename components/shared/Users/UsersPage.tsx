"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WDataTable } from "@/components/shared/WDataTable";
import { InviteUserDialog } from "@/components/shared/Users/InviteUserDialog";
import { useAuth } from "@/providers/AuthProvider";
import { useMembers } from "@/lib/queries/useMembers";
import { useInvitations } from "@/lib/queries/useInvitations";
import { useRemoveMember } from "@/lib/queries/useRemoveMember";
import { useRevokeInvitation } from "@/lib/queries/useRevokeInvitation";
import {
  type Invitation,
  type InvitationStatus,
  type Member,
} from "@/lib/api/users";

const memberColumnHelper = createColumnHelper<Member>();
const inviteColumnHelper = createColumnHelper<Invitation>();

const statusBadgeClass: Record<InvitationStatus, string> = {
  pending: "border-amber-500 text-amber-600",
  accepted: "border-emerald-500 text-emerald-600",
  revoked: "border-red-500 text-red-600",
  expired: "border-muted-foreground/40 text-muted-foreground",
};

const roleBadgeClass: Record<string, string> = {
  owner: "border-primary bg-primary/10 text-primary font-semibold",
  admin: "border-muted-foreground/40 text-muted-foreground",
};

export function UsersPage() {
  const t = useTranslations("users");
  const locale = useLocale();
  const { profile, loading: authLoading } = useAuth();

  const isOwner = profile?.role === "owner";

  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [inviteToRevoke, setInviteToRevoke] = useState<Invitation | null>(null);

  const membersQuery = useMembers({ enabled: !authLoading && isOwner });
  const invitationsQuery = useInvitations({ enabled: !authLoading && isOwner });
  const removeMember = useRemoveMember();
  const revokeInvitation = useRevokeInvitation();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [locale]
  );

  const formatName = (
    firstName: string | null,
    lastName: string | null,
    fallback: string
  ) => {
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    return name || fallback;
  };

  const memberColumns = useMemo(
    () => [
      memberColumnHelper.accessor(
        (row) => formatName(row.firstName, row.lastName, "—"),
        {
          id: "fullName",
          header: t("table.fullName"),
          cell: (info) => (
            <span className="font-semibold">{info.getValue()}</span>
          ),
        }
      ),
      memberColumnHelper.accessor("email", {
        header: t("table.email"),
      }),
      memberColumnHelper.accessor("role", {
        header: t("table.role"),
        cell: (info) => {
          const role = info.getValue();
          return (
            <Badge variant="outline" className={roleBadgeClass[role]}>
              {t(`roles.${role}`)}
            </Badge>
          );
        },
      }),
      memberColumnHelper.accessor("createdAt", {
        header: t("table.joined"),
        cell: (info) => dateFormatter.format(new Date(info.getValue())),
      }),
      memberColumnHelper.display({
        id: "actions",
        header: t("table.actions"),
        cell: ({ row }) => {
          const member = row.original;
          const isSelf = member.id === profile?.id;
          if (member.role === "owner" || isSelf) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setMemberToRemove(member)}
            >
              <Trash2 size={14} />
              {t("remove.action")}
            </Button>
          );
        },
      }),
    ],
    [t, dateFormatter, profile?.id]
  );

  const inviteColumns = useMemo(
    () => [
      inviteColumnHelper.accessor("email", {
        header: t("table.email"),
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      inviteColumnHelper.accessor(
        (row) =>
          row.invitedByUser
            ? formatName(
                row.invitedByUser.firstName,
                row.invitedByUser.lastName,
                row.invitedByUser.email
              )
            : "—",
        {
          id: "invitedBy",
          header: t("table.invitedBy"),
        }
      ),
      inviteColumnHelper.accessor("status", {
        header: t("table.status"),
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge variant="outline" className={statusBadgeClass[status]}>
              {t(`status.${status}`)}
            </Badge>
          );
        },
      }),
      inviteColumnHelper.accessor("createdAt", {
        header: t("table.invitedAt"),
        cell: (info) => dateFormatter.format(new Date(info.getValue())),
      }),
      inviteColumnHelper.display({
        id: "actions",
        header: t("table.actions"),
        cell: ({ row }) => {
          const invite = row.original;
          if (invite.status !== "pending") {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setInviteToRevoke(invite)}
            >
              <Trash2 size={14} />
              {t("revoke.action")}
            </Button>
          );
        },
      }),
    ],
    [t, dateFormatter]
  );

  const handleRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMember.mutateAsync(memberToRemove.id);
      toast.success(t("remove.success"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("remove.error"));
    } finally {
      setMemberToRemove(null);
    }
  };

  const handleRevoke = async () => {
    if (!inviteToRevoke) return;
    try {
      await revokeInvitation.mutateAsync(inviteToRevoke.id);
      toast.success(t("revoke.success"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("revoke.error"));
    } finally {
      setInviteToRevoke(null);
    }
  };

  const header = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
    </div>
  );

  if (!authLoading && !isOwner) {
    return (
      <div className="flex flex-col gap-4">
        {header}
        <Card className="flex h-32 items-center justify-center text-muted-foreground">
          {t("ownerOnly")}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {header}

      <Card className="flex flex-col gap-3 p-4">
        <h2 className="text-lg font-semibold text-primary">
          {t("teamMembers")}
        </h2>
        {membersQuery.isError ? (
          <ErrorRow
            message={t("loadMembersError")}
            retryLabel={t("retry")}
            onRetry={() => membersQuery.refetch()}
          />
        ) : (
          <WDataTable
            columns={memberColumns}
            data={membersQuery.data ?? []}
            emptyMessage={
              membersQuery.isLoading ? "…" : t("emptyMembers")
            }
          />
        )}
      </Card>

      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {t("invitedTeamMembers")}
          </h2>
          <Button type="button" size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} />
            {t("inviteMember")}
          </Button>
        </div>
        {invitationsQuery.isError ? (
          <ErrorRow
            message={t("loadInvitationsError")}
            retryLabel={t("retry")}
            onRetry={() => invitationsQuery.refetch()}
          />
        ) : (
          <WDataTable
            columns={inviteColumns}
            data={invitationsQuery.data ?? []}
            emptyMessage={
              invitationsQuery.isLoading ? "…" : t("emptyInvitations")
            }
          />
        )}
      </Card>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => {
          if (!open) setMemberToRemove(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("remove.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("remove.description", {
                name: memberToRemove
                  ? formatName(
                      memberToRemove.firstName,
                      memberToRemove.lastName,
                      memberToRemove.email
                    )
                  : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMember.isPending}>
              {t("remove.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleRemove();
              }}
              disabled={removeMember.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("remove.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!inviteToRevoke}
        onOpenChange={(open) => {
          if (!open) setInviteToRevoke(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("revoke.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("revoke.description", {
                email: inviteToRevoke?.email ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeInvitation.isPending}>
              {t("revoke.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleRevoke();
              }}
              disabled={revokeInvitation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("revoke.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ErrorRow({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-medium underline underline-offset-4"
      >
        {retryLabel}
      </button>
    </div>
  );
}
