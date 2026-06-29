"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { confirmPayment } from "@/lib/api/public";

type Props = {
  clinicId: string;
  productId: string;
};

export function ShopPaymentPage({ clinicId, productId }: Props) {
  const t = useTranslations("shop.payment");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingToken, setTrackingToken] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError(t("error"));
    }
  }, [orderId, t]);

  const handlePay = async () => {
    if (!orderId) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await confirmPayment(orderId);
      setTrackingToken(result.trackingToken);
    } catch {
      setError(t("error"));
    } finally {
      setProcessing(false);
    }
  };

  if (trackingToken) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 border border-[#E8DFD4] bg-[#FFFCF8] p-8 text-center">
        <CheckCircle2 className="mx-auto text-[#3D5A4C]" size={48} strokeWidth={1.25} />
        <h1
          className="text-3xl font-medium text-[#2A2A2A]"
          style={{ fontFamily: "var(--font-shop-serif), serif" }}
        >
          {t("successTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-[#6B6560]">
          {t("successDescription")}
        </p>
        <Link
          href={`/track/${trackingToken}`}
          className="inline-flex h-12 items-center justify-center bg-[#3D5A4C] px-8 text-sm font-medium uppercase tracking-[0.18em] text-[#FFFCF8] transition-colors hover:bg-[#2F4839]"
        >
          {t("viewTracking")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <h1
        className="text-3xl font-medium text-[#2A2A2A]"
        style={{ fontFamily: "var(--font-shop-serif), serif" }}
      >
        {t("title")}
      </h1>

      <div className="flex flex-col gap-6 border border-[#E8DFD4] bg-[#FFFCF8] p-8">
        <p className="text-sm leading-relaxed text-[#6B6560]">{t("description")}</p>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={handlePay}
          disabled={processing || !orderId}
          className="inline-flex h-12 items-center justify-center bg-[#3D5A4C] px-8 text-sm font-medium uppercase tracking-[0.18em] text-[#FFFCF8] transition-colors hover:bg-[#2F4839] disabled:opacity-50"
        >
          {processing ? t("processing") : t("payNow")}
        </button>
        <Link
          href={`/shop/${clinicId}/${productId}/checkout`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-[#6B6560] transition-colors hover:text-[#2A2A2A]"
        >
          <ArrowLeft size={15} />
          {t("backToCheckout")}
        </Link>
      </div>
    </div>
  );
}
