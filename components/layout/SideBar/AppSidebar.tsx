"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import ProfileAccount from "@/components/shared/AccountSettings/profile-account";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher/LanguageSwitcher";
import { WontechLogo } from "@/components/shared/WontechLogo";
import { Link } from "@/i18n/navigation";
import {
  FileDown,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarMenuItemType = {
  title: React.ReactNode;
  url: string;
  isActive: boolean;
};

type MenuGroupProps = {
  data: SidebarMenuItemType[];
  groupTitle: string;
  groupIcon: React.ReactNode;
};

const MenuGroup = ({ data, groupTitle, groupIcon }: MenuGroupProps) => {
  const t = useTranslations("common.navigation");
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/80 font-semibold capitalize">
        {groupIcon}
        <span>{t(groupTitle)}</span>
      </SidebarGroupLabel>
      <SidebarMenu className="ml-4 px-2 mt-1 border-l border-sidebar-border">
        {data.map((item, index) => (
          <SidebarMenuItem key={`menu-item-${index}`}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              className={cn(
                "text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.isActive &&
                  "bg-sidebar-primary text-sidebar-primary-foreground"
              )}
            >
              <Link href={item.url}>{item.title}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

const AppSidebar = React.memo(
  ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const slug = usePathname();
    const t = useTranslations("common.navigation");
    const locale = useLocale();

    const data = {
      overviewmenu: [
        {
          title: (
            <>
              <LayoutDashboard size={16} />
              {t("dashboard")}
            </>
          ),
          url: "/dashboard",
          isActive: slug.startsWith(`/${locale}/dashboard`),
        },
      ],
      salesmenu: [
        {
          title: (
            <>
              <ShoppingCart size={16} />
              {t("orders")}
            </>
          ),
          url: "/orders",
          isActive: slug.startsWith(`/${locale}/orders`),
        },
        {
          title: (
            <>
              <Truck size={16} />
              {t("logistics")}
            </>
          ),
          url: "/logistics",
          isActive: slug.startsWith(`/${locale}/logistics`),
        },
      ],
      managementmenu: [
        {
          title: (
            <>
              <Stethoscope size={16} />
              {t("clinic")}
            </>
          ),
          url: "/clinic",
          isActive: slug.startsWith(`/${locale}/clinic`),
        },
        {
          title: (
            <>
              <Package size={16} />
              {t("inventory")}
            </>
          ),
          url: "/inventory",
          isActive: slug.startsWith(`/${locale}/inventory`),
        },
        {
          title: (
            <>
              <FileDown size={16} />
              {t("reportsExport")}
            </>
          ),
          url: "/export",
          isActive: slug.startsWith(`/${locale}/export`),
        },
      ],
    };

    return (
      <Sidebar className="border-r-0" collapsible="offcanvas" {...props}>
        <SidebarHeader className="gap-4 pt-4">
          <div className="flex w-full px-2 flex-col gap-3">
            <WontechLogo />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 select-none gap-6">
          <MenuGroup
            data={data.overviewmenu}
            groupTitle="heading.overview"
            groupIcon={<LayoutDashboard className="mr-2" size={16} />}
          />

          <MenuGroup
            data={data.salesmenu}
            groupTitle="heading.sales"
            groupIcon={<TrendingUp className="mr-2" size={16} />}
          />

          <MenuGroup
            data={data.managementmenu}
            groupTitle="heading.management"
            groupIcon={<Settings2 className="mr-2" size={16} />}
          />
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <LanguageSwitcher />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ProfileAccount />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }
);

AppSidebar.displayName = "AppSidebar";

export default AppSidebar;
