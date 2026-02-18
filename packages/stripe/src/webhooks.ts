import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@zunftgewerk/db/client";
import {
  companies,
  subscriptions,
  invoices,
} from "@zunftgewerk/db/schema";
import { getStripe } from "./client";
import type { SubscriptionTier } from "@zunftgewerk/types";

// ── Construct Webhook Event ─────────────────────────────

export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  }
  return stripe.webhooks.constructEvent(body, signature, secret);
}

// ── Tier Mapping ────────────────────────────────────────

function mapPriceToTier(priceId: string): SubscriptionTier {
  const mapping: Record<string, SubscriptionTier> = {};

  const envPairs = [
    ["STRIPE_PRICE_STARTER_MONTHLY", "starter"],
    ["STRIPE_PRICE_STARTER_YEARLY", "starter"],
    ["STRIPE_PRICE_PROFESSIONAL_MONTHLY", "professional"],
    ["STRIPE_PRICE_PROFESSIONAL_YEARLY", "professional"],
    ["STRIPE_PRICE_ENTERPRISE_MONTHLY", "enterprise"],
    ["STRIPE_PRICE_ENTERPRISE_YEARLY", "enterprise"],
  ] as const;

  for (const [envKey, tier] of envPairs) {
    const id = process.env[envKey];
    if (id) mapping[id] = tier;
  }

  return mapping[priceId] ?? "professional";
}

// ── Handle Webhook Event ────────────────────────────────

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(
        event.data.object as Stripe.Subscription,
      );
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription,
      );
      break;

    case "invoice.paid":
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      break;
  }
}

// ── Handlers ────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const companyId = session.metadata?.companyId;
  if (!companyId) return;

  if (session.customer && typeof session.customer === "string") {
    await db
      .update(companies)
      .set({ stripeCustomerId: session.customer, updatedAt: new Date() })
      .where(eq(companies.id, companyId));
  }
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
): Promise<void> {
  const companyId = subscription.metadata?.companyId;
  if (!companyId) return;

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  const tier = mapPriceToTier(priceId);

  const values = {
    companyId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    tier,
    status: subscription.status as typeof subscriptions.$inferInsert.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    updatedAt: new Date(),
  };

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, subscription.id),
  });

  if (existing) {
    await db
      .update(subscriptions)
      .set(values)
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
  } else {
    await db.insert(subscriptions).values({
      ...values,
      createdAt: new Date(),
    });
  }

  await db
    .update(companies)
    .set({ subscriptionTier: tier, updatedAt: new Date() })
    .where(eq(companies.id, companyId));
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const companyId = subscription.metadata?.companyId;

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  if (companyId) {
    await db
      .update(companies)
      .set({ subscriptionTier: "free", updatedAt: new Date() })
      .where(eq(companies.id, companyId));
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const companyId = invoice.subscription_details?.metadata?.companyId;
  if (!companyId) return;

  const subscriptionRecord = invoice.subscription
    ? await db.query.subscriptions.findFirst({
        where: eq(
          subscriptions.stripeSubscriptionId,
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id,
        ),
        columns: { id: true },
      })
    : null;

  const values = {
    companyId,
    stripeInvoiceId: invoice.id,
    subscriptionId: subscriptionRecord?.id ?? null,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    status: "paid" as const,
    invoicePdfUrl: invoice.invoice_pdf ?? null,
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    periodStart: invoice.period_start
      ? new Date(invoice.period_start * 1000)
      : null,
    periodEnd: invoice.period_end
      ? new Date(invoice.period_end * 1000)
      : null,
    paidAt: new Date(),
  };

  const existing = await db.query.invoices.findFirst({
    where: eq(invoices.stripeInvoiceId, invoice.id),
  });

  if (existing) {
    await db
      .update(invoices)
      .set(values)
      .where(eq(invoices.stripeInvoiceId, invoice.id));
  } else {
    await db.insert(invoices).values({
      ...values,
      createdAt: new Date(),
    });
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  if (!invoice.id) return;

  const existing = await db.query.invoices.findFirst({
    where: eq(invoices.stripeInvoiceId, invoice.id),
  });

  if (existing) {
    await db
      .update(invoices)
      .set({ status: "open" })
      .where(eq(invoices.stripeInvoiceId, invoice.id));
  }
}
