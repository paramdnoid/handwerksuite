# @zunftgewerk/api

Type-safe API layer built with [tRPC](https://trpc.io/) v11.

## Architecture

```
src/
├── index.ts          # Barrel exports (AppRouter, appRouter, createTRPCContext)
├── root.ts           # Root router combining all sub-routers
├── trpc.ts           # tRPC init, context, middleware, procedures
└── routers/
    ├── company.ts    # Company management & settings
    ├── customer.ts   # Customer CRUD
    ├── modules.ts    # Module activation/deactivation
    └── project.ts    # Project management
```

## Middleware Chain

Requests pass through layered middleware depending on the procedure type:

```
publicProcedure          → No auth required
protectedProcedure       → enforceAuth (user + session required)
companyProcedure         → enforceAuth → enforceCompany (companyId + role required)
withPermission(perm)     → enforceAuth → enforceCompany → permission check
```

## Procedures

| Procedure              | Description                                   |
| ---------------------- | --------------------------------------------- |
| `publicProcedure`      | No authentication required                    |
| `protectedProcedure`   | Requires authenticated user session           |
| `companyProcedure`     | Requires auth + active company context        |
| `withPermission(perm)` | Requires auth + company + specific permission |

## Routers

### `company`

| Endpoint         | Type     | Permission           | Description                                            |
| ---------------- | -------- | -------------------- | ------------------------------------------------------ |
| `getCurrent`     | query    | `companyProcedure`   | Get current company info                               |
| `update`         | mutation | `company:update`     | Update company details (name, legalName, taxId, vatId) |
| `getSettings`    | query    | `settings:read`      | Get company settings                                   |
| `updateSettings` | mutation | `settings:update`    | Update settings (locale, timezone, currency, etc.)     |
| `listMembers`    | query    | `members:read`       | List company members                                   |
| `inviteMember`   | mutation | `invitations:create` | Invite member by email with role                       |
| `removeMember`   | mutation | `members:remove`     | Remove member by userId                                |

### `customer`

| Endpoint  | Type     | Permission         | Description                                      |
| --------- | -------- | ------------------ | ------------------------------------------------ |
| `list`    | query    | `customers:read`   | Paginated list with type/search filters          |
| `getById` | query    | `customers:read`   | Get single customer by ID                        |
| `create`  | mutation | `customers:create` | Create customer (private/business/public_sector) |
| `update`  | mutation | `customers:update` | Update customer fields                           |
| `delete`  | mutation | `customers:delete` | Soft-delete customer                             |

### `module`

| Endpoint       | Type     | Permission         | Description                                             |
| -------------- | -------- | ------------------ | ------------------------------------------------------- |
| `getAvailable` | query    | `companyProcedure` | Get available modules for platform (web/mobile/desktop) |
| `getActive`    | query    | `companyProcedure` | Get active modules for company                          |
| `activate`     | mutation | `modules:manage`   | Activate a module                                       |
| `deactivate`   | mutation | `modules:manage`   | Deactivate a module                                     |

### `project`

| Endpoint  | Type     | Permission        | Description                                        |
| --------- | -------- | ----------------- | -------------------------------------------------- |
| `list`    | query    | `projects:read`   | Paginated list with status/priority/search filters |
| `getById` | query    | `projects:read`   | Get single project by ID                           |
| `create`  | mutation | `projects:create` | Create project with details                        |
| `update`  | mutation | `projects:update` | Update project fields and status                   |
| `delete`  | mutation | `projects:delete` | Soft-delete project                                |

## Roles

Available roles: `admin`, `manager`, `employee`, `readonly`

## Adding a New Router

1. Create `src/routers/my-router.ts`:

   ```typescript
   import { z } from 'zod';
   import { createTRPCRouter, withPermission } from '../trpc';

   export const myRouter = createTRPCRouter({
     list: withPermission('my-resource:read').query(async ({ ctx }) => {
       // implementation
     }),
   });
   ```

2. Register in `src/root.ts`:

   ```typescript
   import { myRouter } from './routers/my-router';

   export const appRouter = createTRPCRouter({
     // ...existing routers
     myResource: myRouter,
   });
   ```

3. The router is automatically available on the client via `trpc.myResource.list.useQuery()`.
