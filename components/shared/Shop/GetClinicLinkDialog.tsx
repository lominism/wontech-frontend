"use client";

import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { Link2, QrCode, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WDataTable } from "@/components/shared/WDataTable";
import { type Clinic } from "@/lib/api/clinics";
import { getListableClinics } from "@/lib/mock-data";
import { useClinicsLookup } from "@/lib/queries/useClinicsLookup";
import { buildShopUrl } from "@/lib/shop-url";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_SIZE = 50;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
};

const columnHelper = createColumnHelper<Clinic>();

export function GetClinicLinkDialog({ open, onOpenChange, productId }: Props) {
  const t = useTranslations("shop.link");
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: clinics = [],
    isLoading,
    isError,
    refetch,
  } = useClinicsLookup({
    enabled: open && !authLoading && !!user,
  });

  useEffect(() => {
    if (!open) {
      setSearch("");
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const listableClinics = useMemo(
    () => getListableClinics(clinics),
    [clinics]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return listableClinics;
    return listableClinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(query)
    );
  }, [listableClinics, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCopyLink = async (clinicId: string) => {
    const url = buildShopUrl(
      window.location.origin,
      locale,
      clinicId,
      productId
    );

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("clinicName"),
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "copyLink",
        header: t("copyLink"),
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              void handleCopyLink(row.original.id);
            }}
          >
            <Link2 size={14} />
            {t("copyLink")}
          </Button>
        ),
      }),
      columnHelper.display({
        id: "downloadQr",
        header: t("downloadQr"),
        cell: () => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(t("qrComingSoon"));
            }}
          >
            <QrCode size={14} />
            {t("downloadQr")}
          </Button>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, locale, productId]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("modalTitle")}</DialogTitle>
          <DialogDescription>{t("modalDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={15}
            />
            <Input
              placeholder={t("searchClinics")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
              {t("loadingClinics")}
            </div>
          ) : isError ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
              <p className="text-sm">{t("loadClinicsError")}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-medium underline underline-offset-4"
              >
                {t("retry")}
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                {t("totalClinics", { count: filtered.length })}
              </div>
              <WDataTable
                columns={columns}
                data={pageData}
                emptyMessage={t("emptyClinics")}
              />
              {filtered.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {t("pageOf", { page: currentPage, totalPages })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      {t("previous")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      {t("next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
