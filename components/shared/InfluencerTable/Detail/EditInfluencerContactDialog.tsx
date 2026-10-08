"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { type Influencer } from "@/lib/api/influencers";
import { useAgencies } from "@/lib/queries/useAgencies";
import { useUpdateInfluencerContact } from "@/lib/queries/useUpdateInfluencerContact";
import { useDeleteInfluencer } from "@/lib/queries/useDeleteInfluencer";

const AGENCY_NONE = "__none__";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  influencer: Influencer;
};

type FormState = {
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  contactPhone: string;
  agencyId: string;
};

export function EditInfluencerContactDialog({
  open,
  onOpenChange,
  influencer,
}: Props) {
  const t = useTranslations("influencer.detail.editContact");
  const router = useRouter();
  const { profile } = useAuth();
  const isOwner = profile?.role === "owner";
  const { data: agencies = [] } = useAgencies({ enabled: open });
  const { mutateAsync, isPending } = useUpdateInfluencerContact(influencer.id);
  const deleteInfluencer = useDeleteInfluencer();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    addressStreet: "",
    addressCity: "",
    addressCode: "",
    contactEmail: "",
    contactPhone: "",
    agencyId: AGENCY_NONE,
  });

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isStandalone = !influencer.agencyId;
  const hasPersonalCredit =
    isStandalone && Math.abs(influencer.credit) > 1e-9;
  const isJoiningAgency =
    isStandalone && form.agencyId !== AGENCY_NONE;

  useEffect(() => {
    if (open) {
      setForm({
        addressStreet: influencer.addressStreet ?? "",
        addressCity: influencer.addressCity ?? "",
        addressCode: influencer.addressCode ?? "",
        contactEmail: influencer.contactEmail ?? "",
        contactPhone: influencer.contactPhone ?? "",
        agencyId: influencer.agencyId ?? AGENCY_NONE,
      });
    }
  }, [
    open,
    influencer.addressStreet,
    influencer.addressCity,
    influencer.addressCode,
    influencer.contactEmail,
    influencer.contactPhone,
    influencer.agencyId,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isJoiningAgency && hasPersonalCredit) {
      toast.error(t("creditMustBeZero"));
      return;
    }

    try {
      await mutateAsync({
        addressStreet: form.addressStreet.trim(),
        addressCity: form.addressCity.trim(),
        addressCode: form.addressCode.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        agencyId: form.agencyId === AGENCY_NONE ? null : form.agencyId,
      });
      toast.success(t("success"));
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("error"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInfluencer.mutateAsync(influencer.id);
      toast.success(t("delete.success"));
      setConfirmOpen(false);
      onOpenChange(false);
      router.push("/influencer");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("delete.error"));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("address")}</Label>
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="edit-influencer-address-street"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressStreet")}
                  </Label>
                  <Input
                    id="edit-influencer-address-street"
                    value={form.addressStreet}
                    onChange={(e) => update("addressStreet", e.target.value)}
                    placeholder={t("addressStreetPlaceholder")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="edit-influencer-address-city"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressCity")}
                  </Label>
                  <Input
                    id="edit-influencer-address-city"
                    value={form.addressCity}
                    onChange={(e) => update("addressCity", e.target.value)}
                    placeholder={t("addressCityPlaceholder")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="edit-influencer-address-code"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressCode")}
                  </Label>
                  <Input
                    id="edit-influencer-address-code"
                    value={form.addressCode}
                    onChange={(e) => update("addressCode", e.target.value)}
                    placeholder={t("addressCodePlaceholder")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-influencer-email">{t("email")}</Label>
              <Input
                id="edit-influencer-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-influencer-phone">{t("phone")}</Label>
              <Input
                id="edit-influencer-phone"
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder={t("phonePlaceholder")}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-influencer-agency">{t("agency")}</Label>
              <Select
                value={form.agencyId}
                onValueChange={(value) => update("agencyId", value)}
              >
                <SelectTrigger id="edit-influencer-agency">
                  <SelectValue placeholder={t("agencyPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AGENCY_NONE}>{t("noAgency")}</SelectItem>
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">{t("agencyHint")}</p>
              {hasPersonalCredit && (
                <p className="text-xs text-amber-700 dark:text-amber-500">
                  {t("creditMustBeZeroHint")}
                </p>
              )}
            </div>

            <DialogFooter className="mt-2 sm:justify-between">
              {isOwner ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isPending || deleteInfluencer.isPending}
                >
                  <Trash2 size={16} />
                  {t("delete.trigger")}
                </Button>
              ) : (
                <span />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("saving") : t("save")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description", { name: influencer.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInfluencer.isPending}>
              {t("delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteInfluencer.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleteInfluencer.isPending
                ? t("delete.deleting")
                : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
