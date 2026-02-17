import type { CraftTypeValue } from "./craft-types";

// ── Module Types ─────────────────────────────────────────

export type Platform = "web" | "mobile" | "desktop" | "all";

export type ModuleCategory =
  | "core"
  | "pruefung"
  | "verwaltung"
  | "branchenspezifisch";

// ── Module ───────────────────────────────────────────────

export interface Module {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: ModuleCategory;
  icon: string | null;
  isCore: boolean;
  sortOrder: number;
}

// ── Craft Type Module ────────────────────────────────────

export interface CraftTypeModule {
  id: string;
  craftType: CraftTypeValue;
  moduleId: string;
  platform: Platform;
  enabledByDefault: boolean;
}

// ── Company Module ───────────────────────────────────────

export interface CompanyModule {
  id: string;
  companyId: string;
  moduleId: string;
  isActive: boolean;
  activatedAt: Date;
  deactivatedAt: Date | null;
  activatedBy: string | null;
}

// ── Enriched type for frontend usage ─────────────────────

export interface ModuleWithStatus extends Module {
  isAvailable: boolean;
  isActive: boolean;
  platforms: Platform[];
}
