"use client";

import { useTranslations } from "next-intl";
import { usePublicShopProduct } from "@/lib/queries/usePublicShopProduct";
import { type ShopPartner } from "@/lib/shop-url";
import { ShopProductView } from "./ShopProductView";

type Props = {
  clinicId: string;
  productId: string;
  partner?: ShopPartner;
};

export function ShopProductPage({
  clinicId,
  productId,
  partner = "clinic",
}: Props) {
  const t = useTranslations("shop.product");
  const { data, isLoading, isError, refetch } = usePublicShopProduct(
    clinicId,
    productId,
    { partner }
  );

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-[#6B6560]">
        {t("loading")}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-red-700">
        <p className="text-sm">{t("notFound")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium underline underline-offset-4"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <ShopProductView
      data={data}
      clinicId={clinicId}
      productId={productId}
      partner={partner}
    />
  );
}
