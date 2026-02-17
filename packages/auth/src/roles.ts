export type Role =
  | "owner"
  | "admin"
  | "manager"
  | "employee"
  | "readonly"
  | "authority";

export type Permission =
  // Company
  | "company:read"
  | "company:update"
  | "company:delete"
  // Members
  | "members:read"
  | "members:invite"
  | "members:remove"
  | "members:update-role"
  // Invitations
  | "invitations:create"
  | "invitations:revoke"
  | "invitations:list"
  // Modules
  | "modules:read"
  | "modules:manage"
  // Settings
  | "settings:read"
  | "settings:update"
  // Projects
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  // Customers
  | "customers:read"
  | "customers:create"
  | "customers:update"
  | "customers:delete"
  // Invoices
  | "invoices:read"
  | "invoices:create"
  | "invoices:update"
  | "invoices:send"
  // Subscription
  | "subscription:read"
  | "subscription:manage"
  // Audit
  | "audit-log:read"
  // Authority
  | "authority:view-businesses";

export const ROLES: Record<Role, Permission[]> = {
  owner: [
    "company:read", "company:update", "company:delete",
    "members:read", "members:invite", "members:remove", "members:update-role",
    "invitations:create", "invitations:revoke", "invitations:list",
    "modules:read", "modules:manage",
    "settings:read", "settings:update",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "customers:read", "customers:create", "customers:update", "customers:delete",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
    "subscription:read", "subscription:manage",
    "audit-log:read",
  ],
  admin: [
    "company:read", "company:update",
    "members:read", "members:invite", "members:remove", "members:update-role",
    "invitations:create", "invitations:revoke", "invitations:list",
    "modules:read", "modules:manage",
    "settings:read", "settings:update",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "customers:read", "customers:create", "customers:update", "customers:delete",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
    "subscription:read",
    "audit-log:read",
  ],
  manager: [
    "company:read",
    "members:read",
    "invitations:list",
    "modules:read",
    "settings:read",
    "projects:read", "projects:create", "projects:update",
    "customers:read", "customers:create", "customers:update",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
  ],
  employee: [
    "company:read",
    "modules:read",
    "settings:read",
    "projects:read", "projects:update",
    "customers:read",
    "invoices:read",
  ],
  readonly: [
    "company:read",
    "modules:read",
    "settings:read",
    "projects:read",
    "customers:read",
    "invoices:read",
  ],
  authority: [
    "authority:view-businesses",
    "company:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLES[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return ROLES[role] ?? [];
}
