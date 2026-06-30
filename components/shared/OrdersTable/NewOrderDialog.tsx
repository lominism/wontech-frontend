"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  ORDER_MANUAL_STATUSES,
  ORDER_SOURCES,
  type OrderManualStatus,
  type OrderSource,
} from "@/lib/api/orders";
import { getListableClinics } from "@/lib/mock-data";
import { useClinicsLookup } from "@/lib/queries/useClinicsLookup";
import { useProducts } from "@/lib/queries/useProducts";
import { useCreateOrder } from "@/lib/queries/useCreateOrder";

const CLINIC_NONE = "none";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  source: OrderSource;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressStreet: string;
  shippingAddressCity: string;
  shippingAddressCode: string;
  productId: string;
  quantity: string;
  clinicId: string;
  status: OrderManualStatus;
};

const emptyForm: FormState = {
  source: "wontech",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddressStreet: "",
  shippingAddressCity: "",
  shippingAddressCode: "",
  productId: "",
  quantity: "1",
  clinicId: CLINIC_NONE,
  status: "awaiting_shipment",
};

export function NewOrderDialog({ open, onOpenChange }: Props) {
  const t = useTranslations("orders.newOrder");
  const tStatus = useTranslations("orders.status");
  const { mutateAsync, isPending } = useCreateOrder();
  const { data: products = [], isLoading: productsLoading } = useProducts({
    enabled: open,
  });
  const { data: lookupClinics = [] } = useClinicsLookup({ enabled: open });
  const [form, setForm] = useState<FormState>(emptyForm);

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products]
  );
  const clinicOptions = useMemo(
    () => getListableClinics(lookupClinics),
    [lookupClinics]
  );
  const selectedProduct = activeProducts.find(
    (product) => product.id === form.productId
  );
  const maxQuantity = Math.max(1, selectedProduct?.stock ?? 1);
  const isMarketplace =
    form.source === "lazada" || form.source === "shopee";
  const customerFieldsRequired = !isMarketplace;

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
    }
  }, [open]);

  useEffect(() => {
    const qty = Number(form.quantity);
    if (qty > maxQuantity) {
      setForm((prev) => ({ ...prev, quantity: String(maxQuantity) }));
    }
  }, [form.quantity, maxQuantity]);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (!form.productId) return t("validation.productRequired");
    const quantity = Number(form.quantity);
    if (!quantity || quantity < 1) return t("validation.quantityRequired");
    if (quantity > maxQuantity) return t("validation.insufficientStock");

    if (customerFieldsRequired) {
      if (!form.customerName.trim()) return t("validation.nameRequired");
      if (!form.customerEmail.trim()) return t("validation.emailRequired");
      if (!form.customerPhone.trim()) return t("validation.phoneRequired");
      if (!form.shippingAddressStreet.trim()) {
        return t("validation.streetRequired");
      }
      if (!form.shippingAddressCity.trim()) return t("validation.cityRequired");
      if (!form.shippingAddressCode.trim()) return t("validation.codeRequired");
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await mutateAsync({
        source: form.source,
        productId: form.productId,
        quantity: Number(form.quantity),
        status: form.status,
        clinicId:
          form.clinicId === CLINIC_NONE ? null : form.clinicId,
        customerName: form.customerName.trim() || null,
        customerEmail: form.customerEmail.trim() || null,
        customerPhone: form.customerPhone.trim() || null,
        shippingAddressStreet: form.shippingAddressStreet.trim() || null,
        shippingAddressCity: form.shippingAddressCity.trim() || null,
        shippingAddressCode: form.shippingAddressCode.trim() || null,
      });
      toast.success(t("success"));
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Insufficient stock")) {
        toast.error(t("insufficientStock"));
      } else {
        toast.error(message || t("error"));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="order-source">{t("source")}</Label>
            <Select
              value={form.source}
              onValueChange={(value) => setField("source", value as OrderSource)}
            >
              <SelectTrigger id="order-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {t(`sources.${source}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="customer-name">
                {t("name")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="customer-name"
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
                required={customerFieldsRequired}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-email">
                {t("email")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="customer-email"
                type="email"
                value={form.customerEmail}
                onChange={(e) => setField("customerEmail", e.target.value)}
                required={customerFieldsRequired}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-phone">
                {t("phone")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="customer-phone"
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setField("customerPhone", e.target.value)}
                required={customerFieldsRequired}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="address-street">
                {t("addressStreet")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="address-street"
                value={form.shippingAddressStreet}
                onChange={(e) =>
                  setField("shippingAddressStreet", e.target.value)
                }
                required={customerFieldsRequired}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address-city">
                {t("addressCity")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="address-city"
                value={form.shippingAddressCity}
                onChange={(e) =>
                  setField("shippingAddressCity", e.target.value)
                }
                required={customerFieldsRequired}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address-code">
                {t("addressCode")}
                {!customerFieldsRequired && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({t("optional")})
                  </span>
                )}
              </Label>
              <Input
                id="address-code"
                value={form.shippingAddressCode}
                onChange={(e) =>
                  setField("shippingAddressCode", e.target.value)
                }
                required={customerFieldsRequired}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product">{t("item")}</Label>
            <Select
              value={form.productId}
              onValueChange={(value) => setField("productId", value)}
              disabled={productsLoading}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder={t("itemPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {activeProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">{t("qty")}</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={maxQuantity}
              value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              required
            />
            {selectedProduct && (
              <p className="text-muted-foreground text-xs">
                {t("stockAvailable", { count: selectedProduct.stock })}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="clinic">
              {t("soldBy")}
              <span className="text-muted-foreground font-normal">
                {" "}
                ({t("optional")})
              </span>
            </Label>
            <Select
              value={form.clinicId}
              onValueChange={(value) => setField("clinicId", value)}
            >
              <SelectTrigger id="clinic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CLINIC_NONE}>{t("noClinic")}</SelectItem>
                {clinicOptions.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setField("status", value as OrderManualStatus)
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_MANUAL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {tStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending || productsLoading}>
              {isPending ? t("saving") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
