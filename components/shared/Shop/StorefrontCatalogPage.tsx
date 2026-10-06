"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useStorefrontProducts } from "@/lib/queries/useStorefrontProducts";
import { thbFormatter } from "@/lib/utils";
import { shopInputClass } from "./shop-theme";

export function StorefrontCatalogPage() {
  const t = useTranslations("shop.storefront");
  const { data: products = [], isLoading, isError, refetch } =
    useStorefrontProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((product) => product.category)
        .filter((value): value is string => Boolean(value))
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.brand?.toLowerCase().includes(query) ?? false);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1
          className="text-4xl font-medium leading-tight text-[#2A2A2A] sm:text-5xl"
          style={{ fontFamily: "var(--font-shop-serif), serif" }}
        >
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#6B6560]">
          {t("description")}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6560]"
            size={16}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`${shopInputClass} pl-10`}
            aria-label={t("searchPlaceholder")}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${shopInputClass} sm:w-[220px]`}
          aria-label={t("allCategories")}
        >
          <option value="all">{t("allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-[#6B6560]">
          {t("loading")}
        </div>
      ) : isError ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-red-700">
          <p className="text-sm">{t("loadError")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("retry")}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center border border-[#E8DFD4] bg-[#FFFCF8] text-sm text-[#6B6560]">
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const image =
              product.images[0] ?? product.image ?? null;
            return (
              <Link
                key={product.id}
                href={`/storefront/${product.id}`}
                className="group flex flex-col border border-[#E8DFD4] bg-[#FFFCF8] transition-colors hover:border-[#3D5A4C]/50"
              >
                <div className="aspect-square overflow-hidden bg-[#F3EDE4]">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#6B6560]">
                      {product.name}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {product.brand ? (
                    <p className="text-xs uppercase tracking-[0.16em] text-[#3D5A4C]">
                      {product.brand}
                    </p>
                  ) : null}
                  <h2
                    className="text-xl font-medium text-[#2A2A2A]"
                    style={{ fontFamily: "var(--font-shop-serif), serif" }}
                  >
                    {product.name}
                  </h2>
                  {product.category ? (
                    <p className="text-sm text-[#6B6560]">{product.category}</p>
                  ) : null}
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <p className="text-lg font-medium text-[#2A2A2A]">
                      {thbFormatter.format(product.price)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6B6560]">
                      {product.inStock ? t("inStock") : t("outOfStock")}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
