import type { TenantRole, TenantType } from "./tenant";
import type { CraftTypeValue } from "./craft-types";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface UserProfile extends User {
  activeTenantId: string | null;
  role: TenantRole | null;
  craftType: CraftTypeValue | null;
  tenantType: TenantType | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type AuthProvider = "email" | "google" | "microsoft";
