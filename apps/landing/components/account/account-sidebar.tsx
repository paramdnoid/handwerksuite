"use client";

import { Building2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@zunftgewerk/ui";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { mockUser, mockCompany } from "@/lib/mock-data";

export function AccountSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {mockCompany.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {mockCompany.subscriptionTier === "professional"
                    ? "Professional"
                    : mockCompany.subscriptionTier === "starter"
                      ? "Starter"
                      : mockCompany.subscriptionTier === "enterprise"
                        ? "Enterprise"
                        : "Free"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={mockUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
