"use client";

import { useTranslations } from "next-intl";

export function AccountStubPage() {
  const t = useTranslations("settings.account");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("comingSoon")}</p>
      </div>
    </div>
  );
}
