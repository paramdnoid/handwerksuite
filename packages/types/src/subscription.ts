import type { SubscriptionTier } from "./company";

// ── Subscription Plan ────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: "EUR";
  features: SubscriptionFeature[];
  limits: SubscriptionLimits;
}

// ── Subscription Feature ─────────────────────────────────

export interface SubscriptionFeature {
  key: string;
  label: string;
  included: boolean;
}

// ── Subscription Limits ──────────────────────────────────

export interface SubscriptionLimits {
  maxUsers: number;
  maxProjects: number;
  maxStorageMb: number;
  maxCustomers: number;
  offlineSync: boolean;
  desktopApp: boolean;
  mobileApp: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

// ── Subscription ─────────────────────────────────────────

export interface Subscription {
  id: string;
  companyId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Subscription Status ──────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

// ── Billing Invoice ──────────────────────────────────────

export interface BillingInvoice {
  id: string;
  companyId: string;
  stripeInvoiceId: string;
  subscriptionId: string | null;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  paidAt: Date | null;
  createdAt: Date;
}

// ── Invoice Status ───────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "uncollectible";
