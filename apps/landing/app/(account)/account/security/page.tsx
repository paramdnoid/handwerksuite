import { requireSession } from "@/lib/dal/auth";
import { getUserSessions } from "@/lib/dal/sessions";
import { SecuritySettings } from "@/components/account/security-settings";

export default async function SecurityPage() {
  const session = await requireSession();
  const sessions = await getUserSessions(
    session.user.id,
    session.session.token,
  );

  return (
    <SecuritySettings
      sessions={sessions}
      currentSessionId={session.session.id}
    />
  );
}
