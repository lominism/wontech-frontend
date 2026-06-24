"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getListableClinics, getParentClinicOptions } from "@/lib/mock-data";
import { useAuth } from "@/providers/AuthProvider";
import { useClinics } from "@/lib/queries/useClinics";
import { SearchBar } from "@/components/shared/ClinicTable/SearchBar";
import { ClinicTable } from "@/components/shared/ClinicTable/ClinicTable";
import { AddClinicDialog } from "@/components/shared/ClinicTable/AddClinicDialog";

export function ClinicContainer() {
  const t = useTranslations("clinic");
  const { user, loading: authLoading } = useAuth();
  const {
    data: clinics = [],
    isLoading,
    isError,
    refetch,
  } = useClinics({
    enabled: !authLoading && !!user,
  });
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const parentOptions = useMemo(
    () => getParentClinicOptions(clinics),
    [clinics]
  );

  const listableClinics = useMemo(
    () => getListableClinics(clinics),
    [clinics]
  );

  const filtered = listableClinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onAdd={() => setIsAddOpen(true)}
      />

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          {t("page.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
          <p className="text-sm">{t("page.loadError")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("page.retry")}
          </button>
        </div>
      ) : (
        <ClinicTable data={filtered} allClinics={clinics} />
      )}

      <AddClinicDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        parentOptions={parentOptions}
      />
    </div>
  );
}
