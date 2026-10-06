"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { LanguagePanel } from "./LanguagePanel";

export function AccountSettingsPage() {
  const t = useTranslations("settings.account");

  return (
    <Tabs
      defaultValue="personal-info"
      orientation="vertical"
      className="flex min-h-[calc(100vh-8rem)] w-full flex-col gap-6 sm:flex-row sm:gap-0"
    >
      <aside className="flex w-full shrink-0 flex-col border-b border-primary/30 sm:w-56 sm:border-b-0 sm:border-r sm:pr-6">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">{t("title")}</h1>
        <TabsList className="flex h-auto w-full flex-col items-stretch gap-1 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="personal-info"
            className="justify-start rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground shadow-none hover:bg-muted/60 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {t("tabs.personalInfo")}
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="justify-start rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground shadow-none hover:bg-muted/60 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {t("tabs.language")}
          </TabsTrigger>
        </TabsList>
      </aside>

      <div className="min-w-0 flex-1 sm:pl-8">
        <TabsContent value="personal-info" className="mt-0">
          <PersonalInfoPanel />
        </TabsContent>

        <TabsContent value="language" className="mt-0">
          <LanguagePanel />
        </TabsContent>
      </div>
    </Tabs>
  );
}
