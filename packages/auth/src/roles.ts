export type Role = "owner" | "admin" | "manager" | "employee" | "readonly" | "authority";

export type Permission =
  | "tenant:read"
  | "tenant:update"
  | "tenant:delete"
  | "members:read"
  | "members:invite"
  | "members:remove"
  | "members:update-role"
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "customers:read"
  | "customers:create"
  | "customers:update"
  | "customers:delete"
  | "invoices:read"
  | "invoices:create"
  | "invoices:update"
  | "invoices:send"
  | "subscription:read"
  | "subscription:manage"
  | "audit-log:read"
  | "authority:view-businesses";

export const ROLES: Record<Role, Permission[]> = {
  owner: [
    "tenant:read", "tenant:update", "tenant:delete",
    "members:read", "members:invite", "members:remove", "members:update-role",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "customers:read", "customers:create", "customers:update", "customers:delete",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
    "subscription:read", "subscription:manage",
    "audit-log:read",
  ],
  admin: [
    "tenant:read", "tenant:update",
    "members:read", "members:invite", "members:remove", "members:update-role",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "customers:read", "customers:create", "customers:update", "customers:delete",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
    "subscription:read",
    "audit-log:read",
  ],
  manager: [
    "tenant:read",
    "members:read",
    "projects:read", "projects:create", "projects:update",
    "customers:read", "customers:create", "customers:update",
    "invoices:read", "invoices:create", "invoices:update", "invoices:send",
  ],
  employee: [
    "tenant:read",
    "projects:read", "projects:update",
    "customers:read",
    "invoices:read",
  ],
  readonly: [
    "tenant:read",
    "projects:read",
    "customers:read",
    "invoices:read",
  ],
  authority: [
    "authority:view-businesses",
    "tenant:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLES[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return ROLES[role] ?? [];
}
