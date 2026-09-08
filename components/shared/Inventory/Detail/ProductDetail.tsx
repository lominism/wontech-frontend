"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useProduct } from "@/lib/queries/useProduct";
import {
  PURCHASE_HISTORY_PAGE_SIZE,
  useProductPurchaseHistory,
} from "@/lib/queries/useProductPurchaseHistory";
import { ProductInfoCard } from "./ProductInfoCard";
import { ProductAdditionalInfoCard } from "./ProductAdditionalInfoCard";
import { PurchaseHistoryTable } from "./PurchaseHistoryTable";

type Props = {
  productId: string;
};

export function ProductDetail({ productId }: Props) {
  const t = useTranslations("inventory.detail");
  const { user, loading: authLoading } = useAuth();
  const [historyPage, setHistoryPage] = useState(1);
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(productId, {
    enabled: !authLoading && !!user,
  });
  const {
    data: historyResult,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useProductPurchaseHistory(productId, {
    page: historyPage,
    enabled: !authLoading && !!user,
  });

  useEffect(() => {
    setHistoryPage(1);
  }, [productId]);

  const history = useMemo(
    () =>
      (historyResult?.items ?? []).map((order) => ({
        id: order.id,
        date: order.date,
        quantity: order.qty,
        customerName: order.customer === "—" ? null : order.customer || null,
        clinicName: order.clinic === "—" ? null : order.clinic || null,
      })),
    [historyResult]
  );

  if (authLoading || isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/inventory"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {t("backToInventory")}
        </Link>
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
          <p className="text-sm">{t("notFound")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/inventory"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        {t("backToInventory")}
      </Link>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="h-full lg:col-span-1">
          <ProductInfoCard product={product} productId={productId} />
        </div>

        <div className="flex h-full flex-col gap-6 lg:col-span-2">
          <ProductAdditionalInfoCard product={product} />
          <PurchaseHistoryTable
            records={history}
            isLoading={historyLoading || (historyFetching && !historyResult)}
            page={historyPage}
            total={historyResult?.total ?? 0}
            pageSize={PURCHASE_HISTORY_PAGE_SIZE}
            onPageChange={setHistoryPage}
          />
        </div>
      </div>
    </div>
  );
}
