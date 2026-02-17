import type { SubscriptionTier } from "./tenant";

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

export interface SubscriptionFeature {
  key: string;
  label: string;
  included: boolean;
}

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

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused";

export interface BillingInvoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: "EUR";
  status: "draft" | "pending" | "paid" | "voided";
  issuedAt: Date;
  dueAt: Date;
  paidAt: Date | null;
}
