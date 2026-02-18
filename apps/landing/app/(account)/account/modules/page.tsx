import { requireUserWithCompany } from "@/lib/dal/auth";
import { getCompanyModules } from "@/lib/dal/modules";
import { ModulesManager } from "@/components/account/modules-manager";

export default async function ModulesPage() {
  const ctx = await requireUserWithCompany();
  const modules = await getCompanyModules(
    ctx.company.id,
    ctx.company.craftType,
  );

  return <ModulesManager modules={modules} />;
}
