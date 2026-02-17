import { Link } from "react-router-dom";
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
    <AppSidebarShell className="pt-5.75" subtitle="Desktop" footer={<NavUser />} {...props}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive tooltip="Dashboard">
          <Link to="/dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </AppSidebarShell>
  );
}
