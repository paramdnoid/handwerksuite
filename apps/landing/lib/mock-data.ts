import type {
  Company,
  CompanyMember,
  CompanySettings,
  SubscriptionTier,
} from "@zunftgewerk/types";
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionLimits,
  BillingInvoice,
} from "@zunftgewerk/types";
import type { ModuleWithStatus } from "@zunftgewerk/types";

// ── Mock User ────────────────────────────────────────────

export const mockUser = {
  id: "usr_01",
  name: "Max Mustermann",
  email: "max@mustermann-shk.de",
  image: null,
  emailVerified: true,
};

// ── Mock Company ─────────────────────────────────────────

export const mockCompany: Company = {
  id: "comp_01",
  slug: "mustermann-shk",
  name: "Mustermann SHK GmbH",
  legalName: "Mustermann Sanitär-, Heizungs- und Klimatechnik GmbH",
  companyType: "craft_business",
  craftType: "shk" as any,
  hwkNumber: "HWK-2024-00142",
  taxId: "123/456/78901",
  vatId: "DE123456789",
  logoUrl: null,
  subscriptionTier: "professional" as SubscriptionTier,
  lagoCustomerId: "lago_cust_01",
  isActive: true,
  onboardingCompletedAt: new Date("2024-06-15"),
  createdAt: new Date("2024-06-01"),
  updatedAt: new Date("2025-02-10"),
  deletedAt: null,
};

export const mockCompanySettings: CompanySettings = {
  id: "settings_01",
  companyId: "comp_01",
  locale: "de-DE",
  timezone: "Europe/Berlin",
  currency: "EUR",
  defaultTaxRate: 19,
  invoicePrefix: "RE",
  invoiceNextNumber: 1042,
  fiscalYearStartMonth: 1,
  customSettings: null,
};

// ── Mock Subscription ────────────────────────────────────

export const mockSubscription: Subscription = {
  id: "sub_01",
  companyId: "comp_01",
  planId: "plan_professional",
  tier: "professional",
  status: "active",
  lagoCustomerId: "lago_cust_01",
  lagoSubscriptionId: "lago_sub_01",
  currentPeriodStart: new Date("2025-02-01"),
  currentPeriodEnd: new Date("2025-03-01"),
  cancelAtPeriodEnd: false,
  createdAt: new Date("2024-06-01"),
};

export const mockSubscriptionLimits: SubscriptionLimits = {
  maxUsers: 5,
  maxProjects: -1,
  maxStorageMb: 10240,
  maxCustomers: -1,
  offlineSync: true,
  desktopApp: true,
  mobileApp: true,
  apiAccess: true,
  prioritySupport: true,
};

