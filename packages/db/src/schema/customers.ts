import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { companies } from "./companies";
import { users } from "./users";

// ── Enums ────────────────────────────────────────────────

export const customerTypeEnum = pgEnum("customer_type", [
  "private",
  "business",
  "public_sector",
]);

// ── Customers ────────────────────────────────────────────

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    customerNumber: text("customer_number"),
    type: customerTypeEnum("type").notNull().default("private"),
    companyName: text("company_name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    encryptedEmail: text("encrypted_email"),
    encryptedPhone: text("encrypted_phone"),
    encryptedAddress: text("encrypted_address"),
    taxId: text("tax_id"),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("customers_company_idx").on(table.companyId, table.deletedAt),
    index("customers_company_type_idx").on(table.companyId, table.type),
    index("customers_company_number_idx").on(
      table.companyId,
      table.customerNumber,
    ),
  ],
);

// ── Relations ────────────────────────────────────────────

export const customersRelations = relations(customers, ({ one }) => ({
  company: one(companies, {
    fields: [customers.companyId],
    references: [companies.id],
  }),
  creator: one(users, {
    fields: [customers.createdBy],
    references: [users.id],
    relationName: "customerCreator",
  }),
  updater: one(users, {
    fields: [customers.updatedBy],
    references: [users.id],
    relationName: "customerUpdater",
  }),
}));
