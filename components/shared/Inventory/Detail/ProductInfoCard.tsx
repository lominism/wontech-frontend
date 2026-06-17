"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { thbFormatter } from "@/lib/utils";
import { type InventoryProduct } from "@/lib/api/products";
import {
  getStockPercent,
  getStockStatus,
  stockBarColor,
  stockTextColor,
} from "../stock";

type Props = {
  product: InventoryProduct;
};

export function ProductInfoCard({ product }: Props) {
  const t = useTranslations("inventory.detail");
  const status = getStockStatus(product.stock);

  return (
    <Card className="overflow-hidden">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="text-muted-foreground/40" size={72} />
        )}
      </div>

      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold leading-tight">{product.name}</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {t("sku")}: {product.sku}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("category")}</span>
          <Badge variant="secondary">{product.category}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("price")}</span>
          <span className="text-lg font-bold text-primary">
            {thbFormatter.format(product.price)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("commission")}</span>
          {product.commission != null ? (
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100">
              {thbFormatter.format(product.commission)}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              {t("noCommission")}
            </span>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("stock")}</span>
            <span className={`font-medium ${stockTextColor[status]}`}>
              {status === "out"
                ? t("outOfStock")
                : `${product.stock} ${t("inStock")}`}
            </span>
          </div>
          <Progress
            value={getStockPercent(product.stock)}
            indicatorColor={stockBarColor[status]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
