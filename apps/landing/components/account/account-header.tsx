"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from "@zunftgewerk/ui";

const breadcrumbMap: Record<string, string> = {
  "/account": "Übersicht",
  "/account/company": "Unternehmen",
  "/account/subscription": "Abonnement",
  "/account/team": "Team",
  "/account/modules": "Module",
  "/account/security": "Sicherheit",
};

export function AccountHeader() {
  const pathname = usePathname();
  const pageTitle = breadcrumbMap[pathname] ?? "Account";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/account">Mein Konto</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathname !== "/account" && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {pathname === "/account" && (
            <BreadcrumbItem className="md:hidden">
              <BreadcrumbPage>Übersicht</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
