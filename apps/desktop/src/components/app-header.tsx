import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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
  "/dashboard": "Dashboard",
  "/projects": "Projekte",
  "/customers": "Kunden",
  "/invoices": "Rechnungen",
  "/settings": "Einstellungen",
};

export function AppHeader() {
  const { pathname } = useLocation();
  const pageTitle = breadcrumbMap[pathname] ?? "Seite";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 drag-region">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link to="/dashboard">ZunftGewerk</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
