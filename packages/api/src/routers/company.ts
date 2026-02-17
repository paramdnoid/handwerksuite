import { z } from "zod";
import {
  createTRPCRouter,
  companyProcedure,
  withPermission,
} from "../trpc";

export const companyRouter = createTRPCRouter({
  getCurrent: companyProcedure.query(async ({ ctx }) => {
    // TODO: fetch company + settings from DB
    return { companyId: ctx.companyId, craftType: ctx.craftType };
  }),

  update: withPermission("company:update").input(
    z.object({
      name: z.string().min(1).max(255).optional(),
      legalName: z.string().max(255).optional(),
      taxId: z.string().optional(),
      vatId: z.string().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: update company in DB
    return { success: true, companyId: ctx.companyId };
  }),

  getSettings: withPermission("settings:read").query(async ({ ctx }) => {
    // TODO: fetch company settings from DB
    return null;
  }),

  updateSettings: withPermission("settings:update").input(
    z.object({
      locale: z.string().optional(),
      timezone: z.string().optional(),
      currency: z.string().optional(),
      defaultTaxRate: z.string().optional(),
      invoicePrefix: z.string().max(20).optional(),
      fiscalYearStartMonth: z.number().min(1).max(12).optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: update company settings in DB
    return { success: true };
  }),

  listMembers: withPermission("members:read").query(async ({ ctx }) => {
    // TODO: list company members from DB
    return { members: [] };
  }),

  inviteMember: withPermission("invitations:create").input(
    z.object({
      email: z.string().email(),
      role: z.enum(["admin", "manager", "employee", "readonly"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: create invitation in DB and send email
    return { success: true };
  }),

  removeMember: withPermission("members:remove").input(
    z.object({
      userId: z.string().uuid(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: soft-remove member (set left_at)
    return { success: true };
  }),
});
