import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /** Logo image source path */
  logoSrc?: string;
  /** Subtitle displayed below the brand name (e.g. "Webapp", "Desktop") */
  subtitle?: string;
  /** Content rendered in the footer area (e.g. NavUser) */
  footer?: React.ReactNode;
}

function AppSidebar({
  children,
  footer,
  logoSrc = "/logo.png",
  subtitle = "Webapp",
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="items-center">
              <img
                src={logoSrc}
                alt="ZunftGewerk"
                className="size-9 rounded-lg -ml-2"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  <span className="text-foreground">Zunft</span>
                  <span className="text-muted-foreground">Gewerk</span>
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {subtitle}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar, type AppSidebarProps };
