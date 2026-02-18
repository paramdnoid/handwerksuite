import type {
  SubscriptionTier,
  SubscriptionPlan,
  SubscriptionLimits,
} from "@zunftgewerk/types";

// ── Subscription Plans ──────────────────────────────────
// Static configuration for all available plans.
// Stripe Price IDs are configured per environment.

export const SUBSCRIPTION_PLANS: Record<
  Exclude<SubscriptionTier, "free">,
  SubscriptionPlan
> = {
  starter: {
    id: "plan_starter",
    tier: "starter",
    name: "Starter",
    description: "Perfekt für Einzelunternehmer und Kleinbetriebe.",
    priceMonthly: 49,
    priceYearly: 468,
    currency: "EUR",
    features: [
      { key: "customers", label: "Bis zu 50 Kunden", included: true },
      { key: "projects", label: "100 Projekte / Jahr", included: true },
      { key: "users", label: "1 Benutzer", included: true },
      { key: "mobile", label: "Mobile App", included: true },
      { key: "support", label: "E-Mail-Support", included: true },
      { key: "api", label: "API-Zugang", included: false },
    ],
    limits: {
      maxUsers: 1,
      maxProjects: 100,
      maxStorageMb: 2048,
      maxCustomers: 50,
      offlineSync: false,
      desktopApp: false,
      mobileApp: true,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  professional: {
    id: "plan_professional",
    tier: "professional",
    name: "Professional",
    description: "Für wachsende Betriebe mit mehreren Mitarbeitern.",
    priceMonthly: 99,
    priceYearly: 948,
    currency: "EUR",
    features: [
      { key: "customers", label: "Unbegrenzte Kunden", included: true },
      { key: "projects", label: "Unbegrenzte Projekte", included: true },
      { key: "users", label: "Bis zu 5 Benutzer", included: true },
      { key: "apps", label: "Mobile + Desktop App", included: true },
      { key: "support", label: "Prioritäts-Support", included: true },
      { key: "api", label: "API-Zugang", included: true },
    ],
    limits: {
      maxUsers: 5,
      maxProjects: -1,
      maxStorageMb: 10240,
      maxCustomers: -1,
      offlineSync: true,
      desktopApp: true,
      mobileApp: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
  enterprise: {
    id: "plan_enterprise",
    tier: "enterprise",
    name: "Enterprise",
    description: "Für große Unternehmen mit individuellen Anforderungen.",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "EUR",
    features: [
      { key: "everything", label: "Alles aus Professional", included: true },
      { key: "users", label: "Unbegrenzte Benutzer", included: true },
      {
        key: "manager",
        label: "Dedizierter Account-Manager",
        included: true,
      },
      { key: "integrations", label: "Custom Integrationen", included: true },
      { key: "onprem", label: "On-Premise Option", included: true },
      { key: "sla", label: "SLA-Garantie (99,9%)", included: true },
    ],
    limits: {
      maxUsers: -1,
      maxProjects: -1,
      maxStorageMb: -1,
      maxCustomers: -1,
      offlineSync: true,
      desktopApp: true,
      mobileApp: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
};

// ── Free Tier Limits ────────────────────────────────────

const FREE_LIMITS: SubscriptionLimits = {
  maxUsers: 1,
  maxProjects: 5,
  maxStorageMb: 512,
  maxCustomers: 10,
  offlineSync: false,
  desktopApp: false,
  mobileApp: false,
  apiAccess: false,
  prioritySupport: false,
};

// ── Helpers ─────────────────────────────────────────────

export function getSubscriptionLimits(tier: SubscriptionTier): SubscriptionLimits {
  if (tier === "free") return FREE_LIMITS;
  return SUBSCRIPTION_PLANS[tier].limits;
}

export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

// ── Stripe Price ID Mapping ─────────────────────────────
// Configure these in your Stripe Dashboard and set as env vars.

export function getStripePriceId(
  tier: Exclude<SubscriptionTier, "free" | "enterprise">,
  interval: "monthly" | "yearly",
): string {
  const key = `STRIPE_PRICE_${tier.toUpperCase()}_${interval.toUpperCase()}`;
  const priceId = process.env[key];
  if (!priceId) {
    throw new Error(
      `Missing Stripe Price ID: ${key}. Configure it in your environment variables.`,
    );
  }
  return priceId;
}
