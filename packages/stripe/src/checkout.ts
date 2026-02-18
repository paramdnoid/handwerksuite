import { getStripe } from "./client";

// ── Checkout Session ────────────────────────────────────

export async function createCheckoutSession(opts: {
  companyId: string;
  priceId: string;
  stripeCustomerId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer: opts.stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      companyId: opts.companyId,
    },
    subscription_data: {
      metadata: {
        companyId: opts.companyId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    tax_id_collection: { enabled: true },
  });

  return session;
}

// ── Customer Portal Session ─────────────────────────────

export async function createCustomerPortalSession(opts: {
  stripeCustomerId: string;
  returnUrl: string;
}) {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: opts.stripeCustomerId,
    return_url: opts.returnUrl,
  });

  return session;
}
