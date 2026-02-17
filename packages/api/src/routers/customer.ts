import { z } from "zod";
import { createTRPCRouter, withPermission } from "../trpc";

export const customerRouter = createTRPCRouter({
  list: withPermission("customers:read").input(
    z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      type: z.enum(["private", "business", "public_sector"]).optional(),
      search: z.string().optional(),
    }),
  ).query(async ({ ctx, input }) => {
    // TODO: query customers with company isolation + field decryption
    return {
      customers: [],
      totalCount: 0,
      page: input.page,
      pageSize: input.pageSize,
    };
  }),

  getById: withPermission("customers:read").input(
    z.object({ id: z.string().uuid() }),
  ).query(async ({ ctx, input }) => {
    // TODO: fetch customer with decrypted fields
    return null;
  }),

  create: withPermission("customers:create").input(
    z.object({
      type: z.enum(["private", "business", "public_sector"]),
      companyName: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      taxId: z.string().optional(),
      notes: z.string().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: create customer with field-level encryption for PII
    return { success: true, id: "" };
  }),

  update: withPermission("customers:update").input(
    z.object({
      id: z.string().uuid(),
      companyName: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      notes: z.string().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: update customer with re-encryption of changed fields
    return { success: true };
  }),

  delete: withPermission("customers:delete").input(
    z.object({ id: z.string().uuid() }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: soft-delete customer with audit log
    return { success: true };
  }),
});
