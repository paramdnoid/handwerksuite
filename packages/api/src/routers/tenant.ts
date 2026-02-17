import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  tenantProcedure,
  withPermission,
} from "../trpc";

export const tenantRouter = createTRPCRouter({
  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    // TODO: fetch tenant from DB
    return { tenantId: ctx.tenantId };
  }),

  update: withPermission("tenant:update").input(
    z.object({
      name: z.string().min(1).max(255).optional(),
      taxId: z.string().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: update tenant in DB
    return { success: true, tenantId: ctx.tenantId };
  }),

  listMembers: withPermission("members:read").query(async ({ ctx }) => {
    // TODO: list tenant members from DB
    return { members: [] };
  }),

  inviteMember: withPermission("members:invite").input(
    z.object({
      email: z.string().email(),
      role: z.enum(["admin", "manager", "employee", "readonly"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: send invitation
    return { success: true };
  }),
});
