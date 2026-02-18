import { db } from "@zunftgewerk/db/client";
import { companies, companySettings } from "@zunftgewerk/db/schema";
import { eq } from "drizzle-orm";

// ── Get Company ─────────────────────────────────────────

export async function getCompany(companyId: string) {
  return db.query.companies.findFirst({
    where: eq(companies.id, companyId),
  });
}

// ── Get Company with Settings ───────────────────────────

export async function getCompanyWithSettings(companyId: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    with: {
      settings: true,
    },
  });

  return company;
}

// ── Update Company ──────────────────────────────────────

export async function updateCompany(
  companyId: string,
  data: {
    name?: string;
    legalName?: string | null;
    craftType?: string;
    taxId?: string | null;
    vatId?: string | null;
    hwkNumber?: string | null;
  },
) {
  await db
    .update(companies)
    .set({
      ...data,
      craftType: data.craftType as any,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, companyId));
}

// ── Update Company Settings ─────────────────────────────

export async function updateCompanySettings(
  companyId: string,
  data: {
    locale?: string;
    timezone?: string;
    currency?: string;
    defaultTaxRate?: string;
    invoicePrefix?: string | null;
    fiscalYearStartMonth?: number;
  },
) {
  await db
    .update(companySettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(companySettings.companyId, companyId));
}
