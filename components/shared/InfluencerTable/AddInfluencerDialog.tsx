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
import { useAgencies } from "@/lib/queries/useAgencies";
import { useCreateInfluencer } from "@/lib/queries/useCreateInfluencer";

const AGENCY_NONE = "none";
const AGENCY_NEW = "__new__";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  name: string;
  addressStreet: string;
  addressCity: string;
  addressCode: string;
  contactEmail: string;
  contactPhone: string;
  agencyOption: string;
  newAgencyName: string;
};

const emptyForm: FormState = {
  name: "",
  addressStreet: "",
  addressCity: "",
  addressCode: "",
  contactEmail: "",
  contactPhone: "",
  agencyOption: AGENCY_NONE,
  newAgencyName: "",
};

export function AddInfluencerDialog({ open, onOpenChange }: Props) {
  const t = useTranslations("influencer.dialog");
  const { mutateAsync, isPending } = useCreateInfluencer();
  const { data: agencies = [] } = useAgencies({ enabled: open });
  const [form, setForm] = useState<FormState>(emptyForm);

  const showNewAgencyField = form.agencyOption === AGENCY_NEW;

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.agencyOption === AGENCY_NEW && !form.newAgencyName.trim()) {
      toast.error(t("newAgencyNameRequired"));
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        addressStreet: form.addressStreet.trim(),
        addressCity: form.addressCity.trim(),
        addressCode: form.addressCode.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        agencyId:
          form.agencyOption !== AGENCY_NONE && form.agencyOption !== AGENCY_NEW
            ? form.agencyOption
            : null,
        newAgencyName:
          form.agencyOption === AGENCY_NEW ? form.newAgencyName.trim() : null,
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
            <Label htmlFor="influencer-name">{t("name")}</Label>
            <Input
              id="influencer-name"
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
                <Label
                  htmlFor="influencer-address-street"
                  className="text-muted-foreground text-xs"
                >
                  {t("addressStreet")}
                </Label>
                <Input
                  id="influencer-address-street"
                  value={form.addressStreet}
                  onChange={(e) => update("addressStreet", e.target.value)}
                  placeholder={t("addressStreetPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="influencer-address-city"
                  className="text-muted-foreground text-xs"
                >
                  {t("addressCity")}
                </Label>
                <Input
                  id="influencer-address-city"
                  value={form.addressCity}
                  onChange={(e) => update("addressCity", e.target.value)}
                  placeholder={t("addressCityPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="influencer-address-code"
                  className="text-muted-foreground text-xs"
                >
                  {t("addressCode")}
                </Label>
                <Input
                  id="influencer-address-code"
                  value={form.addressCode}
                  onChange={(e) => update("addressCode", e.target.value)}
                  placeholder={t("addressCodePlaceholder")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="influencer-email">{t("contactEmail")}</Label>
            <Input
              id="influencer-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder={t("contactEmailPlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="influencer-phone">{t("contactPhone")}</Label>
            <Input
              id="influencer-phone"
              type="tel"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder={t("contactPhonePlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="influencer-agency">{t("agency")}</Label>
            <Select
              value={form.agencyOption}
              onValueChange={(value) => update("agencyOption", value)}
            >
              <SelectTrigger id="influencer-agency">
                <SelectValue placeholder={t("agencyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AGENCY_NONE}>{t("noAgency")}</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
                <SelectItem value={AGENCY_NEW}>{t("createNewAgency")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">{t("agencyHint")}</p>
          </div>

          {showNewAgencyField && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-agency-name">{t("newAgencyName")}</Label>
              <Input
                id="new-agency-name"
                value={form.newAgencyName}
                onChange={(e) => update("newAgencyName", e.target.value)}
                placeholder={t("newAgencyNamePlaceholder")}
                required
              />
              <p className="text-muted-foreground text-xs">
                {t("newAgencyHint")}
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
