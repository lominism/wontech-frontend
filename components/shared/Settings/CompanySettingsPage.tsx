"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgenciesPanel } from "./AgenciesPanel";
import { ProductCategoriesPanel } from "./ProductCategoriesPanel";

export function CompanySettingsPage() {
  const t = useTranslations("settings.company");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      <Tabs defaultValue="product-categories" className="gap-6">
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="product-categories"
            className="flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 pt-0 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {t("tabs.productCategories")}
          </TabsTrigger>
          <TabsTrigger
            value="agency"
            className="flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 pt-0 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {t("tabs.agency")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product-categories" className="mt-0">
          <ProductCategoriesPanel />
        </TabsContent>

        <TabsContent value="agency" className="mt-0">
          <AgenciesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
