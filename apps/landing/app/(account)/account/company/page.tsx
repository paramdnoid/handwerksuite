import { requireUserWithCompany } from "@/lib/dal/auth";
import { getCompanyWithSettings } from "@/lib/dal/company";
import { CompanyForm } from "@/components/account/company-form";

export default async function CompanyPage() {
  const ctx = await requireUserWithCompany();
  const companyWithSettings = await getCompanyWithSettings(ctx.company.id);

  if (!companyWithSettings) {
    return <p>Unternehmensdaten konnten nicht geladen werden.</p>;
  }

  return (
    <CompanyForm
      company={companyWithSettings}
      settings={companyWithSettings.settings ?? null}
    />
  );
}
