"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { thbFormatter } from "@/lib/utils";
import { WDataTable } from "@/components/shared/WDataTable";
import { type CreditLedgerRecord } from "@/lib/api/clinics";
import { useAdjustClinicCredit } from "@/lib/queries/useAdjustClinicCredit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  clinicId: string;
  records: CreditLedgerRecord[];
  loading?: boolean;
};

const columnHelper = createColumnHelper<CreditLedgerRecord>();

export function CreditUsageHistoryTable({
  clinicId,
  records,
  loading,
}: Props) {
  const t = useTranslations("clinic.detail.history");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"decrease" | "increase">("decrease");
  const { mutateAsync, isPending } = useAdjustClinicCredit(clinicId);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [locale]
  );

  const columns = [
    columnHelper.accessor("date", {
      header: t("date"),
      cell: (info) => (
        <span className="tabular-nums">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("reason", {
      header: t("reason"),
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {t(`reasons.${info.getValue()}` as "reasons.commission")}
        </span>
      ),
    }),
    columnHelper.accessor("creditChange", {
      header: t("creditChange"),
      cell: (info) => {
        const change = info.getValue();
        const isPositive = change >= 0;
        return (
          <Badge
            className={
              isPositive
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
            }
          >
            {isPositive ? "+" : ""}
            {thbFormatter.format(change)}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("userName", {
      header: t("user"),
      cell: (info) => <span>{info.getValue()}</span>,
    }),
  ];

  const resetDialog = () => {
    setAmount("");
    setMode("decrease");
  };

  const handleSave = async () => {
    const parsedAmount = Number(amount);
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error(t("amountRequired"));
      return;
    }

    try {
      await mutateAsync({
        amount: parsedAmount,
        direction: mode,
      });
      toast.success(t("saveSuccess"));
      setOpen(false);
      resetDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast.error(message || t("saveError"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t("title")}</CardTitle>
          <Button size="sm" onClick={() => setOpen(true)}>
            {t("creditAdjustment")}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">{t("groupNote")}</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground text-sm">
            {t("loading")}
          </div>
        ) : (
          <WDataTable
            columns={columns}
            data={records}
            emptyMessage={t("empty")}
          />
        )}
      </CardContent>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            resetDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("adjustmentTitle")}</DialogTitle>
            <DialogDescription>{t("adjustmentHint")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="credit-adjustment-amount">
              {t("creditChange")}
            </Label>
            <div className="flex items-stretch gap-2">
              <Button
                type="button"
                className={
                  mode === "decrease"
                    ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                    : ""
                }
                variant={mode === "decrease" ? "secondary" : "outline"}
                onClick={() => setMode("decrease")}
                disabled={isPending}
              >
                {t("decrease")}
              </Button>

              <Input
                id="credit-adjustment-amount"
                inputMode="decimal"
                placeholder={t("amountPlaceholder")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center tabular-nums"
                disabled={isPending}
              />

              <Button
                type="button"
                className={
                  mode === "increase"
                    ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                    : ""
                }
                variant={mode === "increase" ? "secondary" : "outline"}
                onClick={() => setMode("increase")}
                disabled={isPending}
              >
                {t("increase")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === "decrease" ? "− " : "+ "}
              {amount ? thbFormatter.format(Number(amount) || 0) : t("amountPlaceholder")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetDialog();
              }}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending}>
              {isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
