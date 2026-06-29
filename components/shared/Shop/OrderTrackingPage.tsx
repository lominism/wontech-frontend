"use client";

import { useTranslations } from "next-intl";
import { usePublicTracking } from "@/lib/queries/usePublicTracking";
import { thbFormatter } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  token: string;
};

const statusStyles: Record<string, string> = {
  pending_payment: "bg-[#F3EDE4] text-[#6B6560]",
  paid: "bg-[#E8F0EB] text-[#3D5A4C]",
  awaiting_shipment: "bg-[#E8F0EB] text-[#3D5A4C]",
  shipped: "bg-[#3D5A4C] text-[#FFFCF8]",
  cancelled: "bg-red-50 text-red-700",
};

export function OrderTrackingPage({ token }: Props) {
  const t = useTranslations("shop.track");
  const { data, isLoading, isError, refetch } = usePublicTracking(token);

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

  const statusLabel =
    t(`statuses.${data.status}` as "statuses.pending_payment") || data.status;

  const rows = [
    { label: t("orderNo"), value: data.orderNo, mono: true },
    { label: t("product"), value: data.productName },
    { label: t("quantity"), value: String(data.quantity) },
    {
      label: t("total"),
      value: thbFormatter.format(data.total),
      bold: true,
    },
    {
      label: t("lastUpdated"),
      value: new Date(data.updatedAt).toLocaleString(),
    },
  ];

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <h1
        className="text-3xl font-medium text-[#2A2A2A]"
        style={{ fontFamily: "var(--font-shop-serif), serif" }}
      >
        {t("title")}
      </h1>

      <div className="border border-[#E8DFD4] bg-[#FFFCF8] p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6560]">
            {t("status")}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
              statusStyles[data.status] ?? statusStyles.pending_payment
            )}
          >
            {statusLabel}
          </span>
        </div>

        <dl className="flex flex-col gap-4 text-sm">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-4 border-b border-[#E8DFD4]/60 pb-4 last:border-0 last:pb-0"
            >
              <dt className="text-[#6B6560]">{row.label}</dt>
              <dd
                className={cn(
                  "text-right text-[#2A2A2A]",
                  row.mono && "font-mono",
                  row.bold && "font-medium"
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
