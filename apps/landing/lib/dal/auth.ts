import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@zunftgewerk/auth/server";
import { db } from "@zunftgewerk/db/client";
import { companies, companyMembers } from "@zunftgewerk/db/schema";
import { eq, isNull, and } from "drizzle-orm";

// ── Types ───────────────────────────────────────────────

export interface ServerSession {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
  };
}

export interface UserWithCompany {
  user: ServerSession["user"];
  session: ServerSession["session"];
  company: {
    id: string;
    slug: string;
    name: string;
    legalName: string | null;
    companyType: string;
    craftType: string | null;
    subscriptionTier: string;
    stripeCustomerId: string | null;
    isActive: boolean;
  };
  membership: {
    id: string;
    role: string;
    joinedAt: Date;
  };
}

// ── Get Server Session ──────────────────────────────────

export async function getServerSession(): Promise<ServerSession | null> {
  const headersList = await headers();
  const sessionData = await auth.api.getSession({
    headers: headersList,
  });

  if (!sessionData?.user || !sessionData?.session) {
    return null;
  }

  return {
    user: {
      id: sessionData.user.id,
      name: sessionData.user.name,
      email: sessionData.user.email,
      emailVerified: sessionData.user.emailVerified,
      image: sessionData.user.image ?? null,
    },
    session: {
      id: sessionData.session.id,
      token: sessionData.session.token,
      userId: sessionData.session.userId,
      expiresAt: sessionData.session.expiresAt,
    },
  };
}

// ── Require Session (redirects if not authenticated) ────

export async function requireSession(): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

// ── Get Current User with Company ───────────────────────

export async function getCurrentUserWithCompany(): Promise<UserWithCompany | null> {
  const session = await getServerSession();
  if (!session) return null;

  const membership = await db
    .select({
      memberId: companyMembers.id,
      role: companyMembers.role,
      joinedAt: companyMembers.joinedAt,
      companyId: companies.id,
      companySlug: companies.slug,
      companyName: companies.name,
      companyLegalName: companies.legalName,
      companyType: companies.companyType,
      craftType: companies.craftType,
      subscriptionTier: companies.subscriptionTier,
      stripeCustomerId: companies.stripeCustomerId,
      isActive: companies.isActive,
    })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(
      and(
        eq(companyMembers.userId, session.user.id),
        isNull(companyMembers.leftAt),
        isNull(companies.deletedAt),
      ),
    )
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!membership) return null;

  return {
    user: session.user,
    session: session.session,
    company: {
      id: membership.companyId,
      slug: membership.companySlug,
      name: membership.companyName,
      legalName: membership.companyLegalName,
      companyType: membership.companyType,
      craftType: membership.craftType,
      subscriptionTier: membership.subscriptionTier,
      stripeCustomerId: membership.stripeCustomerId,
      isActive: membership.isActive,
    },
    membership: {
      id: membership.memberId,
      role: membership.role,
      joinedAt: membership.joinedAt,
    },
  };
}

// ── Require User with Company ───────────────────────────

export async function requireUserWithCompany(): Promise<UserWithCompany> {
  const data = await getCurrentUserWithCompany();
  if (!data) {
    redirect("/login");
  }
  return data;
}
