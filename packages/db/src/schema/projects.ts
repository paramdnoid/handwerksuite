import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { customers } from "./customers";

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "planned",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
  "invoiced",
]);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("draft"),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: numeric("actual_cost", { precision: 12, scale: 2 }),
  encryptedNotes: text("encrypted_notes"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  tenant: one(tenants, {
    fields: [projects.tenantId],
    references: [tenants.id],
  }),
  customer: one(customers, {
    fields: [projects.customerId],
    references: [customers.id],
  }),
}));
