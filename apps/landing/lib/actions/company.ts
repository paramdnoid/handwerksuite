"use server";

import { revalidatePath } from "next/cache";
import { requireUserWithCompany } from "@/lib/dal/auth";
import {
  updateCompany,
  updateCompanySettings,
} from "@/lib/dal/company";
import {
  updateCompanySchema,
  updateTaxDataSchema,
  updateCompanySettingsSchema,
} from "@/lib/validations";

// ── Action Result Type ──────────────────────────────────

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ── Update Company Base Info ────────────────────────────

export async function updateCompanyAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  const raw = {
    name: formData.get("name") as string,
    legalName: (formData.get("legalName") as string) || undefined,
    craftType: formData.get("craftType") as string,
  };

  const result = updateCompanySchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.errors) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  try {
    await updateCompany(ctx.company.id, result.data);
    revalidatePath("/account");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Speichern." };
  }
}

// ── Update Tax Data ─────────────────────────────────────

export async function updateTaxDataAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  const raw = {
    taxId: (formData.get("taxId") as string) || undefined,
    vatId: (formData.get("vatId") as string) || undefined,
    hwkNumber: (formData.get("hwkNumber") as string) || undefined,
  };

  const result = updateTaxDataSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: "Validierung fehlgeschlagen." };
  }

  try {
    await updateCompany(ctx.company.id, result.data);
    revalidatePath("/account/company");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Speichern." };
  }
}

// ── Update Company Settings ─────────────────────────────

export async function updateCompanySettingsAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  const raw = {
    locale: formData.get("locale") as string,
    timezone: formData.get("timezone") as string,
    currency: formData.get("currency") as string,
    defaultTaxRate: formData.get("defaultTaxRate") as string,
    invoicePrefix: (formData.get("invoicePrefix") as string) || undefined,
    fiscalYearStartMonth: formData.get("fiscalYearStartMonth") as string,
  };

  const result = updateCompanySettingsSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: "Validierung fehlgeschlagen." };
  }

  try {
    await updateCompanySettings(ctx.company.id, {
      ...result.data,
      defaultTaxRate: result.data.defaultTaxRate,
    });
    revalidatePath("/account/company");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Speichern." };
  }
}
