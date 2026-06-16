"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  mockProducts,
  mockProductDetails,
  mockPurchaseHistory,
} from "@/lib/mock-data";
import { ProductInfoCard } from "./ProductInfoCard";
import { ProductAdditionalInfoCard } from "./ProductAdditionalInfoCard";
import { PurchaseHistoryTable } from "./PurchaseHistoryTable";

type Props = {
  productId: string;
};

export function ProductDetail({ productId }: Props) {
  const t = useTranslations("inventory.detail");

  const product = mockProducts.find((p) => p.id === productId);
  const details = mockProductDetails[productId];
  const history = mockPurchaseHistory.filter((r) => r.productId === productId);

  if (!product || !details) {
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
          <ProductAdditionalInfoCard details={details} />
          <PurchaseHistoryTable records={history} />
        </div>
      </div>
    </div>
  );
}
