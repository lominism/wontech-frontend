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
import { WorkSpaceSwitcher } from "@/components/shared/WorkSpaceSwitcher";
import { Link } from "@/i18n/navigation";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Columns3Cog,
  Contact2,
  GitBranch,
  Package,
  Settings2,
  Star,
  Users2,
  Wrench,
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
      jobmenu: [
        {
          title: (
            <>
              <ClipboardList size={16} />
              {t("tasks")}
            </>
          ),
          url: "/tasks",
          isActive: slug.startsWith(`/${locale}/tasks`),
        },
        {
          title: (
            <>
              <Wrench size={16} />
              {t("technicians")}
            </>
          ),
          url: "/technicians",
          isActive: slug.startsWith(`/${locale}/technicians`),
        },
        {
          title: (
            <>
              <Star size={16} />
              {t("reviews")}
            </>
          ),
          url: "/reviews",
          isActive: slug.startsWith(`/${locale}/reviews`),
        },
      ],
      orgmenu: [
        {
          title: (
            <>
              <Building2 size={16} />
              {t("companies")}
            </>
          ),
          url: "/companies",
          isActive: slug.startsWith(`/${locale}/companies`),
        },
        {
          title: (
            <>
              <GitBranch size={16} />
              {t("branches")}
            </>
          ),
          url: "/branches",
          isActive: slug.startsWith(`/${locale}/branches`),
        },
        {
          title: (
            <>
              <Package size={16} />
              {t("products")}
            </>
          ),
          url: "/products",
          isActive: slug.startsWith(`/${locale}/products`),
        },
      ],
      settingsmenu: [
        {
          title: (
            <>
              <Users2 size={16} />
              {t("members")}
            </>
          ),
          url: "/members",
          isActive: slug.startsWith(`/${locale}/members`),
        },
        {
          title: (
            <>
              <Contact2 size={16} />
              {t("personnel")}
            </>
          ),
          url: "/personnel",
          isActive: slug.startsWith(`/${locale}/personnel`),
        },
        {
          title: (
            <>
              <Columns3Cog size={16} />
              {t("configurations")}
            </>
          ),
          url: "/settings",
          isActive: slug.startsWith(`/${locale}/settings`),
        },
      ],
    };

    return (
      <Sidebar className="border-r-0" collapsible="offcanvas" {...props}>
        <SidebarHeader className="gap-4 pt-4">
          <div className="flex w-full px-2 flex-col gap-3">
            <WorkSpaceSwitcher />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 select-none gap-6">
          <MenuGroup
            data={data.jobmenu}
            groupTitle="heading.JobsManagement"
            groupIcon={<Briefcase className="mr-2" size={16} />}
          />

          <MenuGroup
            data={data.orgmenu}
            groupTitle="heading.OrgManagement"
            groupIcon={<Building2 className="mr-2" size={16} />}
          />

          <MenuGroup
            data={data.settingsmenu}
            groupTitle="heading.settings"
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
