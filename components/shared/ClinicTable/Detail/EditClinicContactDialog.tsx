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
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { type Clinic } from "@/lib/api/clinics";
import { useUpdateClinicContact } from "@/lib/queries/useUpdateClinicContact";
import { useDeleteClinic } from "@/lib/queries/useDeleteClinic";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: Clinic;
};

type FormState = {
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  contactPhone: string;
};

export function EditClinicContactDialog({ open, onOpenChange, clinic }: Props) {
  const t = useTranslations("clinic.detail.editContact");
  const router = useRouter();
  const { profile } = useAuth();
  const isOwner = profile?.role === "owner";
  const { mutateAsync, isPending } = useUpdateClinicContact(clinic.id);
  const deleteClinic = useDeleteClinic();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    addressStreet: "",
    addressCity: "",
    addressCode: "",
    contactEmail: "",
    contactPhone: "",
  });

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (open) {
      setForm({
        addressStreet: clinic.addressStreet ?? "",
        addressCity: clinic.addressCity ?? "",
        addressCode: clinic.addressCode ?? "",
        contactEmail: clinic.contactEmail ?? "",
        contactPhone: clinic.contactPhone ?? "",
      });
    }
  }, [
    open,
    clinic.addressStreet,
    clinic.addressCity,
    clinic.addressCode,
    clinic.contactEmail,
    clinic.contactPhone,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        addressStreet: form.addressStreet.trim(),
        addressCity: form.addressCity.trim(),
        addressCode: form.addressCode.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
      });
      toast.success(t("success"));
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("error"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClinic.mutateAsync(clinic.id);
      toast.success(t("delete.success"));
      setConfirmOpen(false);
      onOpenChange(false);
      router.push("/clinic");
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
                    htmlFor="edit-clinic-address-street"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressStreet")}
                  </Label>
                  <Input
                    id="edit-clinic-address-street"
                    value={form.addressStreet}
                    onChange={(e) => update("addressStreet", e.target.value)}
                    placeholder={t("addressStreetPlaceholder")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="edit-clinic-address-city"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressCity")}
                  </Label>
                  <Input
                    id="edit-clinic-address-city"
                    value={form.addressCity}
                    onChange={(e) => update("addressCity", e.target.value)}
                    placeholder={t("addressCityPlaceholder")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="edit-clinic-address-code"
                    className="text-muted-foreground text-xs"
                  >
                    {t("addressCode")}
                  </Label>
                  <Input
                    id="edit-clinic-address-code"
                    value={form.addressCode}
                    onChange={(e) => update("addressCode", e.target.value)}
                    placeholder={t("addressCodePlaceholder")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-clinic-email">{t("email")}</Label>
              <Input
                id="edit-clinic-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-clinic-phone">{t("phone")}</Label>
              <Input
                id="edit-clinic-phone"
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder={t("phonePlaceholder")}
                required
              />
            </div>

            <DialogFooter className="mt-2 sm:justify-between">
              {isOwner ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isPending || deleteClinic.isPending}
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
              {t("delete.description", { name: clinic.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteClinic.isPending}>
              {t("delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteClinic.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleteClinic.isPending
                ? t("delete.deleting")
                : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