export const mockCurrentUsage = {
  users: 3,
  projects: 47,
  customers: 128,
  storageMb: 3840,
};

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    tier: "starter",
    name: "Starter",
    description: "Perfekt für Einzelunternehmer und Kleinbetriebe.",
    priceMonthly: 49,
    priceYearly: 468,
    currency: "EUR",
    features: [
      { key: "customers", label: "Bis zu 50 Kunden", included: true },
      { key: "projects", label: "100 Projekte / Jahr", included: true },
      { key: "users", label: "1 Benutzer", included: true },
      { key: "mobile", label: "Mobile App", included: true },
      { key: "support", label: "E-Mail-Support", included: true },
      { key: "api", label: "API-Zugang", included: false },
    ],
    limits: {
      maxUsers: 1,
      maxProjects: 100,
      maxStorageMb: 2048,
      maxCustomers: 50,
      offlineSync: false,
      desktopApp: false,
      mobileApp: true,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: "plan_professional",
    tier: "professional",
    name: "Professional",
    description: "Für wachsende Betriebe mit mehreren Mitarbeitern.",
    priceMonthly: 99,
    priceYearly: 948,
    currency: "EUR",
    features: [
      { key: "customers", label: "Unbegrenzte Kunden", included: true },
      { key: "projects", label: "Unbegrenzte Projekte", included: true },
      { key: "users", label: "Bis zu 5 Benutzer", included: true },
      { key: "apps", label: "Mobile + Desktop App", included: true },
      { key: "support", label: "Prioritäts-Support", included: true },
      { key: "api", label: "API-Zugang", included: true },
    ],
    limits: {
      maxUsers: 5,
      maxProjects: -1,
      maxStorageMb: 10240,
      maxCustomers: -1,
      offlineSync: true,
      desktopApp: true,
      mobileApp: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
  {
    id: "plan_enterprise",
    tier: "enterprise",
    name: "Enterprise",
    description: "Für große Unternehmen mit individuellen Anforderungen.",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "EUR",
    features: [
      { key: "everything", label: "Alles aus Professional", included: true },
      { key: "users", label: "Unbegrenzte Benutzer", included: true },
      { key: "manager", label: "Dedizierter Account-Manager", included: true },
      { key: "integrations", label: "Custom Integrationen", included: true },
      { key: "onprem", label: "On-Premise Option", included: true },
      { key: "sla", label: "SLA-Garantie (99,9%)", included: true },
    ],
    limits: {
      maxUsers: -1,
      maxProjects: -1,
      maxStorageMb: -1,
      maxCustomers: -1,
      offlineSync: true,
      desktopApp: true,
      mobileApp: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
];

// ── Mock Invoices ────────────────────────────────────────

export const mockInvoices: BillingInvoice[] = [
  {
    id: "inv_06",
    companyId: "comp_01",
    subscriptionId: "sub_01",
    amount: 99,
    currency: "EUR",
    status: "paid",
    issuedAt: new Date("2025-02-01"),
    dueAt: new Date("2025-02-15"),
    paidAt: new Date("2025-02-03"),
  },
  {
    id: "inv_05",
    companyId: "comp_01",
    subscriptionId: "sub_01",
    amount: 99,
    currency: "EUR",
    status: "paid",
    issuedAt: new Date("2025-01-01"),
    dueAt: new Date("2025-01-15"),
    paidAt: new Date("2025-01-02"),
  },
  {
    id: "inv_04",
    companyId: "comp_01",
    subscriptionId: "sub_01",
    amount: 99,
    currency: "EUR",
    status: "paid",
    issuedAt: new Date("2024-12-01"),
    dueAt: new Date("2024-12-15"),
    paidAt: new Date("2024-12-04"),
  },
  {
    id: "inv_03",
    companyId: "comp_01",
    subscriptionId: "sub_01",
    amount: 99,
    currency: "EUR",
    status: "paid",
    issuedAt: new Date("2024-11-01"),
    dueAt: new Date("2024-11-15"),
    paidAt: new Date("2024-11-01"),
  },
];

// ── Mock Team ────────────────────────────────────────────

export const mockMembers: (CompanyMember & {
  userName: string;
  userEmail: string;
  userImage: string | null;
})[] = [
  {
    id: "mem_01",
    companyId: "comp_01",
    userId: "usr_01",
    role: "owner",
    invitedBy: null,
    joinedAt: new Date("2024-06-01"),
    leftAt: null,
    userName: "Max Mustermann",
    userEmail: "max@mustermann-shk.de",
    userImage: null,
  },
  {
    id: "mem_02",
    companyId: "comp_01",
    userId: "usr_02",
    role: "admin",
    invitedBy: "usr_01",
    joinedAt: new Date("2024-07-15"),
    leftAt: null,
    userName: "Anna Schmidt",
    userEmail: "anna@mustermann-shk.de",
    userImage: null,
  },
  {
    id: "mem_03",
    companyId: "comp_01",
    userId: "usr_03",
    role: "employee",
    invitedBy: "usr_01",
    joinedAt: new Date("2024-09-01"),
    leftAt: null,
    userName: "Thomas Weber",
    userEmail: "thomas@mustermann-shk.de",
    userImage: null,
  },
];

export const mockInvitations = [
  {
    id: "inv_pend_01",
    companyId: "comp_01",
    email: "sarah@beispiel.de",
    role: "employee" as const,
    invitedBy: "usr_01",
    token: "tok_abc123",
    expiresAt: new Date("2025-03-01"),
    acceptedAt: null,
    createdAt: new Date("2025-02-15"),
  },
];

// ── Mock Modules ─────────────────────────────────────────

export const mockModules: ModuleWithStatus[] = [
  {
    id: "mod_01",
    key: "customers",
    name: "Kundenverwaltung",
    description: "Kunden und Kontakte verwalten, Kommunikation nachverfolgen.",
    category: "core",
    icon: "users",
    isCore: true,
    sortOrder: 1,
    isAvailable: true,
    isActive: true,
    platforms: ["web", "mobile", "desktop"],
  },
  {
    id: "mod_02",
    key: "projects",
    name: "Projektverwaltung",
    description: "Projekte planen, zuweisen und den Fortschritt verfolgen.",
    category: "core",
    icon: "folder",
    isCore: true,
    sortOrder: 2,
    isAvailable: true,
    isActive: true,
    platforms: ["web", "mobile", "desktop"],
  },
  {
    id: "mod_03",
    key: "invoicing",
    name: "Rechnungsstellung",
    description: "Rechnungen erstellen, versenden und Zahlungen verfolgen.",
    category: "verwaltung",
    icon: "receipt",
    isCore: false,
    sortOrder: 3,
    isAvailable: true,
    isActive: true,
    platforms: ["web", "desktop"],
  },
  {
    id: "mod_04",
    key: "scheduling",
    name: "Terminplanung",
    description: "Termine und Einsätze für das Team koordinieren.",
    category: "verwaltung",
    icon: "calendar",
    isCore: false,
    sortOrder: 4,
    isAvailable: true,
    isActive: true,
    platforms: ["web", "mobile"],
  },
  {
    id: "mod_05",
    key: "inspection",
    name: "Prüfprotokolle",
    description: "Digitale Prüfprotokolle erstellen und archivieren.",
    category: "pruefung",
    icon: "clipboard-check",
    isCore: false,
    sortOrder: 5,
    isAvailable: true,
    isActive: false,
    platforms: ["web", "mobile"],
  },
  {
    id: "mod_06",
    key: "inventory",
    name: "Lagerverwaltung",
    description: "Materialbestand und Bestellungen im Blick behalten.",
    category: "verwaltung",
    icon: "package",
    isCore: false,
    sortOrder: 6,
    isAvailable: true,
    isActive: false,
    platforms: ["web", "desktop"],
  },
  {
    id: "mod_07",
    key: "chimney_sweep",
    name: "Kaminfeger-Modul",
    description: "Feuerstättenschau, Kehrbezirke und Messprotokolle.",
    category: "branchenspezifisch",
    icon: "flame",
    isCore: false,
    sortOrder: 7,
    isAvailable: false,
    isActive: false,
    platforms: ["web", "mobile"],
  },
  {
    id: "mod_08",
    key: "time_tracking",
    name: "Zeiterfassung",
    description: "Arbeitszeiten erfassen und Projekte zuordnen.",
    category: "verwaltung",
    icon: "clock",
    isCore: false,
    sortOrder: 8,
    isAvailable: true,
    isActive: true,
    platforms: ["web", "mobile", "desktop"],
  },
];

// ── Mock Sessions ────────────────────────────────────────

export const mockSessions = [
  {
    id: "sess_01",
    device: "Chrome auf macOS",
    ip: "192.168.1.42",
    lastActive: new Date("2025-02-17T10:30:00"),
    isCurrent: true,
  },
  {
    id: "sess_02",
    device: "Safari auf iPhone",
    ip: "192.168.1.43",
    lastActive: new Date("2025-02-16T18:15:00"),
    isCurrent: false,
  },
  {
    id: "sess_03",
    device: "Firefox auf Windows",
    ip: "10.0.0.15",
    lastActive: new Date("2025-02-14T09:00:00"),
    isCurrent: false,
  },
];
