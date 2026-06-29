"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories } from "@/lib/mock-data";
import { type InventoryProduct } from "@/lib/api/products";
import { useCreateProduct } from "@/lib/queries/useCreateProduct";
import { useUpdateProduct } from "@/lib/queries/useUpdateProduct";
import { ProductImagesUpload } from "./ProductImagesUpload";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: InventoryProduct;
};

type FormState = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  commission: string;
  description: string;
  brand: string;
  weight: string;
  dimensions: string;
  originCountry: string;
};

const emptyForm: FormState = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  commission: "",
  description: "",
  brand: "",
  weight: "",
  dimensions: "",
  originCountry: "",
};

function productToForm(product: InventoryProduct): FormState {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    commission: product.commission != null ? String(product.commission) : "",
    description: product.description ?? "",
    brand: product.brand ?? "",
    weight: product.weight ?? "",
    dimensions: product.dimensions ?? "",
    originCountry: product.origin ?? "",
  };
}

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  const t = useTranslations("inventory.dialog");
  const isEdit = !!product;
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct(product?.id ?? "");
  const isPending = isCreating || isUpdating;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open && product) {
      setForm(productToForm(product));
      setImageUrls(product.images);
      setIsActive(product.isActive);
    } else if (open && !product) {
      setForm(emptyForm);
      setImageUrls([]);
      setIsActive(true);
    }
  }, [open, product]);

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setImageUrls([]);
    setIsActive(true);
  };

  const optionalText = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.error(t("categoryPlaceholder"));
      return;
    }

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      commission: form.commission ? Number(form.commission) : null,
      description: optionalText(form.description),
      brand: optionalText(form.brand),
      weight: optionalText(form.weight),
      dimensions: optionalText(form.dimensions),
      originCountry: optionalText(form.originCountry),
      imageUrls,
    };

    try {
      if (isEdit && product) {
        await updateProduct({ ...payload, isActive });
        toast.success(t("updateSuccess"));
      } else {
        await createProduct(payload);
        toast.success(t("createSuccess"));
      }
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : isEdit
            ? t("updateFailed")
            : t("createFailed")
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("title")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("namePlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sku">{t("sku")}</Label>
            <Input
              id="sku"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder={t("skuPlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={form.category}
              onValueChange={(value) => update("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={t("categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder={t("pricePlaceholder")}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">{t("stock")}</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder={t("stockPlaceholder")}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="commission">{t("commission")}</Label>
            <Input
              id="commission"
              type="number"
              min="0"
              step="0.01"
              value={form.commission}
              onChange={(e) => update("commission", e.target.value)}
              placeholder={t("commissionPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">{t("brand")}</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                placeholder={t("brandPlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">{t("weight")}</Label>
              <Input
                id="weight"
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
                placeholder={t("weightPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dimensions">{t("dimensions")}</Label>
              <Input
                id="dimensions"
                value={form.dimensions}
                onChange={(e) => update("dimensions", e.target.value)}
                placeholder={t("dimensionsPlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="originCountry">{t("originCountry")}</Label>
              <Input
                id="originCountry"
                value={form.originCountry}
                onChange={(e) => update("originCountry", e.target.value)}
                placeholder={t("originCountryPlaceholder")}
              />
            </div>
          </div>

          <ProductImagesUpload
            value={imageUrls}
            onChange={setImageUrls}
            disabled={isPending}
          />

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="isActive">{t("isActive")}</Label>
                <span className="text-xs text-muted-foreground">
                  {t("isActiveHint")}
                </span>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("saving")
                : isEdit
                  ? t("saveChanges")
                  : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
