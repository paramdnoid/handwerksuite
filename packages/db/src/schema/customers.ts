import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";

export const customerTypeEnum = pgEnum("customer_type", [
  "private",
  "business",
  "public_sector",
]);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  type: customerTypeEnum("type").notNull().default("private"),
  companyName: text("company_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  encryptedEmail: text("encrypted_email"),
  encryptedPhone: text("encrypted_phone"),
  encryptedAddress: text("encrypted_address"),
  taxId: text("tax_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const customersRelations = relations(customers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [customers.tenantId],
    references: [tenants.id],
  }),
}));
