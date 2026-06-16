"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState } from "react";
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
import { type CreditUsageRecord } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  records: CreditUsageRecord[];
};

const columnHelper = createColumnHelper<CreditUsageRecord>();

export function CreditUsageHistoryTable({ records }: Props) {
  const t = useTranslations("clinic.detail.history");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"decrease" | "increase">("decrease");

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t("title")}</CardTitle>
          <Button size="sm" onClick={() => setOpen(true)}>
            {t("creditAdjustment")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <WDataTable
          columns={columns}
          data={records}
          emptyMessage={t("empty")}
        />
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
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
                setAmount("");
                setMode("decrease");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                // UI-only for now: close modal. Later this will write a record.
                setOpen(false);
                setAmount("");
                setMode("decrease");
              }}
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
