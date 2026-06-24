"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { type Clinic } from "@/lib/api/clinics";
import { useCreateClinic } from "@/lib/queries/useCreateClinic";

const PARENT_NONE = "none";
const PARENT_NEW = "__new__";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentOptions: Clinic[];
};

type FormState = {
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  parentOption: string;
  newParentName: string;
};

const emptyForm: FormState = {
  name: "",
  addressStreet: "",
  addressCity: "",
  addressCode: "",
  contactEmail: "",
  parentOption: PARENT_NONE,
  newParentName: "",
};

export function AddClinicDialog({ open, onOpenChange, parentOptions }: Props) {
  const t = useTranslations("clinic.dialog");
  const { mutateAsync, isPending } = useCreateClinic();
  const [form, setForm] = useState<FormState>(emptyForm);

  const showNewParentField = form.parentOption === PARENT_NEW;

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.parentOption === PARENT_NEW && !form.newParentName.trim()) {
      toast.error(t("newParentNameRequired"));
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        addressStreet: form.addressStreet.trim(),
        addressCity: form.addressCity.trim(),
        addressCode: form.addressCode.trim(),
        contactEmail: form.contactEmail.trim(),
        parentClinicId:
          form.parentOption !== PARENT_NONE && form.parentOption !== PARENT_NEW
            ? form.parentOption
            : null,
        newParentName:
          form.parentOption === PARENT_NEW ? form.newParentName.trim() : null,
      };

      await mutateAsync(payload);
      toast.success(t("success"));
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("error"));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="clinic-name">{t("name")}</Label>
            <Input
              id="clinic-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("namePlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("address")}</Label>
            <div className="flex flex-col gap-3 rounded-lg border p-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic-address-street" className="text-muted-foreground text-xs">
                  {t("addressStreet")}
                </Label>
                <Input
                  id="clinic-address-street"
                  value={form.addressStreet}
                  onChange={(e) => update("addressStreet", e.target.value)}
                  placeholder={t("addressStreetPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic-address-city" className="text-muted-foreground text-xs">
                  {t("addressCity")}
                </Label>
                <Input
                  id="clinic-address-city"
                  value={form.addressCity}
                  onChange={(e) => update("addressCity", e.target.value)}
                  placeholder={t("addressCityPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic-address-code" className="text-muted-foreground text-xs">
                  {t("addressCode")}
                </Label>
                <Input
                  id="clinic-address-code"
                  value={form.addressCode}
                  onChange={(e) => update("addressCode", e.target.value)}
                  placeholder={t("addressCodePlaceholder")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="clinic-email">{t("contactEmail")}</Label>
            <Input
              id="clinic-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder={t("contactEmailPlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="parent-clinic">{t("parentClinic")}</Label>
            <Select
              value={form.parentOption}
              onValueChange={(value) => update("parentOption", value)}
            >
              <SelectTrigger id="parent-clinic">
                <SelectValue placeholder={t("parentPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PARENT_NONE}>{t("noParent")}</SelectItem>
                {parentOptions.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
                <SelectItem value={PARENT_NEW}>{t("createNewParent")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">{t("parentHint")}</p>
          </div>

          {showNewParentField && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-parent-name">{t("newParentName")}</Label>
              <Input
                id="new-parent-name"
                value={form.newParentName}
                onChange={(e) => update("newParentName", e.target.value)}
                placeholder={t("newParentNamePlaceholder")}
                required
              />
              <p className="text-muted-foreground text-xs">
                {t("newParentHint")}
              </p>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
