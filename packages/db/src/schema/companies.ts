import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
  numeric,
  integer,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ────────────────────────────────────────────────

export const companyTypeEnum = pgEnum("company_type", [
  "craft_business",
  "authority",
]);

export const craftTypeEnum = pgEnum("craft_type", [
  "shk",
  "elektro",
  "tischler",
  "maler",
  "dachdecker",
  "zimmerer",
  "metallbau",
  "kfz",
  "maurer",
  "strassenbauer",
  "schornsteinfeger",
  "fleischer",
  "baecker",
  "augenoptiker",
  "hoergeraeteakustiker",
  "zahntechniker",
  "friseur",
  "glaser",
  "steinmetz",
  "ofen_luftheizungsbauer",
  "klempner",
  "kaelteanlagenbauer",
  "informationstechniker",
  "elektromaschinenbauer",
  "beton_stahlbetonbauer",
  "fliesen_platten_mosaikleger",
  "parkettleger",
  "raumausstatter",
  "gebaeudereiniger",
  "schilder_lichtreklamehersteller",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "starter",
  "professional",
  "enterprise",
]);

export const authorityAccessLevelEnum = pgEnum("authority_access_level", [
  "read_basic",
  "read_contact",
  "read_full",
  "read_documents",
]);

// ── Companies ────────────────────────────────────────────

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    legalName: text("legal_name"),
    companyType: companyTypeEnum("company_type").notNull(),
    craftType: craftTypeEnum("craft_type"),
    hwkNumber: text("hwk_number"),
    taxId: text("tax_id"),
    vatId: text("vat_id"),
    encryptedContactData: text("encrypted_contact_data"),
    encryptedAddress: text("encrypted_address"),
    logoUrl: text("logo_url"),
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .default("free")
      .notNull(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    isActive: boolean("is_active").default(true).notNull(),
    onboardingCompletedAt: timestamp("onboarding_completed_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("companies_company_type_idx").on(table.companyType),
    index("companies_craft_type_idx").on(table.craftType),
    index("companies_subscription_tier_idx").on(table.subscriptionTier),
    index("companies_active_idx").on(table.deletedAt),
  ],
);

// ── Company Settings ─────────────────────────────────────

export const companySettings = pgTable("company_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  locale: text("locale").default("de-DE").notNull(),
  timezone: text("timezone").default("Europe/Berlin").notNull(),
  currency: text("currency").default("EUR").notNull(),
  defaultTaxRate: numeric("default_tax_rate", { precision: 5, scale: 2 })
    .default("19.00")
    .notNull(),
  invoicePrefix: text("invoice_prefix"),
  invoiceNextNumber: integer("invoice_next_number").default(1).notNull(),
  fiscalYearStartMonth: integer("fiscal_year_start_month").default(1).notNull(),
  customSettings: jsonb("custom_settings").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Authority Assignments ────────────────────────────────

export const authorityAssignments = pgTable(
  "authority_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorityCompanyId: uuid("authority_company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    craftCompanyId: uuid("craft_company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    accessLevel: authorityAccessLevelEnum("access_level").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    grantedBy: uuid("granted_by"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("authority_assignments_authority_idx").on(
      table.authorityCompanyId,
      table.revokedAt,
    ),
    index("authority_assignments_craft_idx").on(
      table.craftCompanyId,
      table.revokedAt,
    ),
  ],
);

// ── Relations ────────────────────────────────────────────

export const companiesRelations = relations(companies, ({ one, many }) => ({
  settings: one(companySettings, {
    fields: [companies.id],
    references: [companySettings.companyId],
  }),
  authorityAssignmentsAsAuthority: many(authorityAssignments, {
    relationName: "authority",
  }),
  authorityAssignmentsAsCraft: many(authorityAssignments, {
    relationName: "craft",
  }),
}));

export const companySettingsRelations = relations(
  companySettings,
  ({ one }) => ({
    company: one(companies, {
      fields: [companySettings.companyId],
      references: [companies.id],
    }),
  }),
);

export const authorityAssignmentsRelations = relations(
  authorityAssignments,
  ({ one }) => ({
    authorityCompany: one(companies, {
      fields: [authorityAssignments.authorityCompanyId],
      references: [companies.id],
      relationName: "authority",
    }),
    craftCompany: one(companies, {
      fields: [authorityAssignments.craftCompanyId],
      references: [companies.id],
      relationName: "craft",
    }),
  }),
);
