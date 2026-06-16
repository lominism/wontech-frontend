"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type ProductDetails } from "@/lib/mock-data";

type Props = {
  details: ProductDetails;
};

export function ProductAdditionalInfoCard({ details }: Props) {
  const t = useTranslations("inventory.detail.additionalInfo");

  const specs = [
    { label: t("brand"), value: details.brand },
    { label: t("weight"), value: details.weight },
    { label: t("dimensions"), value: details.dimensions },
    { label: t("origin"), value: details.origin },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            {t("description")}
          </span>
          <p className="text-sm leading-relaxed">{details.description}</p>
        </div>

        <Separator />

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-center justify-between gap-4 border-b border-dashed border-border pb-2 text-sm"
            >
              <dt className="text-muted-foreground">{spec.label}</dt>
              <dd className="font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
