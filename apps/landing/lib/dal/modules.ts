import { db } from "@zunftgewerk/db/client";
import {
  companyModules,
  craftTypeModules,
} from "@zunftgewerk/db/schema";
import { eq, and } from "drizzle-orm";
import type { ModuleWithStatus } from "@zunftgewerk/types";

// ── Get Company Modules ─────────────────────────────────

export async function getCompanyModules(
  companyId: string,
  craftType: string | null,
): Promise<ModuleWithStatus[]> {
  const allModules = await db.query.modules.findMany({
    orderBy: (m, { asc }) => [asc(m.sortOrder)],
  });

  const activeModules = await db
    .select({
      moduleId: companyModules.moduleId,
      isActive: companyModules.isActive,
    })
    .from(companyModules)
    .where(eq(companyModules.companyId, companyId));

  const activeMap = new Map(
    activeModules.map((m) => [m.moduleId, m.isActive]),
  );

  const availableModuleIds = new Set<string>();
  const platformMap = new Map<string, string[]>();

  if (craftType) {
    const craftModules = await db
      .select({
        moduleId: craftTypeModules.moduleId,
        platform: craftTypeModules.platform,
      })
      .from(craftTypeModules)
      .where(eq(craftTypeModules.craftType, craftType as any));

    for (const cm of craftModules) {
      availableModuleIds.add(cm.moduleId);
      const existing = platformMap.get(cm.moduleId) ?? [];
      if (cm.platform === "all") {
        platformMap.set(cm.moduleId, ["web", "mobile", "desktop"]);
      } else if (!existing.includes(cm.platform)) {
        existing.push(cm.platform);
        platformMap.set(cm.moduleId, existing);
      }
    }
  }

  return allModules.map((mod) => ({
    id: mod.id,
    key: mod.key,
    name: mod.name,
    description: mod.description,
    category: mod.category as ModuleWithStatus["category"],
    icon: mod.icon,
    isCore: mod.isCore,
    sortOrder: mod.sortOrder,
    isAvailable: mod.isCore || availableModuleIds.has(mod.id),
    isActive: mod.isCore || (activeMap.get(mod.id) ?? false),
    platforms: platformMap.get(mod.id) ?? (mod.isCore ? ["web", "mobile", "desktop"] : ["web"]) as any,
  }));
}

// ── Toggle Module ───────────────────────────────────────

export async function toggleModule(
  companyId: string,
  moduleId: string,
  isActive: boolean,
  userId: string,
) {
  const existing = await db.query.companyModules.findFirst({
    where: and(
      eq(companyModules.companyId, companyId),
      eq(companyModules.moduleId, moduleId),
    ),
  });

  if (existing) {
    await db
      .update(companyModules)
      .set({
        isActive,
        ...(isActive
          ? { activatedAt: new Date(), activatedBy: userId, deactivatedAt: null }
          : { deactivatedAt: new Date() }),
      })
      .where(
        and(
          eq(companyModules.companyId, companyId),
          eq(companyModules.moduleId, moduleId),
        ),
      );
  } else {
    await db.insert(companyModules).values({
      companyId,
      moduleId,
      isActive,
      activatedBy: userId,
    });
  }
}
