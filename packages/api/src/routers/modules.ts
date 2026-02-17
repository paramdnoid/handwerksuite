import { z } from "zod";
import {
  createTRPCRouter,
  companyProcedure,
  withPermission,
} from "../trpc";

export const moduleRouter = createTRPCRouter({
  getAvailable: companyProcedure.input(
    z.object({
      platform: z.enum(["web", "mobile", "desktop"]),
    }),
  ).query(async ({ ctx, input }) => {
    // TODO: query available modules for company's craft type + platform
    // SELECT DISTINCT m.*
    // FROM modules m
    // JOIN craft_type_modules ctm ON m.id = ctm.module_id
    //   AND ctm.craft_type = :craftType
    //   AND (ctm.platform = 'all' OR ctm.platform = :platform)
    // LEFT JOIN company_modules cm ON m.id = cm.module_id AND cm.company_id = :companyId
    // WHERE m.is_core = true
    //    OR ctm.id IS NOT NULL
    // ORDER BY m.sort_order;
    return { modules: [] };
  }),

  getActive: companyProcedure.query(async ({ ctx }) => {
    // TODO: query active modules for company
    // SELECT m.*, cm.is_active, cm.activated_at
    // FROM company_modules cm
    // JOIN modules m ON m.id = cm.module_id
    // WHERE cm.company_id = :companyId AND cm.is_active = true
    // ORDER BY m.sort_order;
    return { modules: [] };
  }),

  activate: withPermission("modules:manage").input(
    z.object({
      moduleId: z.string().uuid(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: activate module for company
    // UPSERT company_modules SET is_active = true, activated_at = now(), activated_by = userId
    return { success: true };
  }),

  deactivate: withPermission("modules:manage").input(
    z.object({
      moduleId: z.string().uuid(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: deactivate module for company
    // UPDATE company_modules SET is_active = false, deactivated_at = now()
    return { success: true };
  }),
});
