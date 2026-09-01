"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createCheckoutSession, getPaymentStatus } from "@/lib/api/public";

type Props = {
  clinicId: string;
  productId: string;
};

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 30000;

export function ShopPaymentPage({ clinicId, productId }: Props) {
  const t = useTranslations("shop.payment");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  const [redirecting, setRedirecting] = useState(false);
  const [confirming, setConfirming] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);
  const [trackingToken, setTrackingToken] = useState<string | null>(null);

  const buildPayPath = useCallback(() => {
    const base = `${window.location.origin}/${locale}/shop/${clinicId}/${productId}/checkout/pay`;
    return orderId ? `${base}?orderId=${orderId}` : base;
  }, [clinicId, locale, orderId, productId]);

  const pollPaymentStatus = useCallback(async (stripeSessionId: string) => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
      const result = await getPaymentStatus(stripeSessionId);

      if (result.status === "paid" && result.trackingToken) {
        return result.trackingToken;
      }

      if (result.status === "failed" || result.status === "cancelled") {
        throw new Error(t("error"));
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new Error(t("confirmTimeout"));
  }, [t]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    setConfirming(true);
    setError(null);

    void pollPaymentStatus(sessionId)
      .then((token) => {
        if (!cancelled) setTrackingToken(token);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error"));
        }
      })
      .finally(() => {
        if (!cancelled) setConfirming(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, pollPaymentStatus, t]);

  useEffect(() => {
    if (!orderId && !sessionId) {
      setError(t("error"));
    }
  }, [orderId, sessionId, t]);

  const handlePay = async () => {
    if (!orderId) return;

    setRedirecting(true);
    setError(null);

    try {
      const payPath = buildPayPath();
      const successUrl = `${payPath}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/${locale}/shop/${clinicId}/${productId}/checkout`;

      const { checkoutUrl } = await createCheckoutSession(
        orderId,
        successUrl,
        cancelUrl
      );

      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("error"));
      setRedirecting(false);
    }
  };

  if (confirming) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 border border-[#E8DFD4] bg-[#FFFCF8] p-8 text-center">
        <Loader2
          className="animate-spin text-[#3D5A4C]"
          size={40}
          strokeWidth={1.25}
        />
        <h1
          className="text-2xl font-medium text-[#2A2A2A]"
          style={{ fontFamily: "var(--font-shop-serif), serif" }}
        >
          {t("confirmingTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-[#6B6560]">
          {t("confirmingDescription")}
        </p>
      </div>
    );
  }

  if (trackingToken) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 border border-[#E8DFD4] bg-[#FFFCF8] p-8 text-center">
        <CheckCircle2
          className="mx-auto text-[#3D5A4C]"
          size={48}
          strokeWidth={1.25}
        />
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
        <p className="text-sm leading-relaxed text-[#6B6560]">
          {t("description")}
        </p>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={() => void handlePay()}
          disabled={redirecting || !orderId}
          className="inline-flex h-12 items-center justify-center bg-[#3D5A4C] px-8 text-sm font-medium uppercase tracking-[0.18em] text-[#FFFCF8] transition-colors hover:bg-[#2F4839] disabled:opacity-50"
        >
          {redirecting ? t("redirecting") : t("payNow")}
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
