import { db } from "@zunftgewerk/db/client";
import {
  subscriptions,
  invoices,
  companyMembers,
  projects,
  customers,
} from "@zunftgewerk/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import type { SubscriptionTier } from "@zunftgewerk/types";
import { getSubscriptionLimits } from "@zunftgewerk/stripe/plans";

// ── Get Active Subscription ─────────────────────────────

export async function getActiveSubscription(companyId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.companyId, companyId),
      eq(subscriptions.status, "active"),
    ),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  return subscription ?? null;
}

// ── Get Subscription with Plan Details ──────────────────

export async function getSubscriptionWithPlan(companyId: string, tier: SubscriptionTier) {
  const subscription = await getActiveSubscription(companyId);
  const limits = getSubscriptionLimits(tier);

  return {
    subscription,
    limits,
    tier,
  };
}

// ── Get Current Usage ───────────────────────────────────

export async function getCurrentUsage(companyId: string) {
  const [memberCount] = await db
    .select({ value: count() })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.companyId, companyId),
        isNull(companyMembers.leftAt),
      ),
    );

  const [projectCount] = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.companyId, companyId));

  const [customerCount] = await db
    .select({ value: count() })
    .from(customers)
    .where(eq(customers.companyId, companyId));

  return {
    users: memberCount?.value ?? 0,
    projects: projectCount?.value ?? 0,
    customers: customerCount?.value ?? 0,
    storageMb: 0,
  };
}

// ── Get Invoices ────────────────────────────────────────

export async function getInvoices(companyId: string, limit = 20) {
  const result = await db
    .select()
    .from(invoices)
    .where(eq(invoices.companyId, companyId))
    .orderBy(invoices.createdAt)
    .limit(limit);

  return result;
}
