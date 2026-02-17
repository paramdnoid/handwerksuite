import { createTRPCRouter } from "./trpc";
import { tenantRouter } from "./routers/tenant";
import { projectRouter } from "./routers/project";
import { customerRouter } from "./routers/customer";

export const appRouter = createTRPCRouter({
  tenant: tenantRouter,
  project: projectRouter,
  customer: customerRouter,
});

export type AppRouter = typeof appRouter;
