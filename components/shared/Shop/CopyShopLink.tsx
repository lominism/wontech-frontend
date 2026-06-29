"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Clinic } from "@/lib/api/clinics";
import { type InventoryProduct } from "@/lib/api/products";
import { buildShopUrl } from "@/lib/shop-url";

type Props = {
  clinicId?: string;
  productId?: string;
  clinics?: Clinic[];
  products?: InventoryProduct[];
};

export function CopyShopLink({
  clinicId: fixedClinicId,
  productId: fixedProductId,
  clinics = [],
  products = [],
}: Props) {
  const t = useTranslations("shop.link");
  const locale = useLocale();
  const [clinicId, setClinicId] = useState(fixedClinicId ?? "");
  const [productId, setProductId] = useState(fixedProductId ?? "");

  const resolvedClinicId = fixedClinicId ?? clinicId;
  const resolvedProductId = fixedProductId ?? productId;

  const canCopy = useMemo(
    () => Boolean(resolvedClinicId && resolvedProductId),
    [resolvedClinicId, resolvedProductId]
  );

  const handleCopy = async () => {
    if (!canCopy) return;

    const url = buildShopUrl(
      window.location.origin,
      locale,
      resolvedClinicId,
      resolvedProductId
    );

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!fixedClinicId && clinics.length > 0 && (
        <Select value={clinicId} onValueChange={setClinicId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("selectClinic")} />
          </SelectTrigger>
          <SelectContent>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {!fixedProductId && products.length > 0 && (
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("selectProduct")} />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={!canCopy}
      >
        <Link2 size={14} />
        {t("copyShopLink")}
      </Button>
    </div>
  );
}
