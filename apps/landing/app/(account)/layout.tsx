import { SidebarProvider, SidebarInset } from "@zunftgewerk/ui";
import { AppSidebar } from "@/components/account/app-sidebar";
import { requireUserWithCompany } from "@/lib/dal/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireUserWithCompany();

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: ctx.user.name,
          email: ctx.user.email,
          image: ctx.user.image,
        }}
      />
      <SidebarInset className="overflow-y-auto">
        <div className="flex flex-col gap-6 px-6 pt-3 pb-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
