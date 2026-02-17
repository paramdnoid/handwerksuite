import { db } from "../client";
import { tenants } from "../schema/tenants";
import { users, tenantMembers } from "../schema/users";

async function seed() {
  console.log("Seeding database...");

  // Handwerkskammer (Authority)
  const [hwk] = await db
    .insert(tenants)
    .values({
      name: "Handwerkskammer Berlin",
      type: "authority",
      craftType: null,
    })
    .returning();

  // Beispiel-Handwerksbetrieb
  const [craftBusiness] = await db
    .insert(tenants)
    .values({
      name: "Müller Elektrotechnik GmbH",
      type: "craft_business",
      craftType: "elektro",
      hwkNumber: "HWK-B-2024-001234",
      subscriptionTier: "professional",
    })
    .returning();

  // Admin-User
  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@mueller-elektro.de",
      name: "Max Müller",
      emailVerified: true,
    })
    .returning();

  // Tenant-Mitgliedschaft
  await db.insert(tenantMembers).values({
    tenantId: craftBusiness.id,
    userId: adminUser.id,
    role: "owner",
  });

  console.log("Seed completed:");
  console.log(`  - Authority: ${hwk.name} (${hwk.id})`);
  console.log(`  - Craft Business: ${craftBusiness.name} (${craftBusiness.id})`);
  console.log(`  - User: ${adminUser.name} (${adminUser.id})`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
