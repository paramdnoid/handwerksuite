"use server";

import { revalidatePath } from "next/cache";
import { requireUserWithCompany } from "@/lib/dal/auth";
import {
  createInvitation,
  cancelInvitation,
  removeMember,
  updateMemberRole,
} from "@/lib/dal/members";
import { inviteMemberSchema, updateMemberRoleSchema } from "@/lib/validations";

// ── Action Result Type ──────────────────────────────────

type ActionResult = {
  success: boolean;
  error?: string;
};

// ── Invite Member ───────────────────────────────────────

export async function inviteMemberAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  const raw = {
    email: formData.get("email") as string,
    role: formData.get("role") as string,
  };

  const result = inviteMemberSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message };
  }

  try {
    await createInvitation({
      companyId: ctx.company.id,
      email: result.data.email,
      role: result.data.role,
      invitedBy: ctx.user.id,
    });
    revalidatePath("/account/team");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Erstellen der Einladung." };
  }
}

// ── Cancel Invitation ───────────────────────────────────

export async function cancelInvitationAction(
  invitationId: string,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  try {
    await cancelInvitation(invitationId, ctx.company.id);
    revalidatePath("/account/team");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Stornieren." };
  }
}

// ── Remove Member ───────────────────────────────────────

export async function removeMemberAction(
  memberId: string,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  try {
    await removeMember(memberId, ctx.company.id);
    revalidatePath("/account/team");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Entfernen." };
  }
}

// ── Update Member Role ──────────────────────────────────

export async function updateMemberRoleAction(
  memberId: string,
  role: string,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  const result = updateMemberRoleSchema.safeParse({ memberId, role });
  if (!result.success) {
    return { success: false, error: "Ungültige Rolle." };
  }

  try {
    await updateMemberRole(memberId, ctx.company.id, result.data.role);
    revalidatePath("/account/team");
    return { success: true };
  } catch {
    return { success: false, error: "Fehler beim Ändern der Rolle." };
  }
}
