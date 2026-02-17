import type { CraftTypeValue } from "./craft-types";

// ── Company Types ────────────────────────────────────────

export type CompanyType = "craft_business" | "authority";

export type CompanyRole =
  | "owner"
  | "admin"
  | "manager"
  | "employee"
  | "readonly";

export type SubscriptionTier =
  | "free"
  | "starter"
  | "professional"
  | "enterprise";

export type AuthorityAccessLevel =
  | "read_basic"
  | "read_contact"
  | "read_full"
  | "read_documents";

// ── Company ──────────────────────────────────────────────

export interface Company {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  companyType: CompanyType;
  craftType: CraftTypeValue | null;
  hwkNumber: string | null;
  taxId: string | null;
  vatId: string | null;
  logoUrl: string | null;
  subscriptionTier: SubscriptionTier;
  lagoCustomerId: string | null;
  isActive: boolean;
  onboardingCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// ── Company Settings ─────────────────────────────────────

export interface CompanySettings {
  id: string;
  companyId: string;
  locale: string;
  timezone: string;
  currency: string;
  defaultTaxRate: number;
  invoicePrefix: string | null;
  invoiceNextNumber: number;
  fiscalYearStartMonth: number;
  customSettings: Record<string, unknown> | null;
}

// ── Company Member ───────────────────────────────────────

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: CompanyRole;
  invitedBy: string | null;
  joinedAt: Date;
  leftAt: Date | null;
}

// ── Invitation ───────────────────────────────────────────

export interface Invitation {
  id: string;
  companyId: string;
  email: string;
  role: CompanyRole;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

// ── Authority Assignment ─────────────────────────────────

export interface AuthorityAssignment {
  id: string;
  authorityCompanyId: string;
  craftCompanyId: string;
  accessLevel: AuthorityAccessLevel;
  grantedAt: Date;
  grantedBy: string;
  revokedAt: Date | null;
}
