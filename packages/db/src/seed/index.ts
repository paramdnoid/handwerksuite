import { hashPassword } from "better-auth/crypto";
import { db } from "../client";
import { companies, companySettings } from "../schema/companies";
import { users, accounts } from "../schema/users";
import { companyMembers } from "../schema/members";
import { modules, craftTypeModules, companyModules } from "../schema/modules";

async function seed() {
  console.log("Seeding database...");

  // ── Core Modules (available to all craft types) ──────────
  const coreModules = await db
    .insert(modules)
    .values([
      { key: "kundenverwaltung", name: "Kundenverwaltung", description: "Kunden anlegen, bearbeiten und verwalten", category: "core", icon: "Users", isCore: true, sortOrder: 1 },
      { key: "projektverwaltung", name: "Projektverwaltung", description: "Projekte und Aufträge verwalten", category: "core", icon: "FolderKanban", isCore: true, sortOrder: 2 },
      { key: "rechnungsstellung", name: "Rechnungsstellung", description: "Rechnungen, Angebote und Kostenvoranschläge", category: "core", icon: "Receipt", isCore: true, sortOrder: 3 },
      { key: "zeiterfassung", name: "Zeiterfassung", description: "Arbeitszeiten und Projektzeiten erfassen", category: "core", icon: "Clock", isCore: true, sortOrder: 4 },
      { key: "dokumentenverwaltung", name: "Dokumentenverwaltung", description: "Dokumente und Dateien organisieren", category: "core", icon: "FileText", isCore: true, sortOrder: 5 },
      { key: "terminplanung", name: "Terminplanung", description: "Termine und Einsatzplanung", category: "core", icon: "Calendar", isCore: true, sortOrder: 6 },
      { key: "mitarbeiterverwaltung", name: "Mitarbeiterverwaltung", description: "Team und Mitarbeiter verwalten", category: "core", icon: "UserCog", isCore: true, sortOrder: 7 },
    ])
    .returning();

  // ── Craft-Specific Modules ───────────────────────────────
  const craftModules = await db
    .insert(modules)
    .values([
      // Schornsteinfeger
      { key: "kehrbuch", name: "Kehrbuch", description: "Digitales Kehrbuch nach KÜO", category: "branchenspezifisch", icon: "Flame", isCore: false, sortOrder: 10 },
      { key: "feuerschau", name: "Feuerstättenschau", description: "Feuerstättenschau-Protokolle", category: "pruefung", icon: "Shield", isCore: false, sortOrder: 11 },
      { key: "abgasmessung", name: "Abgasmessung", description: "Abgasmessung und Emissionsprüfung", category: "pruefung", icon: "Gauge", isCore: false, sortOrder: 12 },
      { key: "co_warnercheck", name: "CO-Warnercheck", description: "CO-Warner-Überprüfung", category: "pruefung", icon: "AlertTriangle", isCore: false, sortOrder: 13 },
      // Elektro
      { key: "e_check", name: "E-Check", description: "E-Check Prüfprotokolle", category: "pruefung", icon: "Zap", isCore: false, sortOrder: 20 },
      { key: "dguv_v3", name: "DGUV V3 Prüfung", description: "DGUV Vorschrift 3 Prüfprotokolle", category: "pruefung", icon: "ClipboardCheck", isCore: false, sortOrder: 21 },
      { key: "schaltplanerstellung", name: "Schaltplanerstellung", description: "Schaltpläne erstellen und verwalten", category: "branchenspezifisch", icon: "CircuitBoard", isCore: false, sortOrder: 22 },
      // SHK
      { key: "heizungswartung", name: "Heizungswartung", description: "Wartungsprotokolle für Heizungsanlagen", category: "pruefung", icon: "Thermometer", isCore: false, sortOrder: 30 },
      { key: "rohrnetzberechnung", name: "Rohrnetzberechnung", description: "Berechnung von Rohrnetzen", category: "branchenspezifisch", icon: "GitBranch", isCore: false, sortOrder: 31 },
      { key: "energieausweis", name: "Energieausweis", description: "Energieausweis-Erstellung nach GEG", category: "branchenspezifisch", icon: "Leaf", isCore: false, sortOrder: 32 },
      // Maler
      { key: "farbmischung", name: "Farbmischung", description: "Farbrezepturen und Mischverhältnisse", category: "branchenspezifisch", icon: "Palette", isCore: false, sortOrder: 40 },
      { key: "aufmassung", name: "Aufmaßerfassung", description: "Digitale Aufmaßerfassung vor Ort", category: "verwaltung", icon: "Ruler", isCore: false, sortOrder: 41 },
      { key: "raumberechnung", name: "Raumberechnung", description: "Flächen- und Raumberechnung", category: "verwaltung", icon: "Square", isCore: false, sortOrder: 42 },
      // Dachdecker
      { key: "dachaufmass", name: "Dachaufmaß", description: "Digitales Dachaufmaß mit Neigungsberechnung", category: "branchenspezifisch", icon: "Home", isCore: false, sortOrder: 50 },
      // Zimmerer
      { key: "holzliste", name: "Holzliste / Abbundplan", description: "Holzlisten und Abbundpläne erstellen", category: "branchenspezifisch", icon: "TreePine", isCore: false, sortOrder: 60 },
      // KFZ
      { key: "fahrzeugakte", name: "Fahrzeugakte", description: "Digitale Fahrzeugakten und Wartungshistorie", category: "branchenspezifisch", icon: "Car", isCore: false, sortOrder: 70 },
      { key: "hu_vorbereitung", name: "HU-Vorbereitung", description: "Hauptuntersuchung vorbereiten", category: "pruefung", icon: "BadgeCheck", isCore: false, sortOrder: 71 },
    ])
    .returning();

  // ── Helper: Find module ID by key ────────────────────────
  const allModules = [...coreModules, ...craftModules];
  const moduleByKey = (key: string) => {
    const m = allModules.find((mod) => mod.key === key);
    if (!m) throw new Error(`Module not found: ${key}`);
    return m.id;
  };

  // ── Craft Type Module Mappings ───────────────────────────
  await db.insert(craftTypeModules).values([
    // Schornsteinfeger modules
    { craftType: "schornsteinfeger", moduleId: moduleByKey("kehrbuch"), platform: "all" as const, enabledByDefault: true },
    { craftType: "schornsteinfeger", moduleId: moduleByKey("feuerschau"), platform: "all" as const, enabledByDefault: true },
    { craftType: "schornsteinfeger", moduleId: moduleByKey("abgasmessung"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "schornsteinfeger", moduleId: moduleByKey("abgasmessung"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "schornsteinfeger", moduleId: moduleByKey("co_warnercheck"), platform: "all" as const, enabledByDefault: true },

    // Elektro modules
    { craftType: "elektro", moduleId: moduleByKey("e_check"), platform: "all" as const, enabledByDefault: true },
    { craftType: "elektro", moduleId: moduleByKey("dguv_v3"), platform: "web" as const, enabledByDefault: true },
    { craftType: "elektro", moduleId: moduleByKey("dguv_v3"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "elektro", moduleId: moduleByKey("schaltplanerstellung"), platform: "web" as const, enabledByDefault: false },
    { craftType: "elektro", moduleId: moduleByKey("schaltplanerstellung"), platform: "desktop" as const, enabledByDefault: false },

    // SHK modules
    { craftType: "shk", moduleId: moduleByKey("heizungswartung"), platform: "all" as const, enabledByDefault: true },
    { craftType: "shk", moduleId: moduleByKey("rohrnetzberechnung"), platform: "web" as const, enabledByDefault: true },
    { craftType: "shk", moduleId: moduleByKey("rohrnetzberechnung"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "shk", moduleId: moduleByKey("energieausweis"), platform: "web" as const, enabledByDefault: false },

    // Maler modules
    { craftType: "maler", moduleId: moduleByKey("farbmischung"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "maler", moduleId: moduleByKey("aufmassung"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "maler", moduleId: moduleByKey("aufmassung"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "maler", moduleId: moduleByKey("raumberechnung"), platform: "all" as const, enabledByDefault: true },

    // Dachdecker modules
    { craftType: "dachdecker", moduleId: moduleByKey("dachaufmass"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "dachdecker", moduleId: moduleByKey("dachaufmass"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "dachdecker", moduleId: moduleByKey("aufmassung"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "dachdecker", moduleId: moduleByKey("aufmassung"), platform: "desktop" as const, enabledByDefault: true },

    // Zimmerer modules
    { craftType: "zimmerer", moduleId: moduleByKey("holzliste"), platform: "desktop" as const, enabledByDefault: true },
    { craftType: "zimmerer", moduleId: moduleByKey("aufmassung"), platform: "mobile" as const, enabledByDefault: true },
    { craftType: "zimmerer", moduleId: moduleByKey("aufmassung"), platform: "desktop" as const, enabledByDefault: true },

    // KFZ modules
    { craftType: "kfz", moduleId: moduleByKey("fahrzeugakte"), platform: "all" as const, enabledByDefault: true },
    { craftType: "kfz", moduleId: moduleByKey("hu_vorbereitung"), platform: "all" as const, enabledByDefault: true },
  ]);

  // ── Authority (Handwerkskammer) ──────────────────────────
  const [hwk] = await db
    .insert(companies)
    .values({
      slug: "hwk-berlin",
      name: "Handwerkskammer Berlin",
      companyType: "authority",
      craftType: null,
      subscriptionTier: "enterprise",
      isActive: true,
    })
    .returning();

  await db.insert(companySettings).values({
    companyId: hwk.id,
  });

  // ── Example Craft Business ───────────────────────────────
  const [craftBusiness] = await db
    .insert(companies)
    .values({
      slug: "mueller-elektrotechnik",
      name: "Müller Elektrotechnik GmbH",
      legalName: "Müller Elektrotechnik GmbH",
      companyType: "craft_business",
      craftType: "elektro",
      hwkNumber: "HWK-B-2024-001234",
      subscriptionTier: "professional",
      isActive: true,
    })
    .returning();

  await db.insert(companySettings).values({
    companyId: craftBusiness.id,
    invoicePrefix: "ME",
  });

  // ── Admin User ───────────────────────────────────────────
  const SEED_PASSWORD = "Test1234!@#$";
  const hashedPw = await hashPassword(SEED_PASSWORD);

  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@mueller-elektro.de",
      name: "Max Müller",
      emailVerified: true,
    })
    .returning();

  // ── Credential Account (for email/password login) ──────
  await db.insert(accounts).values({
    userId: adminUser.id,
    providerId: "credential",
    providerAccountId: adminUser.id,
    password: hashedPw,
  });

  // ── Company Membership ───────────────────────────────────
  await db.insert(companyMembers).values({
    companyId: craftBusiness.id,
    userId: adminUser.id,
    role: "owner",
  });

  // ── Activate default modules for the craft business ──────
  const elektroModuleKeys = ["e_check", "dguv_v3", "schaltplanerstellung"];
  const defaultModuleIds = [
    ...coreModules.map((m) => m.id),
    ...craftModules.filter((m) => elektroModuleKeys.includes(m.key)).map((m) => m.id),
  ];

  await db.insert(companyModules).values(
    defaultModuleIds.map((moduleId) => ({
      companyId: craftBusiness.id,
      moduleId,
      isActive: true,
      activatedBy: adminUser.id,
    })),
  );

  console.log("Seed completed:");
  console.log(`  - Authority: ${hwk.name} (${hwk.id})`);
  console.log(`  - Craft Business: ${craftBusiness.name} (${craftBusiness.id})`);
  console.log(`  - User: ${adminUser.name} (${adminUser.id})`);
  console.log(`  - Email: admin@mueller-elektro.de`);
  console.log(`  - Password: ${SEED_PASSWORD}`);
  console.log(`  - Core Modules: ${coreModules.length}`);
  console.log(`  - Craft Modules: ${craftModules.length}`);
  console.log(`  - Activated Modules: ${defaultModuleIds.length}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
