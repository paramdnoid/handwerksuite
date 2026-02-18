import { eq } from "drizzle-orm";
import { db } from "@zunftgewerk/db/client";
import { companies } from "@zunftgewerk/db/schema";
import { getStripe } from "./client";

// ── Create Stripe Customer ──────────────────────────────

export async function createStripeCustomer(opts: {
  companyId: string;
  companyName: string;
  email: string;
}): Promise<string> {
  const stripe = getStripe();

  const customer = await stripe.customers.create({
    name: opts.companyName,
    email: opts.email,
    metadata: {
      companyId: opts.companyId,
    },
  });

  await db
    .update(companies)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(companies.id, opts.companyId));

  return customer.id;
}

// ── Get or Create Stripe Customer ───────────────────────

export async function getOrCreateStripeCustomer(opts: {
  companyId: string;
  companyName: string;
  email: string;
}): Promise<string> {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, opts.companyId),
    columns: { stripeCustomerId: true },
  });

  if (company?.stripeCustomerId) {
    return company.stripeCustomerId;
  }

  return createStripeCustomer(opts);
}
