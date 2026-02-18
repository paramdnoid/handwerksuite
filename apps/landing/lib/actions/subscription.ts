"use server";

import { requireUserWithCompany } from "@/lib/dal/auth";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getOrCreateStripeCustomer,
  getStripe,
} from "@zunftgewerk/stripe";
import { getActiveSubscription } from "@/lib/dal/subscription";

// ── Action Result Type ──────────────────────────────────

type ActionResult = {
  success: boolean;
  url?: string;
  error?: string;
};

// ── Create Checkout ─────────────────────────────────────

export async function createCheckoutAction(
  priceId: string,
): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer({
      companyId: ctx.company.id,
      companyName: ctx.company.name,
      email: ctx.user.email,
    });

    const baseUrl = process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      companyId: ctx.company.id,
      priceId,
      stripeCustomerId,
      successUrl: `${baseUrl}/account/subscription?success=true`,
      cancelUrl: `${baseUrl}/account/subscription?canceled=true`,
    });

    if (session.url) {
      return { success: true, url: session.url };
    }

    return { success: false, error: "Checkout konnte nicht erstellt werden." };
  } catch {
    return { success: false, error: "Fehler beim Erstellen des Checkouts." };
  }
}

// ── Create Customer Portal Session ──────────────────────

export async function createPortalAction(): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  if (!ctx.company.stripeCustomerId) {
    return { success: false, error: "Kein Stripe-Konto vorhanden." };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3000";

    const session = await createCustomerPortalSession({
      stripeCustomerId: ctx.company.stripeCustomerId,
      returnUrl: `${baseUrl}/account/subscription`,
    });

    return { success: true, url: session.url };
  } catch {
    return { success: false, error: "Portal konnte nicht geöffnet werden." };
  }
}

// ── Cancel Subscription ─────────────────────────────────

export async function cancelSubscriptionAction(): Promise<ActionResult> {
  const ctx = await requireUserWithCompany();

  try {
    const subscription = await getActiveSubscription(ctx.company.id);
    if (!subscription) {
      return { success: false, error: "Kein aktives Abonnement." };
    }

    const stripe = getStripe();
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Kündigung fehlgeschlagen." };
  }
}
