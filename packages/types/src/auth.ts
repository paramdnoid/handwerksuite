import type { CompanyRole, CompanyType } from "./company";
import type { CraftTypeValue } from "./craft-types";

// ── User ─────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Session ──────────────────────────────────────────────

export interface Session {
  id: string;
  userId: string;
  companyId: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

// ── User Profile ─────────────────────────────────────────

export interface UserProfile extends User {
  activeCompanyId: string | null;
  companyRole: CompanyRole | null;
  craftType: CraftTypeValue | null;
  companyType: CompanyType | null;
}

// ── Auth State ───────────────────────────────────────────

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ── Auth Provider ────────────────────────────────────────

export type AuthProvider = "email" | "google" | "microsoft";
