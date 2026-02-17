"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@zunftgewerk/ui";
import { Check, Download } from "lucide-react";
import {
  mockSubscription,
  mockSubscriptionLimits,
  mockCurrentUsage,
  mockPlans,
  mockInvoices,
} from "@/lib/mock-data";

function LimitBar({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max: number;
}) {
  const isUnlimited = max === -1;
  const percent = isUnlimited ? 0 : Math.round((current / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {current}
          {isUnlimited ? " (unbegrenzt)" : ` / ${max}`}
        </span>
      </div>
      {!isUnlimited && <Progress value={percent} />}
    </div>
  );
}

export default function SubscriptionPage() {
  const currentPlan = mockPlans.find(
    (p) => p.tier === mockSubscription.tier,
  );

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Abonnement
        </h1>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie Ihren Plan, Limits und Rechnungen.
        </p>
      </div>

      {/* Aktueller Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktueller Plan</CardTitle>
              <CardDescription>
                Ihr aktives Abonnement und die nächste Verlängerung.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {mockSubscription.status === "active"
                ? "Aktiv"
                : mockSubscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {currentPlan?.name ?? "Professional"}
            </span>
            {currentPlan && currentPlan.priceMonthly > 0 && (
              <span className="text-muted-foreground">
                {currentPlan.priceMonthly} € / Monat
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Aktuelle Periode:{" "}
            {mockSubscription.currentPeriodStart.toLocaleDateString("de-DE")} –{" "}
            {mockSubscription.currentPeriodEnd.toLocaleDateString("de-DE")}
          </p>
        </CardContent>
      </Card>

      {/* Nutzungs-Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Nutzung</CardTitle>
          <CardDescription>
            Aktuelle Auslastung Ihres Plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LimitBar
            label="Benutzer"
            current={mockCurrentUsage.users}
            max={mockSubscriptionLimits.maxUsers}
          />
          <LimitBar
            label="Projekte"
            current={mockCurrentUsage.projects}
            max={mockSubscriptionLimits.maxProjects}
          />
          <LimitBar
            label="Kunden"
            current={mockCurrentUsage.customers}
            max={mockSubscriptionLimits.maxCustomers}
          />
          <LimitBar
            label="Speicher (MB)"
            current={mockCurrentUsage.storageMb}
            max={mockSubscriptionLimits.maxStorageMb}
          />
        </CardContent>
      </Card>

      {/* Plan-Vergleich */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">
          Verfügbare Pläne
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {mockPlans.map((plan) => {
            const isCurrent = plan.tier === mockSubscription.tier;
            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? "border-primary ring-1 ring-primary" : ""
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrent && <Badge>Aktuell</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {plan.priceMonthly > 0 ? (
                      <>
                        {plan.priceMonthly} €
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / Monat
                        </span>
                      </>
                    ) : (
                      <span className="text-lg">Auf Anfrage</span>
                    )}
                  </div>
                  <Separator />
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f.key} className="flex items-center gap-2">
                        <Check
                          className={`size-4 ${f.included ? "text-primary" : "text-muted-foreground/30"}`}
                        />
                        <span
                          className={
                            f.included ? "" : "text-muted-foreground line-through"
                          }
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <Button
                      className="w-full"
                      variant={plan.tier === "enterprise" ? "outline" : "default"}
                    >
                      {plan.tier === "enterprise"
                        ? "Kontaktieren"
                        : "Upgraden"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsverlauf</CardTitle>
          <CardDescription>
            Ihre bisherigen Rechnungen und Zahlungen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rechnung</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    {invoice.issuedAt.toLocaleDateString("de-DE")}
                  </TableCell>
                  <TableCell>
                    {invoice.amount.toFixed(2)} {invoice.currency}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "paid" ? "secondary" : "outline"
                      }
                    >
                      {invoice.status === "paid"
                        ? "Bezahlt"
                        : invoice.status === "pending"
                          ? "Offen"
                          : invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Download className="size-4" />
                      <span className="sr-only">Herunterladen</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Kündigung */}
      <Card className="border-destructive/20">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Abonnement kündigen</p>
            <p className="text-sm text-muted-foreground">
              Ihr Zugang bleibt bis zum Ende der aktuellen Periode bestehen.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                Kündigen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Abonnement wirklich kündigen?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ihr Zugang bleibt bis zum{" "}
                  {mockSubscription.currentPeriodEnd.toLocaleDateString("de-DE")}{" "}
                  bestehen. Danach verlieren Sie den Zugriff auf
                  Premium-Funktionen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Ja, kündigen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
}
