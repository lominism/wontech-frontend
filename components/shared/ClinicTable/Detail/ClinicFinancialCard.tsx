"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { thbFormatter } from "@/lib/utils";
import { type Clinic } from "@/lib/api/clinics";

type Props = {
  clinic: Clinic;
};

export function ClinicFinancialCard({ clinic }: Props) {
  const t = useTranslations("clinic.detail.financial");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("itemsSold")}</span>
          <span className="text-lg font-bold tabular-nums">
            {clinic.itemsSold}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("revenue")}</span>
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-base px-3 py-1">
            {thbFormatter.format(clinic.revenue)}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("credit")}</span>
          <Badge className="bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100 text-base px-3 py-1">
            {thbFormatter.format(clinic.credit)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
