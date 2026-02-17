import { SidebarProvider, SidebarInset } from "@zunftgewerk/ui";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHeader } from "@/components/account/account-header";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AccountSidebar />
      <SidebarInset>
        <AccountHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
