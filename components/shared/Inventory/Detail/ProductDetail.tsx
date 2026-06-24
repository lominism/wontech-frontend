"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useProduct } from "@/lib/queries/useProduct";
import { mockPurchaseHistory } from "@/lib/mock-data";
import { ProductInfoCard } from "./ProductInfoCard";
import { ProductAdditionalInfoCard } from "./ProductAdditionalInfoCard";
import { PurchaseHistoryTable } from "./PurchaseHistoryTable";

type Props = {
  productId: string;
};

export function ProductDetail({ productId }: Props) {
  const t = useTranslations("inventory.detail");
  const { user, loading: authLoading } = useAuth();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(productId, {
    enabled: !authLoading && !!user,
  });

  // Purchase history is still mock until sales API exists.
  const history = mockPurchaseHistory.filter((r) => r.productId === productId);

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProductInfoCard product={product} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductAdditionalInfoCard product={product} />
          <PurchaseHistoryTable records={history} />
        </div>
      </div>
    </div>
  );
}
