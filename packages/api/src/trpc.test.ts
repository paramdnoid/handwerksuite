import { describe, it, expect } from 'vitest';
import { appRouter } from './root';
import { createTRPCContext } from './trpc';

/**
 * Helper to create a caller with a specific auth context.
 */
function createTestCaller(
  overrides: {
    user?: { id: string; email: string; name: string } | null;
    session?: { id: string; userId: string } | null;
    companyId?: string | null;
    companyRole?: 'owner' | 'admin' | 'manager' | 'employee' | 'readonly' | 'authority' | null;
    craftType?: string | null;
  } = {},
) {
  return async () => {
    const ctx = await createTRPCContext({
      headers: new Headers(),
      user: overrides.user ?? null,
      session: overrides.session ?? null,
      companyId: overrides.companyId ?? null,
      companyRole: overrides.companyRole ?? null,
      craftType: overrides.craftType ?? null,
    });
    return appRouter.createCaller(ctx);
  };
}

const mockUser = { id: 'user-1', email: 'test@test.de', name: 'Test User' };
const mockSession = { id: 'session-1', userId: 'user-1' };

describe('tRPC Context', () => {
  it('should create context with defaults', async () => {
    const ctx = await createTRPCContext({ headers: new Headers() });

    expect(ctx.user).toBeNull();
    expect(ctx.session).toBeNull();
    expect(ctx.companyId).toBeNull();
    expect(ctx.companyRole).toBeNull();
    expect(ctx.craftType).toBeNull();
  });

  it('should create context with provided values', async () => {
    const ctx = await createTRPCContext({
      headers: new Headers(),
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
      craftType: 'electrician',
    });

    expect(ctx.user).toEqual(mockUser);
    expect(ctx.companyId).toBe('company-1');
    expect(ctx.companyRole).toBe('owner');
  });
});

describe('Authentication middleware', () => {
  it('should reject unauthenticated access to protected routes', async () => {
    const getCaller = createTestCaller();
    const caller = await getCaller();

    await expect(caller.company.getCurrent()).rejects.toThrow('UNAUTHORIZED');
  });

  it('should reject access without company context', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
    });
    const caller = await getCaller();

    await expect(caller.company.getCurrent()).rejects.toThrow('Company context required');
  });

  it('should allow access with full context', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
      craftType: 'electrician',
    });
    const caller = await getCaller();

    const result = await caller.company.getCurrent();
    expect(result.companyId).toBe('company-1');
    expect(result.craftType).toBe('electrician');
  });
});

describe('Permission middleware', () => {
  it('should allow owner to update company', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
    });
    const caller = await getCaller();

    const result = await caller.company.update({ name: 'New Name' });
    expect(result.success).toBe(true);
  });

  it('should deny readonly user from updating company', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'readonly',
    });
    const caller = await getCaller();

    await expect(caller.company.update({ name: 'Hack' })).rejects.toThrow(
      'Missing permission: company:update',
    );
  });

  it('should deny employee from inviting members', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'employee',
    });
    const caller = await getCaller();

    await expect(
      caller.company.inviteMember({ email: 'new@test.de', role: 'employee' }),
    ).rejects.toThrow('Missing permission: invitations:create');
  });

  it('should allow admin to invite members', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'admin',
    });
    const caller = await getCaller();

    const result = await caller.company.inviteMember({
      email: 'new@test.de',
      role: 'employee',
    });
    expect(result.success).toBe(true);
  });

  it('should deny authority role from managing modules', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'authority',
    });
    const caller = await getCaller();

    await expect(caller.module.getActive()).rejects.toThrow();
  });
});

describe('Input validation', () => {
  it('should reject invalid email for member invitation', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
    });
    const caller = await getCaller();

    await expect(
      caller.company.inviteMember({ email: 'not-an-email', role: 'employee' }),
    ).rejects.toThrow();
  });

  it('should reject invalid role for member invitation', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
    });
    const caller = await getCaller();

    await expect(
      caller.company.inviteMember({ email: 'test@test.de', role: 'superadmin' as any }),
    ).rejects.toThrow();
  });

  it('should reject invalid UUID for removeMember', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
    });
    const caller = await getCaller();

    await expect(caller.company.removeMember({ userId: 'not-a-uuid' })).rejects.toThrow();
  });

  it('should reject fiscalYearStartMonth > 12', async () => {
    const getCaller = createTestCaller({
      user: mockUser as any,
      session: mockSession as any,
      companyId: 'company-1',
      companyRole: 'owner',
    });
    const caller = await getCaller();

    await expect(caller.company.updateSettings({ fiscalYearStartMonth: 13 })).rejects.toThrow();
  });
});
