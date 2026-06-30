"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type OrderStatus } from "@/lib/api/orders";
import { useOrder } from "@/lib/queries/useOrder";
import { thbFormatter } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/OrdersTable/OrderDetailSections";

type Props = {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusStyles: Record<OrderStatus, string> = {
  pending_payment:
    "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  paid: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100",
  awaiting_shipment:
    "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  shipped: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
  completed:
    "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
};

export function OrderDetailDialog({ orderId, open, onOpenChange }: Props) {
  const t = useTranslations("orders.detail");
  const tStatus = useTranslations("orders.status");
  const tSource = useTranslations("orders.newOrder.sources");
  const locale = useLocale();

  const { data, isLoading, isError, refetch } = useOrder(orderId, {
    enabled: open && !!orderId,
  });

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale]
  );

  const mailingBlock = useMemo(() => {
    if (!data) return "";
    return [
      data.customerName ?? "",
      data.shippingAddressStreet ?? "",
      `${data.shippingAddressCity ?? ""} ${data.shippingAddressCode ?? ""}`.trim(),
      data.customerPhone ?? "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [data]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(mailingBlock);
      toast.success(t("copied"));
    } catch {
      toast.error(t("error"));
    }
  };

  const dash = "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
            {t("loading")}
          </div>
        )}

        {isError && (
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-destructive">
            <p className="text-sm">{t("error")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-medium underline underline-offset-4"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {data && !isLoading && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-semibold text-primary">{data.orderNo}</p>
              <Badge className={cn(statusStyles[data.status])}>
                {tStatus(data.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("orderDate")}:{" "}
              <span className="tabular-nums text-foreground">
                {dateFormatter.format(new Date(data.createdAt))}
              </span>
            </p>
            <p className="text-muted-foreground text-sm">
              {t("source")}:{" "}
              <span className="text-foreground">{tSource(data.source)}</span>
            </p>

            <DetailSection title={t("product")}>
              <dl className="flex flex-col gap-3">
                <DetailRow label={t("name")} value={data.productName} />
                <DetailRow label={t("sku")} value={data.productSku} />
                <DetailRow label={t("quantity")} value={data.quantity} />
                <DetailRow
                  label={t("unitPrice")}
                  value={thbFormatter.format(data.unitPrice)}
                />
                <DetailRow
                  label={t("total")}
                  value={thbFormatter.format(data.total)}
                />
              </dl>
            </DetailSection>

            <DetailSection title={t("soldVia")}>
              <p className="text-sm font-medium">{data.clinicName}</p>
            </DetailSection>

            <DetailSection title={t("customer")}>
              <dl className="flex flex-col gap-3">
                <DetailRow
                  label={t("name")}
                  value={data.customerName ?? dash}
                />
                <DetailRow
                  label={t("email")}
                  value={data.customerEmail ?? dash}
                />
                <DetailRow
                  label={t("phone")}
                  value={data.customerPhone ?? dash}
                />
              </dl>
            </DetailSection>

            <DetailSection title={t("shipping")}>
              <dl className="flex flex-col gap-3">
                <DetailRow
                  label={t("name")}
                  value={data.customerName ?? dash}
                />
                <DetailRow
                  label={t("street")}
                  value={data.shippingAddressStreet ?? dash}
                />
                <DetailRow
                  label={t("city")}
                  value={data.shippingAddressCity ?? dash}
                />
                <DetailRow
                  label={t("postalCode")}
                  value={data.shippingAddressCode ?? dash}
                />
                <DetailRow
                  label={t("phone")}
                  value={data.customerPhone ?? dash}
                />
              </dl>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleCopyAddress}
                disabled={!mailingBlock}
              >
                {t("copyAddress")}
              </Button>
            </DetailSection>

            <DetailSection title={t("payment")}>
              <dl className="flex flex-col gap-3">
                <DetailRow
                  label={t("provider")}
                  value={data.paymentProvider ?? t("notPaidYet")}
                />
                <DetailRow
                  label={t("reference")}
                  value={data.paymentReference ?? dash}
                />
              </dl>
            </DetailSection>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
