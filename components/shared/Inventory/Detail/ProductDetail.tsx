"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getProduct, type InventoryProduct } from "@/lib/api/products";
import { useAuth } from "@/providers/AuthProvider";
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
  const [product, setProduct] = useState<InventoryProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getProduct(productId)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, productId]);

  // Purchase history is still mock until sales API exists.
  const history = mockPurchaseHistory.filter((r) => r.productId === productId);

  if (loading || authLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (!product || notFound) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/inventory"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {t("backToInventory")}
        </Link>
        <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          {t("notFound")}
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
