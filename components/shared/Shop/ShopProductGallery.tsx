"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  productName: string;
};

export function ShopProductGallery({ images, productName }: Props) {
  const t = useTranslations("shop.product");
  const galleryImages = useMemo(
    () => images.filter((url) => Boolean(url?.trim())),
    [images]
  );
  const [selected, setSelected] = useState(0);

  const activeImage = galleryImages[selected] ?? null;
  const hasMultiple = galleryImages.length > 1;

  const goPrev = () => {
    setSelected((index) =>
      index === 0 ? galleryImages.length - 1 : index - 1
    );
  };

  const goNext = () => {
    setSelected((index) =>
      index === galleryImages.length - 1 ? 0 : index + 1
    );
  };

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-[#F3EDE4]">
        <Package className="text-[#B8AFA5]" size={64} strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-sm bg-[#F3EDE4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage!}
          alt={
            hasMultiple
              ? t("viewImage", { number: selected + 1 })
              : productName
          }
          className="aspect-[4/5] w-full object-cover"
        />
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            className={cn(
              "flex h-10 w-10 items-center justify-center border border-[#E8DFD4] bg-[#FFFCF8] transition-colors",
              "hover:border-[#3D5A4C] hover:text-[#3D5A4C]"
            )}
            aria-label={t("previousImage")}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <span className="min-w-16 text-center text-xs uppercase tracking-[0.18em] text-[#6B6560]">
            {t("imageCounter", {
              current: selected + 1,
              total: galleryImages.length,
            })}
          </span>
          <button
            type="button"
            onClick={goNext}
            className={cn(
              "flex h-10 w-10 items-center justify-center border border-[#E8DFD4] bg-[#FFFCF8] transition-colors",
              "hover:border-[#3D5A4C] hover:text-[#3D5A4C]"
            )}
            aria-label={t("nextImage")}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
