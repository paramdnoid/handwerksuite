import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tenantTypeEnum = pgEnum("tenant_type", [
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
  "starter",
  "professional",
  "enterprise",
]);

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: tenantTypeEnum("type").notNull(),
  craftType: craftTypeEnum("craft_type"),
  hwkNumber: text("hwk_number"),
  taxId: text("tax_id"),
  encryptedContactData: text("encrypted_contact_data"),
  encryptedAddress: text("encrypted_address"),
  subscriptionTier: subscriptionTierEnum("subscription_tier"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const authorityAccessLevelEnum = pgEnum("authority_access_level", [
  "read_basic",
  "read_contact",
  "read_full",
  "read_documents",
]);

export const authorityAssignments = pgTable("authority_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorityTenantId: uuid("authority_tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  craftTenantId: uuid("craft_tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  accessLevel: authorityAccessLevelEnum("access_level").notNull(),
  grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),
  grantedBy: uuid("granted_by"),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  authorityAssignmentsAsAuthority: many(authorityAssignments, {
    relationName: "authority",
  }),
  authorityAssignmentsAsCraft: many(authorityAssignments, {
    relationName: "craft",
  }),
}));

export const authorityAssignmentsRelations = relations(
  authorityAssignments,
  ({ one }) => ({
    authorityTenant: one(tenants, {
      fields: [authorityAssignments.authorityTenantId],
      references: [tenants.id],
      relationName: "authority",
    }),
    craftTenant: one(tenants, {
      fields: [authorityAssignments.craftTenantId],
      references: [tenants.id],
      relationName: "craft",
    }),
  }),
);
