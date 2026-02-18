import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import type { Session, User } from 'better-auth';
import { hasPermission, type Permission, type Role } from '@zunftgewerk/auth/roles';

// ── Context ──────────────────────────────────────────────

export interface TRPCContext {
  user: User | null;
  session: Session | null;
  companyId: string | null;
  companyRole: Role | null;
  craftType: string | null;
  headers: Headers;
}

export async function createTRPCContext(opts: {
  headers: Headers;
  user?: User | null;
  session?: Session | null;
  companyId?: string | null;
  companyRole?: Role | null;
  craftType?: string | null;
}): Promise<TRPCContext> {
  return {
    user: opts.user ?? null,
    session: opts.session ?? null,
    companyId: opts.companyId ?? null,
    companyRole: opts.companyRole ?? null,
    craftType: opts.craftType ?? null,
    headers: opts.headers,
  };
}

// ── tRPC Init ────────────────────────────────────────────

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// ── Middleware: Authenticated User ───────────────────────

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
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

// ── Middleware: Company Context ──────────────────────────

const enforceCompany = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session || !ctx.companyId || !ctx.companyRole) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Company context required',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
      companyId: ctx.companyId,
      companyRole: ctx.companyRole,
      craftType: ctx.craftType,
    },
  });
});

export const companyProcedure = t.procedure.use(enforceAuth).use(enforceCompany);

// ── Permission-checked Procedure ─────────────────────────

export function withPermission(permission: Permission) {
  return companyProcedure.use(({ ctx, next }) => {
    if (!hasPermission(ctx.companyRole, permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing permission: ${permission}`,
      });
    }
    return next({ ctx });
  });
}
