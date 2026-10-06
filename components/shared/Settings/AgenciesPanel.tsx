"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type Agency } from "@/lib/api/agencies";
import { useAgencies } from "@/lib/queries/useAgencies";
import { useDeleteAgency } from "@/lib/queries/useDeleteAgency";
import { thbFormatter } from "@/lib/utils";

export function AgenciesPanel() {
  const t = useTranslations("settings.company");
  const { data: agencies = [], isLoading, isError, refetch } = useAgencies();
  const { mutateAsync: deleteAgency, isPending: isDeleting } = useDeleteAgency();
  const [pendingDelete, setPendingDelete] = useState<Agency | null>(null);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteAgency(pendingDelete.id);
      toast.success(t("agencyDeleteSuccess"));
      setPendingDelete(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : t("agencyDeleteFailed")
      );
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">{t("agenciesLoading")}</p>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-destructive">{t("agenciesLoadError")}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {agencies.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("agenciesEmpty")}</p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">{t("agencyName")}</th>
                <th className="px-4 py-3 font-medium">
                  {t("agencyInfluencers")}
                </th>
                <th className="px-4 py-3 font-medium">{t("agencyCredit")}</th>
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {agencies.map((agency) => (
                <tr key={agency.id}>
                  <td className="px-4 py-3 font-medium">{agency.name}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {agency.memberCount}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {thbFormatter.format(agency.credit)}
                  </td>
                  <td className="px-2 py-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setPendingDelete(agency)}
                      aria-label={t("deleteAgency")}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAgencyTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAgencyDescription", {
                name: pendingDelete?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("deleting") : t("confirmDelete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
