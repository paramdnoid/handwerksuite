import Link from "next/link";
import { Separator } from "@zunftgewerk/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projekte" },
  { href: "/customers", label: "Kunden" },
  { href: "/invoices", label: "Rechnungen" },
  { href: "/settings", label: "Einstellungen" },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar-background flex flex-col">
        <div className="flex h-16 items-center px-6">
          <span className="text-lg font-bold text-sidebar-primary">
            ZunftGewerk
          </span>
        </div>
        <Separator />
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Sync-Status: Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Max Müller</span>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
