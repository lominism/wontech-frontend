"use client";

/**
 * WorkSpaceSwitcher
 *
 * Static brand header for the top of the sidebar. The workspace-switching
 * dropdown was removed — this is now a fixed slot for the company logo.
 * Drop the real logo into the `.logo` placeholder below when it's ready.
 */

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function WorkSpaceSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-14 items-center gap-3 px-1">
          {/* Logo placeholder — replace this block with an <img>/<Image> later */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-lg font-bold">W</span>
          </div>

          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-lg font-extrabold tracking-tight text-sidebar-accent-foreground">
              WONTECH
            </span>
            <span className="truncate text-[11px] font-semibold uppercase tracking-widest text-sidebar-primary">
              Admin Back Office
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
