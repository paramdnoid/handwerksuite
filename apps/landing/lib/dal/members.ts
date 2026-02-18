import { db } from "@zunftgewerk/db/client";
import {
  companyMembers,
  invitations,
  users,
} from "@zunftgewerk/db/schema";
import { eq, and, isNull, gt } from "drizzle-orm";
import crypto from "crypto";

// ── Get Company Members ─────────────────────────────────

export async function getCompanyMembers(companyId: string) {
  const members = await db
    .select({
      id: companyMembers.id,
      companyId: companyMembers.companyId,
      userId: companyMembers.userId,
      role: companyMembers.role,
      invitedBy: companyMembers.invitedBy,
      joinedAt: companyMembers.joinedAt,
      leftAt: companyMembers.leftAt,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(companyMembers)
    .innerJoin(users, eq(companyMembers.userId, users.id))
    .where(
      and(
        eq(companyMembers.companyId, companyId),
        isNull(companyMembers.leftAt),
      ),
    )
    .orderBy(companyMembers.joinedAt);

  return members;
}

// ── Get Pending Invitations ─────────────────────────────

export async function getPendingInvitations(companyId: string) {
  const pending = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.companyId, companyId),
        isNull(invitations.acceptedAt),
        gt(invitations.expiresAt, new Date()),
      ),
    )
    .orderBy(invitations.createdAt);

  return pending;
}

// ── Create Invitation ───────────────────────────────────

export async function createInvitation(opts: {
  companyId: string;
  email: string;
  role: "admin" | "manager" | "employee" | "readonly";
  invitedBy: string;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const [invitation] = await db
    .insert(invitations)
    .values({
      companyId: opts.companyId,
      email: opts.email,
      role: opts.role,
      invitedBy: opts.invitedBy,
      token,
      expiresAt,
    })
    .returning();

  return invitation;
}

// ── Cancel Invitation ───────────────────────────────────

export async function cancelInvitation(
  invitationId: string,
  companyId: string,
) {
  await db
    .delete(invitations)
    .where(
      and(
        eq(invitations.id, invitationId),
        eq(invitations.companyId, companyId),
      ),
    );
}

// ── Remove Member ───────────────────────────────────────

export async function removeMember(memberId: string, companyId: string) {
  await db
    .update(companyMembers)
    .set({ leftAt: new Date() })
    .where(
      and(
        eq(companyMembers.id, memberId),
        eq(companyMembers.companyId, companyId),
      ),
    );
}

// ── Update Member Role ──────────────────────────────────

export async function updateMemberRole(
  memberId: string,
  companyId: string,
  role: "admin" | "manager" | "employee" | "readonly",
) {
  await db
    .update(companyMembers)
    .set({ role })
    .where(
      and(
        eq(companyMembers.id, memberId),
        eq(companyMembers.companyId, companyId),
      ),
    );
}
