"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@zunftgewerk/auth/server";
import { requireSession } from "@/lib/dal/auth";
import {
  revokeSession,
  revokeAllOtherSessions,
} from "@/lib/dal/sessions";
import { changePasswordSchema } from "@/lib/validations";

// ── Action Result Type ──────────────────────────────────

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ── Change Password ─────────────────────────────────────

export async function changePasswordAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = changePasswordSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.errors) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  try {
    const headersList = await headers();
    await auth.api.changePassword({
      headers: headersList,
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
    });
    revalidatePath("/account/security");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Passwort konnte nicht geändert werden. Bitte überprüfen Sie Ihr aktuelles Passwort.",
    };
  }
}

// ── Revoke Session ──────────────────────────────────────

export async function revokeSessionAction(
  sessionId: string,
): Promise<ActionResult> {
  const session = await requireSession();

  try {
    await revokeSession(sessionId, session.user.id);
    revalidatePath("/account/security");
    return { success: true };
  } catch {
    return { success: false, error: "Sitzung konnte nicht beendet werden." };
  }
}

// ── Revoke All Other Sessions ───────────────────────────

export async function revokeAllSessionsAction(): Promise<ActionResult> {
  const session = await requireSession();

  try {
    await revokeAllOtherSessions(session.user.id, session.session.token);
    revalidatePath("/account/security");
    return { success: true };
  } catch {
    return { success: false, error: "Sitzungen konnten nicht beendet werden." };
  }
}

// ── Delete Account ──────────────────────────────────────

export async function deleteAccountAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "Passwort ist erforderlich." };
  }

  try {
    const headersList = await headers();
    await auth.api.deleteUser({
      headers: headersList,
      body: { password },
    });
    redirect("/");
  } catch {
    return {
      success: false,
      error: "Account konnte nicht gelöscht werden. Bitte überprüfen Sie Ihr Passwort.",
    };
  }
}
