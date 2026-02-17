import { createTRPCRouter } from "./trpc";
import { companyRouter } from "./routers/company";
import { moduleRouter } from "./routers/modules";
import { projectRouter } from "./routers/project";
import { customerRouter } from "./routers/customer";

export const appRouter = createTRPCRouter({
  company: companyRouter,
  module: moduleRouter,
  project: projectRouter,
  customer: customerRouter,
});

export type AppRouter = typeof appRouter;
