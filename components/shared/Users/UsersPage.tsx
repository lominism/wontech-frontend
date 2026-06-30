"use client";

import { useTranslations } from "next-intl";

export function UsersPage() {
  const t = useTranslations("users");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
    </div>
  );
}
