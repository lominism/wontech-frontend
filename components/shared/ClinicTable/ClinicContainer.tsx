"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getParentClinicOptions } from "@/lib/mock-data";
import { useAuth } from "@/providers/AuthProvider";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import {
  CLINIC_DEFAULT_SORT,
  toggleSort,
  type SortDirection,
} from "@/lib/sorting";
import { useClinicsPaginated } from "@/lib/queries/useClinicsPaginated";
import { useClinicsLookup } from "@/lib/queries/useClinicsLookup";
import { SearchBar } from "@/components/shared/ClinicTable/SearchBar";
import { ClinicTable } from "@/components/shared/ClinicTable/ClinicTable";
import { ClinicsPagination } from "@/components/shared/ClinicTable/ClinicsPagination";
import { AddClinicDialog } from "@/components/shared/ClinicTable/AddClinicDialog";

export function ClinicContainer() {
  const t = useTranslations("clinic");
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(CLINIC_DEFAULT_SORT.sortBy);
  const [sortDir, setSortDir] = useState<SortDirection>(
    CLINIC_DEFAULT_SORT.sortDir
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortDir]);

  const {
    data: lookupClinics = [],
  } = useClinicsLookup({
    enabled: !authLoading && !!user,
  });

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useClinicsPaginated({
    search: debouncedSearch,
    page,
    sortBy,
    sortDir,
    enabled: !authLoading && !!user,
  });

  const clinics = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const parentOptions = getParentClinicOptions(lookupClinics);

  const isInitialLoading = isLoading && !data;
  const isRefreshing = isFetching && !isInitialLoading;

  const handleSort = (columnId: string) => {
    const next = toggleSort(sortBy, sortDir, columnId);
    setSortBy(next.sortBy);
    setSortDir(next.sortDir);
  };

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

      {authLoading || isInitialLoading ? (
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
        <>
          <div
            className={
              isRefreshing ? "opacity-60 transition-opacity" : undefined
            }
          >
            <ClinicTable
              data={clinics}
              allClinics={lookupClinics}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
          <ClinicsPagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}

      <AddClinicDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        parentOptions={parentOptions}
      />
    </div>
  );
}
