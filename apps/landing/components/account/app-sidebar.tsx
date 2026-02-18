"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Puzzle,
  Shield,
} from "lucide-react";
import {
  AppSidebar as AppSidebarShell,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@zunftgewerk/ui";
import { NavUser } from "./nav-user";

const navItems = [
  { title: "Übersicht", href: "/account", icon: LayoutDashboard },
  { title: "Unternehmen", href: "/account/company", icon: Building2 },
  { title: "Abonnement", href: "/account/subscription", icon: CreditCard },
  { title: "Team", href: "/account/team", icon: Users },
  { title: "Module", href: "/account/modules", icon: Puzzle },
  { title: "Sicherheit", href: "/account/security", icon: Shield },
];

interface AppSidebarProps extends React.ComponentProps<typeof AppSidebarShell> {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <AppSidebarShell
      subtitle="Account"
      footer={<NavUser user={user} />}
      {...props}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
              <Link href={item.href}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </AppSidebarShell>
  );
}
