import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { requireUserWithCompany } from "@/lib/dal/auth";
import { getCompanyMembers } from "@/lib/dal/members";
import { getCompanyModules } from "@/lib/dal/modules";
import { getSubscriptionWithPlan, getCurrentUsage } from "@/lib/dal/subscription";
import type { SubscriptionTier } from "@zunftgewerk/types";

export default async function AccountOverviewPage() {
  const ctx = await requireUserWithCompany();

  const [members, modules, subscriptionData, usage] = await Promise.all([
    getCompanyMembers(ctx.company.id),
    getCompanyModules(ctx.company.id, ctx.company.craftType),
    getSubscriptionWithPlan(ctx.company.id, ctx.company.subscriptionTier as SubscriptionTier),
    getCurrentUsage(ctx.company.id),
  ]);

  const activeModules = modules.filter((m) => m.isActive).length;
  const totalModules = modules.filter((m) => m.isAvailable).length;
  const storagePercent =
    subscriptionData.limits.maxStorageMb > 0
      ? Math.round(
          (usage.storageMb / subscriptionData.limits.maxStorageMb) * 100,
        )
      : 0;
  const storageGb = (usage.storageMb / 1024).toFixed(1);
  const storageLimitGb =
    subscriptionData.limits.maxStorageMb > 0
      ? (subscriptionData.limits.maxStorageMb / 1024).toFixed(0)
      : "∞";

  const tierLabel =
    subscriptionData.tier.charAt(0).toUpperCase() +
    subscriptionData.tier.slice(1);

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Willkommen, {ctx.user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie Ihr Konto für{" "}
          <span className="font-medium text-foreground">
            {ctx.company.name}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Aktueller Plan</CardDescription>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{tierLabel}</span>
              <Badge variant="secondary">Aktiv</Badge>
            </div>
            {subscriptionData.subscription && (
              <p className="text-xs text-muted-foreground mt-1">
                Nächste Verlängerung:{" "}
                {subscriptionData.subscription.currentPeriodEnd.toLocaleDateString(
                  "de-DE",
                )}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Team-Mitglieder</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.length}
              {subscriptionData.limits.maxUsers > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {subscriptionData.limits.maxUsers}
                </span>
              )}
            </div>
            {subscriptionData.limits.maxUsers > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(0, subscriptionData.limits.maxUsers - members.length)}{" "}
                Plätze verfügbar
              </p>
            )}
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
            {subscriptionData.limits.maxStorageMb > 0 && (
              <Progress value={storagePercent} className="mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

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
