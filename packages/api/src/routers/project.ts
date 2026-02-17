import { z } from "zod";
import { createTRPCRouter, withPermission } from "../trpc";

export const projectRouter = createTRPCRouter({
  list: withPermission("projects:read").input(
    z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      status: z
        .enum([
          "draft",
          "planned",
          "in_progress",
          "on_hold",
          "completed",
          "cancelled",
          "invoiced",
        ])
        .optional(),
      priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
      search: z.string().optional(),
    }),
  ).query(async ({ ctx, input }) => {
    // TODO: query projects from DB with company isolation
    return {
      projects: [],
      totalCount: 0,
      page: input.page,
      pageSize: input.pageSize,
    };
  }),

  getById: withPermission("projects:read").input(
    z.object({ id: z.string().uuid() }),
  ).query(async ({ ctx, input }) => {
    // TODO: fetch single project with company isolation
    return null;
  }),

  create: withPermission("projects:create").input(
    z.object({
      title: z.string().min(1).max(500),
      description: z.string().optional(),
      customerId: z.string().uuid().optional(),
      assignedTo: z.string().uuid().optional(),
      priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
      estimatedHours: z.number().positive().optional(),
      estimatedCost: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: create project with company isolation
    return { success: true, id: "" };
  }),

  update: withPermission("projects:update").input(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(500).optional(),
      description: z.string().optional(),
      status: z
        .enum([
          "draft",
          "planned",
          "in_progress",
          "on_hold",
          "completed",
          "cancelled",
          "invoiced",
        ])
        .optional(),
      priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
      assignedTo: z.string().uuid().optional(),
      estimatedHours: z.number().positive().optional(),
      actualHours: z.number().positive().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: update project with company isolation
    return { success: true };
  }),

  delete: withPermission("projects:delete").input(
    z.object({ id: z.string().uuid() }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: soft-delete project with audit log
    return { success: true };
  }),
});
