"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
};

export function ShopQuantitySelector({
  value,
  onChange,
  max,
  disabled,
}: Props) {
  const t = useTranslations("shop.product");

  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const buttonClass = cn(
    "flex h-12 flex-1 items-center justify-center transition-colors",
    "active:bg-[#F3EDE4] disabled:opacity-40"
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6560]">
        {t("quantity")}
      </span>

      <div className="flex w-full items-stretch border border-[#E8DFD4] bg-[#FFFCF8]">
        <button
          type="button"
          disabled={disabled || value <= 1}
          onClick={decrement}
          className={buttonClass}
          aria-label={t("decreaseQuantity")}
        >
          <Minus size={18} strokeWidth={1.5} />
        </button>
        <span
          className="flex h-12 w-16 shrink-0 items-center justify-center border-x border-[#E8DFD4] text-lg font-medium tabular-nums text-[#2A2A2A]"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={increment}
          className={buttonClass}
          aria-label={t("increaseQuantity")}
        >
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
