"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type InventoryProduct } from "@/lib/api/products";
import { useDeleteProduct } from "@/lib/queries/useDeleteProduct";
import { useUpdateProduct } from "@/lib/queries/useUpdateProduct";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InventoryProduct;
};

export function DeleteProductDialog({ open, onOpenChange, product }: Props) {
  const t = useTranslations("inventory.delete");
  const router = useRouter();
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();
  const { mutateAsync: updateProduct, isPending: isDisabling } =
    useUpdateProduct(product.id);

  const hasOrders = product.hasOrders ?? false;
  const isPending = isDeleting || isDisabling;

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast.success(t("deleteSuccess"));
      onOpenChange(false);
      router.push("/inventory");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : t("deleteFailed")
      );
    }
  };

  const handleDisable = async () => {
    try {
      await updateProduct({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        commission: product.commission,
        description: product.description,
        brand: product.brand,
        weight: product.weight,
        dimensions: product.dimensions,
        originCountry: product.origin,
        imageUrls: product.images,
        isActive: false,
      });
      toast.success(t("disableSuccess"));
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : t("disableFailed")
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasOrders ? t("cannotDeleteTitle") : t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasOrders ? t("cannotDeleteDescription") : t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          {hasOrders ? (
            <Button onClick={handleDisable} disabled={isPending}>
              {isDisabling ? t("disabling") : t("disable")}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isDeleting ? t("deleting") : t("confirm")}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
