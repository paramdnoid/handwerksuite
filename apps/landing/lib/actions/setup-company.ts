'use server';

import { db } from '@zunftgewerk/db/client';
import { companies, companySettings, companyMembers, users } from '@zunftgewerk/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function setupCompanyForUser(input: {
  userId: string;
  companyName: string;
  craftType: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, input.userId))
      .limit(1);

    if (!user) {
      return { success: false, error: 'Benutzer nicht gefunden.' };
    }

    const existingMembership = await db
      .select({ id: companyMembers.id })
      .from(companyMembers)
      .where(and(eq(companyMembers.userId, input.userId), isNull(companyMembers.leftAt)))
      .limit(1);

    if (existingMembership.length > 0) {
      return { success: true };
    }

    const baseSlug = generateSlug(input.companyName);
    let slug = baseSlug || 'firma';
    let suffix = 0;

    for (;;) {
      const existing = await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    const [company] = await db
      .insert(companies)
      .values({
        slug,
        name: input.companyName,
        companyType: 'craft_business',
        craftType: input.craftType as any,
        subscriptionTier: 'free',
      })
      .returning();

    await db.insert(companySettings).values({
      companyId: company.id,
    });

    await db.insert(companyMembers).values({
      companyId: company.id,
      userId: input.userId,
      role: 'owner',
    });

    return { success: true };
  } catch (err) {
    console.error('setupCompanyForUser failed:', err);
    return {
      success: false,
      error: 'Firma konnte nicht erstellt werden.',
    };
  }
}
