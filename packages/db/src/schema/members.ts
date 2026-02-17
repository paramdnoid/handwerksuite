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

export const companyRoleEnum = pgEnum("company_role", [
  "owner",
  "admin",
  "manager",
  "employee",
  "readonly",
]);

// ── Company Members ──────────────────────────────────────

export const companyMembers = pgTable(
  "company_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: companyRoleEnum("role").notNull().default("employee"),
    invitedBy: uuid("invited_by").references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [
    unique("company_members_unique").on(table.companyId, table.userId),
    index("company_members_user_idx").on(table.userId),
    index("company_members_company_idx").on(table.companyId),
  ],
);

// ── Invitations ──────────────────────────────────────────

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    email: text("email").notNull(),
    role: companyRoleEnum("role").notNull().default("employee"),
    invitedBy: uuid("invited_by")
      .references(() => users.id)
      .notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("invitations_email_idx").on(table.email),
    index("invitations_token_idx").on(table.token),
    index("invitations_company_idx").on(table.companyId),
  ],
);

// ── Relations ────────────────────────────────────────────

export const companyMembersRelations = relations(
  companyMembers,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyMembers.companyId],
      references: [companies.id],
    }),
    user: one(users, {
      fields: [companyMembers.userId],
      references: [users.id],
    }),
    inviter: one(users, {
      fields: [companyMembers.invitedBy],
      references: [users.id],
      relationName: "inviter",
    }),
  }),
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  company: one(companies, {
    fields: [invitations.companyId],
    references: [companies.id],
  }),
  inviter: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));
