"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  updateMyProfile,
  type PreferredLocale,
} from "@/lib/syncUser";
import { useAuth } from "@/providers/AuthProvider";

const LOCALES: { value: PreferredLocale; labelKey: "english" | "thai" }[] = [
  { value: "en", labelKey: "english" },
  { value: "th", labelKey: "thai" },
];

function resolveLocale(
  value: string | null | undefined,
  fallback: string
): PreferredLocale {
  if (value === "en" || value === "th") return value;
  if (fallback === "en" || fallback === "th") return fallback;
  return "th";
}

function setLocaleCookie(locale: PreferredLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguagePanel() {
  const t = useTranslations("settings.account");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, applyProfile } = useAuth();

  const [preferredLocale, setPreferredLocale] = useState<PreferredLocale>(
    resolveLocale(profile?.preferredLocale, locale)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPreferredLocale(resolveLocale(profile?.preferredLocale, locale));
  }, [profile?.preferredLocale, locale]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.firstName?.trim() || !profile?.lastName?.trim()) {
      toast.error(t("nameRequired"));
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        avatarUrl: profile.avatarUrl,
        preferredLocale,
      });
      applyProfile(updated);

      setLocaleCookie(preferredLocale);
      if (preferredLocale !== locale) {
        router.replace(pathname, { locale: preferredLocale });
      }

      toast.success(t("languageSaveSuccess"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("languageSaveFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("tabs.language")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("languageDescription")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Label>{t("preferredLanguage")}</Label>
        <RadioGroup
          value={preferredLocale}
          onValueChange={(value) =>
            setPreferredLocale(resolveLocale(value, preferredLocale))
          }
          className="gap-3"
          disabled={saving || !profile}
        >
          {LOCALES.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={`locale-${option.value}`}
              />
              <Label
                htmlFor={`locale-${option.value}`}
                className="cursor-pointer font-normal"
              >
                {t(`languages.${option.labelKey}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Button type="submit" disabled={saving || !profile}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
