import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { companies } from "./companies";
import { customers } from "./customers";
import { users } from "./users";

// ── Enums ────────────────────────────────────────────────

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "planned",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
  "invoiced",
]);

export const projectPriorityEnum = pgEnum("project_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);

// ── Projects ─────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    projectNumber: text("project_number"),
    customerId: uuid("customer_id").references(() => customers.id),
    assignedTo: uuid("assigned_to").references(() => users.id),
    title: text("title").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("draft"),
    priority: projectPriorityEnum("priority").notNull().default("normal"),
    estimatedHours: integer("estimated_hours"),
    actualHours: integer("actual_hours"),
    estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }),
    actualCost: numeric("actual_cost", { precision: 12, scale: 2 }),
    encryptedNotes: text("encrypted_notes"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
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
    index("projects_company_status_idx").on(
      table.companyId,
      table.status,
      table.deletedAt,
    ),
    index("projects_company_number_idx").on(
      table.companyId,
      table.projectNumber,
    ),
    index("projects_company_assigned_idx").on(
      table.companyId,
      table.assignedTo,
    ),
    index("projects_company_customer_idx").on(
      table.companyId,
      table.customerId,
    ),
  ],
);

// ── Relations ────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ one }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
  customer: one(customers, {
    fields: [projects.customerId],
    references: [customers.id],
  }),
  assignee: one(users, {
    fields: [projects.assignedTo],
    references: [users.id],
    relationName: "projectAssignee",
  }),
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
    relationName: "projectCreator",
  }),
  updater: one(users, {
    fields: [projects.updatedBy],
    references: [users.id],
    relationName: "projectUpdater",
  }),
}));
