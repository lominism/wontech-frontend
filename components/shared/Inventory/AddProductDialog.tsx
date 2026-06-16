"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories } from "@/lib/mock-data";
import { createProduct } from "@/lib/api/products";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  commission: "",
};

export function AddProductDialog({ open, onOpenChange, onCreated }: Props) {
  const t = useTranslations("inventory.dialog");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    (async () => {
      try {
        await createProduct({
          sku: form.sku.trim(),
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
          commission: form.commission ? Number(form.commission) : null,
        });
        toast.success("Product created");
        setForm(emptyForm);
        onOpenChange(false);
        onCreated?.();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to create product");
      } finally {
        setSaving(false);
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
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

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
