import { SidebarProvider, SidebarInset } from "@zunftgewerk/ui";
import { AppSidebar } from "@/components/account/app-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-y-auto">
        <div className="flex flex-col gap-6 px-6 pt-3 pb-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
