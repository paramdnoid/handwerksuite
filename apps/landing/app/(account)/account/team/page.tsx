import { requireUserWithCompany } from "@/lib/dal/auth";
import { getCompanyMembers, getPendingInvitations } from "@/lib/dal/members";
import { TeamManagement } from "@/components/account/team-management";

export default async function TeamPage() {
  const ctx = await requireUserWithCompany();

  const [members, invitations] = await Promise.all([
    getCompanyMembers(ctx.company.id),
    getPendingInvitations(ctx.company.id),
  ]);

  return (
    <TeamManagement
      members={members}
      invitations={invitations}
      currentUserId={ctx.user.id}
    />
  );
}
