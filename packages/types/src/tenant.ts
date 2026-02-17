import type { CraftTypeValue } from "./craft-types";

export type TenantType = "craft_business" | "authority";

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  craftType: CraftTypeValue | null;
  hwkNumber: string | null;
  subscriptionTier: SubscriptionTier | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = "starter" | "professional" | "enterprise";

export interface AuthorityAssignment {
  id: string;
  authorityTenantId: string;
  craftTenantId: string;
  accessLevel: AuthorityAccessLevel;
  grantedAt: Date;
  grantedBy: string;
  revokedAt: Date | null;
}

export type AuthorityAccessLevel =
  | "read_basic"
  | "read_contact"
  | "read_full"
  | "read_documents";

export interface TenantMember {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  joinedAt: Date;
}

export type TenantRole =
  | "owner"
  | "admin"
  | "manager"
  | "employee"
  | "readonly";
