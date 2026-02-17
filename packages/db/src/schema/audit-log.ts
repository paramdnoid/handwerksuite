import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";

// ── Audit Log ────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id").references(() => users.id),
    sessionId: uuid("session_id"),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    resourceId: text("resource_id"),
    oldValues: jsonb("old_values").$type<Record<string, unknown>>(),
    newValues: jsonb("new_values").$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_log_company_idx").on(table.companyId),
    index("audit_log_user_idx").on(table.userId),
    index("audit_log_timestamp_idx").on(table.timestamp),
    index("audit_log_resource_idx").on(table.resource, table.resourceId),
    index("audit_log_company_resource_ts_idx").on(
      table.companyId,
      table.resource,
      table.timestamp,
    ),
  ],
);
