import { requireUserWithCompany } from "@/lib/dal/auth";
import {
  getSubscriptionWithPlan,
  getCurrentUsage,
  getInvoices,
} from "@/lib/dal/subscription";
import { getAllPlans } from "@zunftgewerk/stripe/plans";
import { SubscriptionView } from "@/components/account/subscription-view";
import type { SubscriptionTier } from "@zunftgewerk/types";

export default async function SubscriptionPage() {
  const ctx = await requireUserWithCompany();

  const [subscriptionData, usage, invoices] = await Promise.all([
    getSubscriptionWithPlan(
      ctx.company.id,
      ctx.company.subscriptionTier as SubscriptionTier,
    ),
    getCurrentUsage(ctx.company.id),
    getInvoices(ctx.company.id),
  ]);

  const plans = getAllPlans();

  return (
    <SubscriptionView
      subscription={subscriptionData.subscription}
      tier={subscriptionData.tier}
      limits={subscriptionData.limits}
      currentUsage={usage}
      plans={plans}
      invoices={invoices}
      hasStripeCustomer={!!ctx.company.stripeCustomerId}
    />
  );
}
