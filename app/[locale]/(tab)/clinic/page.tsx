"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockClinics } from "@/lib/mock-data";
import { SearchBar } from "@/components/shared/ClinicTable/SearchBar";
import { ClinicTable } from "@/components/shared/ClinicTable/ClinicTable";

export default function ClinicPage() {
  const t = useTranslations("clinic");
  const [search, setSearch] = useState("");

  const filtered = mockClinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <ClinicTable data={filtered} allClinics={mockClinics} />
    </div>
  );
}
