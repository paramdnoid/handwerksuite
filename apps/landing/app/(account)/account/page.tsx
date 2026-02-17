import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from "@zunftgewerk/ui";
import {
  CreditCard,
  Users,
  Puzzle,
  HardDrive,
  UserPlus,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import {
  mockUser,
  mockCompany,
  mockSubscription,
  mockSubscriptionLimits,
  mockCurrentUsage,
  mockModules,
  mockMembers,
} from "@/lib/mock-data";

export default function AccountOverviewPage() {
  const activeModules = mockModules.filter((m) => m.isActive).length;
  const totalModules = mockModules.filter((m) => m.isAvailable).length;
  const storagePercent = Math.round(
    (mockCurrentUsage.storageMb / mockSubscriptionLimits.maxStorageMb) * 100,
  );
  const storageGb = (mockCurrentUsage.storageMb / 1024).toFixed(1);
  const storageLimitGb = (mockSubscriptionLimits.maxStorageMb / 1024).toFixed(0);

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Willkommen, {mockUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie Ihr Konto für{" "}
          <span className="font-medium text-foreground">
            {mockCompany.name}
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Aktueller Plan</CardDescription>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Professional</span>
              <Badge variant="secondary">Aktiv</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nächste Verlängerung:{" "}
              {mockSubscription.currentPeriodEnd.toLocaleDateString("de-DE")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Team-Mitglieder</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.length}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {mockSubscriptionLimits.maxUsers}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockSubscriptionLimits.maxUsers - mockMembers.length} Plätze
              verfügbar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Aktive Module</CardDescription>
            <Puzzle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeModules}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {totalModules} verfügbar
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalModules - activeModules} weitere Module aktivierbar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Speicher</CardDescription>
            <HardDrive className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storageGb}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {storageLimitGb} GB
              </span>
            </div>
            <Progress value={storagePercent} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">
          Schnellaktionen
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/account/team" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Mitglied einladen</p>
                  <p className="text-sm text-muted-foreground">
                    Neues Team-Mitglied hinzufügen
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/subscription" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Plan verwalten</p>
                  <p className="text-sm text-muted-foreground">
                    Abonnement und Rechnungen
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/modules" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Module verwalten</p>
                  <p className="text-sm text-muted-foreground">
                    Funktionen aktivieren
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
