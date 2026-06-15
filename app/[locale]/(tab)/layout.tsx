import { AppHeader, AppSidebar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
