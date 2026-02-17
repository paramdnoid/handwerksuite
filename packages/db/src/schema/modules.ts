import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { craftTypeEnum, companies } from "./companies";
import { users } from "./users";

// ── Enums ────────────────────────────────────────────────

export const platformEnum = pgEnum("platform", [
  "web",
  "mobile",
  "desktop",
  "all",
]);

// ── Modules ──────────────────────────────────────────────

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  icon: text("icon"),
  isCore: boolean("is_core").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Craft Type Modules ───────────────────────────────────

export const craftTypeModules = pgTable(
  "craft_type_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    craftType: craftTypeEnum("craft_type").notNull(),
    moduleId: uuid("module_id")
      .references(() => modules.id, { onDelete: "cascade" })
      .notNull(),
    platform: platformEnum("platform").notNull().default("all"),
    enabledByDefault: boolean("enabled_by_default").default(true).notNull(),
  },
  (table) => [
    unique("craft_type_modules_unique").on(
      table.craftType,
      table.moduleId,
      table.platform,
    ),
    index("craft_type_modules_craft_idx").on(table.craftType),
  ],
);

// ── Company Modules ──────────────────────────────────────

export const companyModules = pgTable(
  "company_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    moduleId: uuid("module_id")
      .references(() => modules.id, { onDelete: "cascade" })
      .notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    activatedAt: timestamp("activated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
    activatedBy: uuid("activated_by").references(() => users.id),
  },
  (table) => [
    unique("company_modules_unique").on(table.companyId, table.moduleId),
    index("company_modules_company_idx").on(table.companyId),
    index("company_modules_active_idx").on(table.companyId, table.isActive),
  ],
);

// ── Relations ────────────────────────────────────────────

export const modulesRelations = relations(modules, ({ many }) => ({
  craftTypeModules: many(craftTypeModules),
  companyModules: many(companyModules),
}));

export const craftTypeModulesRelations = relations(
  craftTypeModules,
  ({ one }) => ({
    module: one(modules, {
      fields: [craftTypeModules.moduleId],
      references: [modules.id],
    }),
  }),
);

export const companyModulesRelations = relations(
  companyModules,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyModules.companyId],
      references: [companies.id],
    }),
    module: one(modules, {
      fields: [companyModules.moduleId],
      references: [modules.id],
    }),
    activator: one(users, {
      fields: [companyModules.activatedBy],
      references: [users.id],
    }),
  }),
);
