"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getParentClinicOptions } from "@/lib/mock-data";
import { useAuth } from "@/providers/AuthProvider";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import {
  INFLUENCER_DEFAULT_SORT,
  toggleSort,
  type SortDirection,
} from "@/lib/sorting";
import { useInfluencersPaginated } from "@/lib/queries/useInfluencersPaginated";
import { useInfluencersLookup } from "@/lib/queries/useInfluencersLookup";
import { SearchBar } from "@/components/shared/InfluencerTable/SearchBar";
import { InfluencerTable } from "@/components/shared/InfluencerTable/InfluencerTable";
import { InfluencersPagination } from "@/components/shared/InfluencerTable/InfluencersPagination";
import { AddInfluencerDialog } from "@/components/shared/InfluencerTable/AddInfluencerDialog";

export function InfluencerContainer() {
  const t = useTranslations("influencer");
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(INFLUENCER_DEFAULT_SORT.sortBy);
  const [sortDir, setSortDir] = useState<SortDirection>(
    INFLUENCER_DEFAULT_SORT.sortDir
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortDir]);

  const {
    data: lookupInfluencers = [],
  } = useInfluencersLookup({
    enabled: !authLoading && !!user,
  });

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useInfluencersPaginated({
    search: debouncedSearch,
    page,
    sortBy,
    sortDir,
    enabled: !authLoading && !!user,
  });

  const influencers = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const parentOptions = getParentClinicOptions(lookupInfluencers);

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
            <InfluencerTable
              data={influencers}
              allInfluencers={lookupInfluencers}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
          <InfluencersPagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}

      <AddInfluencerDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        parentOptions={parentOptions}
      />
    </div>
  );
}
