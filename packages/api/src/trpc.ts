import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import type { Session, User } from "better-auth";
import { hasPermission, type Permission, type Role } from "@handwerksuite/auth";

export interface TRPCContext {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  role: Role | null;
  headers: Headers;
}

export async function createTRPCContext(opts: {
  headers: Headers;
  user?: User | null;
  session?: Session | null;
  tenantId?: string | null;
  role?: Role | null;
}): Promise<TRPCContext> {
  return {
    user: opts.user ?? null,
    session: opts.session ?? null,
    tenantId: opts.tenantId ?? null,
    role: opts.role ?? null,
    headers: opts.headers,
  };
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware: Requires authenticated user
 */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

/**
 * Middleware: Requires tenant context (multi-tenancy)
 */
const enforceTenant = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session || !ctx.tenantId || !ctx.role) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Tenant context required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
      tenantId: ctx.tenantId,
      role: ctx.role,
    },
  });
});

export const tenantProcedure = t.procedure.use(enforceAuth).use(enforceTenant);

/**
 * Creates a permission-checked procedure
 */
export function withPermission(permission: Permission) {
  return tenantProcedure.use(({ ctx, next }) => {
    if (!hasPermission(ctx.role, permission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Missing permission: ${permission}`,
      });
    }
    return next({ ctx });
  });
}
