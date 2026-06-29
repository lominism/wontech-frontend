"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type PublicShopResponse } from "@/lib/api/public";
import { thbFormatter } from "@/lib/utils";
import { ShopProductGallery } from "./ShopProductGallery";
import { ShopQuantitySelector } from "./ShopQuantitySelector";

type Props = {
  data: PublicShopResponse;
  clinicId: string;
  productId: string;
};

export function ShopProductView({ data, clinicId, productId }: Props) {
  const t = useTranslations("shop.product");
  const { clinic, product } = data;
  const maxQuantity = Math.max(1, product.stockAvailable || 1);
  const [quantity, setQuantity] = useState(1);

  const displayImages =
    product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const checkoutHref = `/shop/${clinicId}/${productId}/checkout?quantity=${quantity}`;

  const details = [
    { label: t("brand"), value: product.brand },
    { label: t("weight"), value: product.weight },
    { label: t("dimensions"), value: product.dimensions },
    { label: t("origin"), value: product.origin },
  ].filter((item) => item.value);

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ShopProductGallery
          images={displayImages}
          productName={product.name}
        />

        <div className="flex flex-col gap-8 lg:py-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6560]">
              {t("soldBy", { clinic: clinic.name })}
            </p>
            {product.brand && (
              <p className="text-sm uppercase tracking-[0.18em] text-[#3D5A4C]">
                {product.brand}
              </p>
            )}
            <h1
              className="text-4xl font-medium leading-tight text-[#2A2A2A] sm:text-5xl"
              style={{ fontFamily: "var(--font-shop-serif), serif" }}
            >
              {product.name}
            </h1>
            <p className="text-sm text-[#6B6560]">{product.category}</p>
          </div>

          <div className="border-y border-[#E8DFD4] py-6">
            <p className="text-3xl font-medium text-[#2A2A2A]">
              {thbFormatter.format(product.price)}
            </p>
            <p className="mt-2 text-sm text-[#6B6560]">
              {product.inStock ? t("inStock") : t("outOfStock")}
            </p>
          </div>

          {product.inStock && (
            <div className="flex flex-col gap-4">
              <ShopQuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={maxQuantity}
              />
              <Link
                href={checkoutHref}
                className="inline-flex h-12 w-full items-center justify-center bg-[#3D5A4C] px-8 text-sm font-medium uppercase tracking-[0.18em] text-[#FFFCF8] transition-colors hover:bg-[#2F4839] active:bg-[#2F4839]"
              >
                {t("buy")}
              </Link>
            </div>
          )}

          {!product.inStock && (
            <button
              type="button"
              disabled
              className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center bg-[#C5C0BA] px-8 text-sm font-medium uppercase tracking-[0.18em] text-white"
            >
              {t("outOfStock")}
            </button>
          )}

          {product.description && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6560]">
                {t("description")}
              </h2>
              <p className="text-base leading-relaxed text-[#4A4541] whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {details.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#E8DFD4] pt-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6560]">
                {t("details")}
              </h2>
              <dl className="grid gap-3 text-sm">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between gap-4 border-b border-[#E8DFD4]/60 pb-3"
                  >
                    <dt className="text-[#6B6560]">{item.label}</dt>
                    <dd className="text-right text-[#2A2A2A]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
