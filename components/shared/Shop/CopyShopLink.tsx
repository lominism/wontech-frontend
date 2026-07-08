"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrPreviewDialog } from "@/components/shared/Shop/QrPreviewDialog";
import { type Clinic } from "@/lib/api/clinics";
import { type InventoryProduct } from "@/lib/api/products";
import { buildShopUrl } from "@/lib/shop-url";

type Props = {
  clinicId?: string;
  clinicName?: string;
  productId?: string;
  clinics?: Clinic[];
  products?: InventoryProduct[];
};

export function CopyShopLink({
  clinicId: fixedClinicId,
  clinicName,
  productId: fixedProductId,
  clinics = [],
  products = [],
}: Props) {
  const t = useTranslations("shop.link");
  const locale = useLocale();
  const [clinicId, setClinicId] = useState(fixedClinicId ?? "");
  const [productId, setProductId] = useState(fixedProductId ?? "");
  const [qrOpen, setQrOpen] = useState(false);

  const resolvedClinicId = fixedClinicId ?? clinicId;
  const resolvedProductId = fixedProductId ?? productId;

  const canCopy = useMemo(
    () => Boolean(resolvedClinicId && resolvedProductId),
    [resolvedClinicId, resolvedProductId]
  );

  const shopUrl = useMemo(
    () =>
      canCopy
        ? buildShopUrl(
            window.location.origin,
            locale,
            resolvedClinicId,
            resolvedProductId
          )
        : "",
    [canCopy, locale, resolvedClinicId, resolvedProductId]
  );

  const productName = useMemo(() => {
    const selectedProduct = products.find((p) => p.id === resolvedProductId);
    return selectedProduct?.name ?? "";
  }, [products, resolvedProductId]);

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(shopUrl);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleOpenQr = () => {
    if (!canCopy) return;
    setQrOpen(true);
  };

  return (
    <>
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

        <Button
          type="button"
          size="sm"
          onClick={handleOpenQr}
          disabled={!canCopy}
        >
          <QrCode size={14} />
          {t("downloadQr")}
        </Button>
      </div>

      <QrPreviewDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        url={shopUrl}
        clinicName={clinicName ?? ""}
        productId={resolvedProductId}
        productName={productName}
      />
    </>
  );
}
