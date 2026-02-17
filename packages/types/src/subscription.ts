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
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  lagoCustomerId: string | null;
  lagoSubscriptionId: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

// ── Subscription Status ──────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused";

// ── Billing Invoice ──────────────────────────────────────

export interface BillingInvoice {
  id: string;
  companyId: string;
  subscriptionId: string;
  amount: number;
  currency: "EUR";
  status: "draft" | "pending" | "paid" | "voided";
  issuedAt: Date;
  dueAt: Date;
  paidAt: Date | null;
}
