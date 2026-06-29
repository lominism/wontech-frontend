"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreVertical, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetClinicLinkDialog } from "@/components/shared/Shop/GetClinicLinkDialog";
import { ProductFormDialog } from "@/components/shared/Inventory/ProductFormDialog";
import { DeleteProductDialog } from "@/components/shared/Inventory/DeleteProductDialog";
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
  productId: string;
};

export function ProductInfoCard({ product, productId }: Props) {
  const t = useTranslations("inventory.detail");
  const tLink = useTranslations("shop.link");
  const status = getStockStatus(product.stock);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const getClinicLinkButton = (
    <Button
      type="button"
      size="sm"
      className="shrink-0"
      disabled={!product.isActive}
      onClick={() => setLinkDialogOpen(true)}
    >
      {tLink("getClinicLink")}
    </Button>
  );

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

        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-8 bg-background/90 shadow-sm backdrop-blur"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold leading-tight">{product.name}</h2>
              {!product.isActive && (
                <Badge variant="secondary">{t("disabled")}</Badge>
              )}
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {t("sku")}: {product.sku}
            </span>
          </div>
          {!product.isActive ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">{getClinicLinkButton}</span>
                </TooltipTrigger>
                <TooltipContent>{t("linkDisabledTooltip")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            getClinicLinkButton
          )}
        </div>

        <GetClinicLinkDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          productId={productId}
        />
        <ProductFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          product={product}
        />
        <DeleteProductDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          product={product}
        />

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
