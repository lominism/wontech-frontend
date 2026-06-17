"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { thbFormatter } from "@/lib/utils";
import { type InventoryProduct } from "@/lib/api/products";
import { Link } from "@/i18n/navigation";
import {
  getStockPercent,
  getStockStatus,
  stockBarColor,
  stockTextColor,
} from "./stock";

type Props = {
  product: InventoryProduct;
};

export function ProductCard({ product }: Props) {
  const t = useTranslations("inventory.card");
  const status = getStockStatus(product.stock);

  return (
    <Link href={`/inventory/${product.id}`} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md hover:border-primary/30">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="text-muted-foreground/40" size={56} />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-background/80 px-1.5 py-0.5 font-mono text-xs text-muted-foreground backdrop-blur">
          {product.sku}
        </span>
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex min-h-10 items-start">
          <span className="font-semibold leading-tight">{product.name}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("category")}</span>
          <Badge variant="secondary">{product.category}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("price")}</span>
          <span className="font-semibold">
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
            <span className="text-muted-foreground text-xs">{t("noCommission")}</span>
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
    </Link>
  );
}
