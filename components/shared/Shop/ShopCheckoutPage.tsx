"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createPublicOrder } from "@/lib/api/public";
import { usePublicShopProduct } from "@/lib/queries/usePublicShopProduct";
import { thbFormatter } from "@/lib/utils";
import { ShopQuantitySelector } from "./ShopQuantitySelector";
import { shopInputClass } from "./shop-theme";

type Props = {
  clinicId: string;
  productId: string;
};

export function ShopCheckoutPage({ clinicId, productId }: Props) {
  const t = useTranslations("shop.checkout");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading } = usePublicShopProduct(clinicId, productId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxQuantity = Math.max(1, data?.product.stockAvailable ?? 1);
  const initialQty = Math.min(
    maxQuantity,
    Math.max(1, Number(searchParams.get("quantity")) || 1)
  );

  const [quantity, setQuantity] = useState(initialQty);

  useEffect(() => {
    setQuantity(initialQty);
  }, [initialQty]);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddressStreet: "",
    shippingAddressCity: "",
    shippingAddressCode: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createPublicOrder({
        clinicId,
        productId,
        quantity,
        ...form,
      });
      router.push(
        `/shop/${clinicId}/${productId}/checkout/pay?orderId=${result.orderId}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Insufficient stock")) {
        setError(t("insufficientStock"));
      } else {
        setError(t("error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-48 items-center justify-center text-[#6B6560]">
        {t("submitting")}
      </div>
    );
  }

  const total = data.product.price * quantity;
  const productImage =
    data.product.images[0] ?? data.product.image ?? null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/shop/${clinicId}/${productId}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[#6B6560] transition-colors hover:text-[#2A2A2A]"
      >
        <ArrowLeft size={15} />
        {t("backToProduct")}
      </Link>

      <h1
        className="text-3xl font-medium text-[#2A2A2A]"
        style={{ fontFamily: "var(--font-shop-serif), serif" }}
      >
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-2">
          <section className="border border-[#E8DFD4] bg-[#FFFCF8] p-6">
            <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[#6B6560]">
              {t("customerInfo")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="name" className="text-sm text-[#4A4541]">
                  {t("name")}
                </label>
                <input
                  id="name"
                  required
                  className={shopInputClass}
                  value={form.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-[#4A4541]">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className={shopInputClass}
                  value={form.customerEmail}
                  onChange={(e) => handleChange("customerEmail", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm text-[#4A4541]">
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className={shopInputClass}
                  value={form.customerPhone}
                  onChange={(e) => handleChange("customerPhone", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="street" className="text-sm text-[#4A4541]">
                  {t("addressStreet")}
                </label>
                <input
                  id="street"
                  required
                  className={shopInputClass}
                  value={form.shippingAddressStreet}
                  onChange={(e) =>
                    handleChange("shippingAddressStreet", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm text-[#4A4541]">
                  {t("addressCity")}
                </label>
                <input
                  id="city"
                  required
                  className={shopInputClass}
                  value={form.shippingAddressCity}
                  onChange={(e) =>
                    handleChange("shippingAddressCity", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="code" className="text-sm text-[#4A4541]">
                  {t("addressCode")}
                </label>
                <input
                  id="code"
                  required
                  className={shopInputClass}
                  value={form.shippingAddressCode}
                  onChange={(e) =>
                    handleChange("shippingAddressCode", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !data.product.inStock}
            className="inline-flex h-12 items-center justify-center bg-[#3D5A4C] px-8 text-sm font-medium uppercase tracking-[0.18em] text-[#FFFCF8] transition-colors hover:bg-[#2F4839] disabled:opacity-50"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>

        <aside className="h-fit border border-[#E8DFD4] bg-[#FFFCF8] p-6">
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[#6B6560]">
            {t("orderSummary")}
          </h2>
          <div className="flex flex-col gap-5">
            {productImage && (
              <div className="overflow-hidden rounded-sm bg-[#F3EDE4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImage}
                  alt={data.product.name}
                  className="aspect-square w-full max-w-[140px] object-cover"
                />
              </div>
            )}
            <p
              className="text-xl font-medium text-[#2A2A2A]"
              style={{ fontFamily: "var(--font-shop-serif), serif" }}
            >
              {data.product.name}
            </p>
            <ShopQuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={maxQuantity}
              disabled={submitting}
            />
            <div className="flex justify-between border-t border-[#E8DFD4] pt-4 text-sm">
              <span className="text-[#6B6560]">{t("subtotal")}</span>
              <span>{thbFormatter.format(total)}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span>{t("total")}</span>
              <span>{thbFormatter.format(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
