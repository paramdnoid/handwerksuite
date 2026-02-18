"use server";

import { revalidatePath } from "next/cache";
import { requireUserWithCompany } from "@/lib/dal/auth";
import { toggleModule } from "@/lib/dal/modules";

// ── Action Result Type ──────────────────────────────────

type ActionResult = {
  success: boolean;
  error?: string;
};

// ── Toggle Module ───────────────────────────────────────

export async function toggleModuleAction(
  moduleId: string,
  isActive: boolean,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  try {
    await toggleModule(ctx.company.id, moduleId, isActive, ctx.user.id);
    revalidatePath("/account/modules");
    return { success: true };
  } catch {
    return { success: false, error: "Modul konnte nicht umgeschaltet werden." };
  }
}
