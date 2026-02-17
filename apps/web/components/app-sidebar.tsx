"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import {
  AppSidebar as AppSidebarShell,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@zunftgewerk/ui";
import { NavUser } from "./nav-user";

export function AppSidebar(
  props: React.ComponentProps<typeof AppSidebarShell>,
) {
  return (
    <AppSidebarShell footer={<NavUser />} {...props}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive tooltip="Dashboard">
          <Link href="/dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </AppSidebarShell>
  );
}
